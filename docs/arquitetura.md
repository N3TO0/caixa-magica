# Arquitetura do Projeto — Caixa Mágica MVP

> Documento técnico de arquitetura · M1 · IFS Campus Aracaju · Bolsa Futuro Digital – Capacita 04 · 2026

---

## Contexto

A Caixa Mágica é uma startup de economia compartilhada que oferece brinquedos e itens infantis para aluguel em Aracaju/SE. O objetivo deste projeto é desenvolver o MVP do site oficial, centralizando catálogo, disponibilidade, pedidos e acompanhamento do cliente.

Diferente de um e-commerce comum, nosso sistema lida com **aluguel temporal**. Cada produto pode ter várias unidades físicas no estoque (a Caixa Mágica pode ter três Jumperoos, dois bebês-conforto iguais, etc.). A disponibilidade não é binária ("tem ou não tem") — é função de quantas unidades existem e quantas estão reservadas naquele intervalo. Modelar essa lógica de período é a parte mais complexa do projeto, e a stack foi escolhida para lidar com ela.

---

## Stack Escolhida

### Back-end: FastAPI (Python 3.11)

Framework moderno, com validação de dados nativa via Pydantic e documentação OpenAPI automática. É rápido para desenvolver, fácil de manter, e gera contrato de API que o front consome desde o primeiro dia.

O mapeamento objeto-relacional é feito com **SQLAlchemy 2.0** — ORM padrão da indústria Python, com suporte async nativo na versão 2.0 e integração direta com FastAPI. As migrations são gerenciadas pelo **Alembic**, ferramenta oficial do ecossistema SQLAlchemy.

### Front-end: React 18 (com Vite)

Padrão de mercado, ecossistema grande, atende ao que o brief pede. Vite no lugar do Create React App por ser mais rápido e ter melhor experiência de desenvolvimento.

### Banco de Dados: PostgreSQL 15

Banco SQL maduro, com suporte robusto a tipos temporais (range types e operadores de intervalo) que facilitam as consultas de disponibilidade por período. Transações ACID confiáveis, integração sólida com Python via SQLAlchemy 2.0 + asyncpg, e flexibilidade para evoluir o schema sem dor.

MySQL e MongoDB seriam aceitáveis, mas o Postgres é a escolha mais alinhada com o tipo de query temporal que nosso domínio exige.

---

## Divisão do Trabalho

A divisão é **por domínio**, não por camada. Cada pessoa do back é dona do seu domínio do banco até o endpoint — modelos, regras de negócio, rotas e testes. Isso dá ownership real, reduz conflito de merge e faz com que cada um entenda seu pedaço por inteiro.

### Backend — 3 pessoas

| Domínio | Responsável | Escopo |
|---|---|---|
| Catálogo | Fernanda | Produtos, categorias, preços, imagens. Endpoints públicos de listagem e detalhe. |
| Pedido e Reserva | Caio Felipe | Criação de pedido, lógica de reserva temporal, máquina de estados, validação de disponibilidade. |
| Cliente, Auth e Admin | Neto | Cadastro, login JWT, perfil do usuário, painel administrativo. |

### Frontend — 2 pessoas

| Frente | Responsável | Escopo |
|---|---|---|
| Catálogo e produto | Adriele | Home, listagem com filtros, detalhe do produto, identidade visual. |
| Checkout e área do cliente | Ravel | Carrinho, finalização do pedido, login, "Meus Pedidos", painel admin. |

---

## Estrutura do Projeto (Monorepo)

```
caixa-magica/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/
│   └── app/
│       ├── main.py          # App FastAPI, routers, CORS, startup
│       ├── config.py        # Variáveis de ambiente (pydantic-settings)
│       ├── database.py      # Engine async, SessionLocal, Base declarativa
│       ├── core/
│       │   ├── security.py  # Hash de senha, geração e validação de JWT
│       │   ├── exceptions.py
│       │   └── responses.py # Formato padrão de response
│       ├── catalog/         # Domínio 1
│       │   ├── models.py
│       │   ├── schemas.py
│       │   ├── router.py
│       │   └── service.py
│       ├── orders/          # Domínio 2
│       │   ├── models.py
│       │   ├── schemas.py
│       │   ├── router.py
│       │   └── service.py
│       └── users/           # Domínio 3
│           ├── models.py
│           ├── schemas.py
│           ├── router.py
│           └── service.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── features/        # Funcionalidades por domínio
        ├── shared/          # Componentes e serviços compartilhados
        └── app/             # Configuração de rotas e providers
```

### Responsabilidade de cada arquivo por domínio

| Arquivo | Responsabilidade |
|---|---|
| `models.py` | Define as tabelas com SQLAlchemy. Apenas estrutura, sem lógica. |
| `schemas.py` | Define formatos de entrada e saída com Pydantic. Separa o que o banco armazena do que a API expõe. |
| `router.py` | Define as rotas. Recebe request, chama o service, retorna response. Sem lógica de negócio. |
| `service.py` | Onde a lógica vive. Valida regras, acessa o banco, toma decisões. |

---

## Modelo de Dados

### Decisão central de disponibilidade 

A Caixa Mágica não rastreia qual unidade física saiu para qual cliente. O modelo usa `total_units INT` em `products` e valida disponibilidade contando reservas ativas no período:

```
disponível = total_units - COUNT(reservas ativas no período solicitado)
```

Essa validação é feita em aplicação com apoio de índice GiST em `reservations`.

### Entidades MVP (12 tabelas)

| Tabela | Domínio | Descrição |
|---|---|---|
| `users` | Usuários | Clientes e administradores |
| `addresses` | Usuários | Endereços dos usuários |
| `payments` | Usuários | Registros de pagamento |
| `categories` | Catálogo | Categorias com hierarquia (parent_id) |
| `product_categories` | Catálogo | Relação N:N entre produtos e categorias |
| `products` | Catálogo | Catálogo de produtos |
| `product_pricing` | Catálogo | Preços por período (7, 15, 30 dias) |
| `product_images` | Catálogo | Fotos dos produtos |
| `orders` | Pedidos | Pedidos de aluguel |
| `order_items` | Pedidos | Itens do pedido com preço congelado |
| `reservations` | Pedidos | Controle de disponibilidade temporal |
| `order_status_history` | Pedidos | Histórico imutável de mudanças de status |

### Entidades fora do MVP (schema criado, endpoints não implementados)

| Tabela | Descrição |
|---|---|
| `renewals` | Renovação de aluguel em andamento |
| `order_notes` | Observações internas e mensagens ao cliente |
| `waitlist` | Lista de espera por produto |
| `promotions` | Cupons e promoções |

---

## Máquina de Estados do Pedido

```
pendente → confirmado → em_uso → devolvido → finalizado
               ↓                      ↓
           cancelado               atrasado → devolvido → finalizado
```

| Status | Descrição |
|---|---|
| `pendente` | Pedido criado. Aguarda contato da Caixa Mágica em até 3 dias úteis. |
| `confirmado` | Confirmado pela loja e pelo cliente. Entrega a ser agendada. |
| `em_uso` | Produto entregue ou retirado. Aluguel em andamento. |
| `devolvido` | Produto retornou. Aguarda conferência. |
| `finalizado` | Conferência concluída sem pendências. Pedido encerrado. |
| `cancelado` | Cancelado por qualquer motivo. |
| `atrasado` | Data de devolução passou sem retorno do produto. |

---

## Endpoints da API

### Catálogo (público)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/v1/produtos` | Lista produtos ativos com preços e imagens |
| GET | `/api/v1/produtos/{id}` | Detalhe do produto com 404 para inexistente |
| GET | `/api/v1/produtos/categorias` | Lista categorias ativas |

### Usuários e Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/auth/register` | Cadastro com hash de senha |
| POST | `/api/v1/auth/login` | Login com retorno de JWT |
| GET | `/api/v1/usuarios/me` | Perfil do usuário logado (protegido) |

### Pedidos (protegidos por JWT)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/pedidos` | Criar pedido com validação de disponibilidade |
| GET | `/api/v1/pedidos/{id}` | Detalhe do pedido com autorização por dono |

### Formato padrão de response

```json
// Sucesso
{ "success": true, "data": {}, "message": "ok" }

// Erro
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Recurso não encontrado" } }
```

---

## Padrões do Projeto

| Padrão | Decisão |
|---|---|
| Tabelas e colunas | Inglês |
| Valores de enum | Português |
| Branches | `feature/nome-da-feature` e `fix/nome-do-bug` |
| Commits | Convenção: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` |
| Code review | Obrigatório antes de qualquer merge na main |
| Resposta da API | Envelope `{ success, data, message }` padronizado |
| ORM | SQLAlchemy 2.0 com `Mapped` e `mapped_column` |

---

## Decisões Arquiteturais

**Por que domain-based e não layer-based?**
Com 3 desenvolvedores backend, dividir por domínio garante ownership real e elimina conflitos de merge. Cada pessoa entende seu pedaço do banco até o endpoint.

**Por que PostgreSQL e não MySQL?**
PostgreSQL tem suporte nativo a tipos temporais e range types que facilitam as queries de disponibilidade por período — central no modelo de negócio de aluguel.

**Por que SQLAlchemy 2.0?**
ORM padrão da indústria Python, com suporte async nativo na versão 2.0, melhor integração com FastAPI e maior empregabilidade para o time.

**Por que monorepo?**
Time pequeno (5 pessoas), entrega integrada nos mesmos milestones. Um repositório, um clone, uma fonte da verdade.

**Por que disponibilidade por contagem e não por unidade física?**
A Caixa Mágica não rastreia qual unidade saiu para qual cliente. O modelo usa `total_units` INT em products e valida disponibilidade contando reservas ativas no período. Simples, direto e alinhado com a operação real.

---

## Cronograma

| Marco | Prazo | Entrega |
|---|---|---|
| **M1** | 25/05/2026 | Repositório estruturado, ER aprovado, migrations aplicadas, endpoints básicos no ar, front e back integrados localmente |
| **M2** | 25/06/2026 | Fluxo completo de pedido, integração front + back, área do cliente, painel admin básico |
| **M3** | 28/07/2026 | Deploy em produção, refinamento de UX, documentação técnica final, apresentação |

---

*Documento gerado no M1 — 25/05/2026 · Caixa Mágica MVP · IFS Campus Aracaju*