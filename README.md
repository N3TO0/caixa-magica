# 🧸 Caixa Mágica — MVP

> Plataforma de aluguel e venda de itens infantis. Projeto prático do programa **Bolsa Futuro Digital – Capacita 04 · IFS Campus Aracaju · 2025**.

---

## 📋 Sobre o projeto

A **Caixa Mágica** e uma startup de economia compartilhada que oferece brinquedos e itens infantis em Aracaju/SE. O projeto entrega o MVP do site oficial, centralizando:

- Catálogo público com busca e filtros por idade, categoria e período
- Fluxo de aluguel com pedido online
- Fluxo separado de compra para produtos do tipo `sale`
- Área do cliente com histórico de pedidos
- Painel administrativo para gestão de produtos, pedidos e usuários

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.11 + FastAPI 0.111 |
| ORM | SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Banco de dados | PostgreSQL 15 |
| Frontend | React 18 + Vite |
| HTTP Client | Fetch API |
| Containers | Docker + Docker Compose |
| Autenticação | JWT (python-jose) |

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado
- [Git](https://git-scm.com/) instalado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USER/caixa-magica.git
cd caixa-magica

# 2. Crie o arquivo de variáveis de ambiente
cp backend/.env.example backend/.env

# 3. Suba os containers (primeira vez demora alguns minutos)
docker-compose up --build

# 4. Em outro terminal, rode as migrations do banco
docker-compose exec backend alembic upgrade head
```

### URLs Disponiveis

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Documentação (Swagger) | http://localhost:8000/docs |
| Documentação (ReDoc) | http://localhost:8000/redoc |
| Health check | http://localhost:8000/health |

---

## 🔧 Variaveis De Ambiente

O arquivo `backend/.env.example` contem as variaveis necessarias. Copie para `backend/.env` e ajuste se necessario.

| Variável | Descrição | Valor padrão (dev) |
|---|---|---|
| `DATABASE_URL` | URL de conexão com o PostgreSQL | `postgresql+asyncpg://postgres:postgres@db:5432/caixamagica` |
| `SECRET_KEY` | Chave secreta para geração de JWT | Troque em produção |
| `ALGORITHM` | Algoritmo do JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tempo de expiração do token | `60` |

> ⚠️ **Nunca** suba o arquivo `.env` para o repositorio. Ele ja esta no `.gitignore`.

---

## 🏗️ Arquitetura

O projeto usa **arquitetura domain-based**: cada dominio e uma pasta independente com seus proprios models, schemas, router e service.

```
caixa-magica/
├── docker-compose.yml
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/          # uma migration por alteração de schema
│   └── app/
│       ├── main.py            # app FastAPI, registra routers, CORS, startup
│       ├── config.py          # variáveis de ambiente (pydantic-settings)
│       ├── database.py        # engine async, SessionLocal, Base declarativa
│       │
│       ├── core/              # utilitarios compartilhados por todos os dominios
│       │   ├── security.py    # hash de senha, geração e validação de JWT
│       │   ├── exceptions.py  # exceções HTTP customizadas
│       │   └── responses.py   # formato padrão de response (success/error)
│       │
│       ├── catalog/           # Dominio 1 — produtos, categorias e imagens
│       │   ├── models.py      # tabelas: products, categories, product_pricing, product_images
│       │   ├── schemas.py     # Pydantic: ProductOut, CategoryOut, etc.
│       │   ├── router.py      # rotas públicas e administrativas de catálogo
│       │   └── service.py     # lógica: listagem, filtros, CRUD admin
│       │
│       ├── orders/            # Dominio 2 — pedidos, reservas e historico
│       │   ├── models.py      # tabelas: orders, order_items, reservations, order_status_history
│       │   ├── schemas.py     # Pydantic: OrderCreate, SaleOrderCreate, OrderOut, etc.
│       │   ├── router.py      # rotas de aluguel, compra e gestão de pedidos
│       │   └── service.py     # lógica: reserva temporal, compra sale, status
│       │
│       └── users/             # Dominio 3 — usuarios, enderecos, auth e admin
│           ├── models.py      # tabelas: users, addresses, payments
│           ├── schemas.py     # Pydantic: UserCreate, LoginRequest, TokenOut, etc.
│           ├── router.py      # rotas de auth, perfil e admin de usuários
│           └── service.py     # lógica: autenticação, perfil e CRUD admin
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── app/               # App, router, providers e guards
        ├── features/          # módulos por domínio de frontend
        └── shared/            # componentes, estilos, api e utils reutilizáveis
```

### Responsabilidade de cada arquivo dentro de um dominio

| Arquivo | Responsabilidade |
|---|---|
| `models.py` | Define as tabelas com SQLAlchemy. Apenas estrutura, sem lógica. |
| `schemas.py` | Define formatos de entrada e saida com Pydantic. Separa o que o banco armazena do que a API expoe. |
| `router.py` | Define as rotas. Recebe request, chama o service, retorna response. Sem lógica de negócio. |
| `service.py` | Onde a lógica vive. Valida regras, acessa o banco, toma decisões. |

---

## 🗃️ Modelo de dados

O banco foi projetado com foco principal em aluguel temporal de bens fisicos, com extensao posterior para itens de venda. A principal decisao foi:

> **Disponibilidade por contagem:** cada produto tem `total_units` (número de unidades físicas). Disponibilidade em um período = `total_units - COUNT(reservas ativas naquele intervalo)`.

### Entidades principais (MVP)

| Tabela | Descrição |
|---|---|
| `users` | Clientes e administradores |
| `addresses` | Endereços dos usuários (múltiplos por usuário) |
| `categories` | Categorias com suporte a hierarquia (parent_id) |
| `product_categories` | Relação N:N entre produtos e categorias |
| `products` | Catalogo de produtos (aluguel, venda, kit, vale-presente) |
| `product_pricing` | Preços por período (7, 15 ou 30 dias) |
| `product_images` | Fotos dos produtos |
| `orders` | Pedidos de aluguel e compra |
| `order_items` | Itens de cada pedido, com suporte a aluguel e compra |
| `reservations` | Controle de disponibilidade temporal |
| `order_status_history` | Histórico imutável de mudanças de status |
| `payments` | Registros de pagamento |

### Máquina de estados do pedido

```
pendente → confirmado → em_uso → devolvido → finalizado
                ↓               ↓
            cancelado        atrasado → devolvido → finalizado
```

| Status | Significado |
|---|---|
| `pendente` | Pedido criado. Aguarda contato da Caixa Mágica (3 dias úteis). |
| `confirmado` | Confirmado pela loja e pelo cliente. Entrega a ser agendada. |
| `em_uso` | Produto entregue ou retirado. Aluguel em andamento. |
| `devolvido` | Produto retornou. Aguarda conferência. |
| `finalizado` | Conferência concluída. Pedido encerrado. |
| `cancelado` | Cancelado por qualquer motivo. |
| `atrasado` | Data de devolução passou sem retorno. |

---

## 🌐 Endpoints da API

### Catálogo
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/v1/produtos` | Lista produtos com filtros |
| GET | `/api/v1/produtos/{id}` | Detalhe de um produto |
| GET | `/api/v1/produtos/categorias` | Lista categorias |
| GET | `/api/v1/produtos/admin` | Lista produtos no admin |
| GET | `/api/v1/produtos/admin/resumo` | Resumo de produtos no admin |
| POST | `/api/v1/produtos/categorias/admin` | Cria categoria (admin) |
| POST | `/api/v1/produtos/admin` | Cria produto (admin) |
| PUT | `/api/v1/produtos/admin/{id}` | Atualiza produto (admin) |
| PATCH | `/api/v1/produtos/admin/{id}/status` | Ativa/desativa produto (admin) |
| DELETE | `/api/v1/produtos/admin/{id}` | Exclui logicamente produto (admin) |

### Usuários e Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/auth/register` | Cadastro de usuário |
| POST | `/api/v1/auth/login` | Login — retorna JWT |
| GET | `/api/v1/usuarios/me` | Perfil do usuário logado |
| GET | `/api/v1/usuarios/me/pedidos` | Pedidos do usuário logado |
| POST | `/api/v1/usuarios/me/enderecos` | Adicionar endereço |
| GET | `/api/v1/usuarios/admin/usuarios` | Lista usuários no admin |
| GET | `/api/v1/usuarios/admin/usuarios/resumo` | Resumo de usuários no admin |
| GET | `/api/v1/usuarios/admin/usuarios/{id}` | Detalhe de usuário no admin |
| POST | `/api/v1/usuarios/admin/usuarios` | Cria usuário no admin |
| PUT | `/api/v1/usuarios/admin/usuarios/{id}` | Atualiza usuário no admin |
| DELETE | `/api/v1/usuarios/admin/usuarios/{id}` | Exclui usuário no admin |

### Pedidos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/pedidos` | Criar pedido de aluguel |
| POST | `/api/v1/pedidos/compra` | Criar pedido de compra (`sale`) |
| GET | `/api/v1/pedidos/{id}` | Detalhe do pedido |
| PATCH | `/api/v1/pedidos/{id}/status` | Atualizar status (admin) |
| GET | `/api/v1/pedidos/disponibilidade/{product_id}` | Verificar disponibilidade |
| GET | `/api/v1/pedidos/admin/resumo` | Resumo de pedidos no admin |

### Formato padrão de response

```json
// Sucesso
{
  "success": true,
  "data": {},
  "message": "ok"
}

// Erro
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Produto não encontrado"
  }
}
```

---

## 👥 Time

| Domínio | Responsável |
|---|---|
| Backend — Catálogo | Fernanda |
| Backend — Pedido e Reserva | Felipe |
| Backend — Cliente, Auth e Admin | Neto |
| Frontend — Catálogo e produto | Adriele |
| Frontend — Checkout e área do cliente | Ravel |

---

## 📅 Cronograma

| Marco | Prazo | Entrega |
|---|---|---|
| **M1** | 25/05 | Repositório estruturado, ER aprovado, migrations aplicadas, endpoints básicos no ar |
| **M2** | 25/06 | Fluxo completo de pedido, integração front + back, área do cliente, painel admin |
| **M3** | 28/07 | Deploy em produção, refinamento de UX, documentação técnica final, apresentação |

---

## 🔀 Git flow

### Branches

- `main` — código estável, sempre funcional
- `feature/nome-da-feature` — novas funcionalidades
- `fix/nome-do-bug` — correções

### Convenção de commits

```
feat: adiciona endpoint de listagem de produtos
fix: corrige validação de data no order_item
docs: atualiza README com instruções de deploy
chore: atualiza dependências do requirements.txt
refactor: extrai lógica de reserva para service
```

### Fluxo de trabalho

```bash
# Crie uma branch a partir da main
git checkout main
git pull
git checkout -b feature/minha-feature

# Faça commits pequenos e descritivos
git add .
git commit -m "feat: descrição do que foi feito"

# Abra um PR para a main
git push origin feature/minha-feature
```

> ⚠️ **Code review obrigatório** antes de qualquer merge na `main`. Ninguém faz merge no próprio PR.

---

## 🧪 Comandos úteis

```bash
# Subir os containers
docker-compose up

# Subir em background
docker-compose up -d

# Rebuildar após mudança no Dockerfile ou requirements.txt
docker-compose up --build

# Parar os containers
docker-compose down

# Ver logs do backend
docker-compose logs backend -f

# Rodar migrations
docker-compose exec backend alembic upgrade head

# Criar nova migration após alterar um model
docker-compose exec backend alembic revision --autogenerate -m "descricao da mudanca"

# Acessar o banco via psql
docker-compose exec db psql -U postgres -d caixamagica

# Instalar nova dependência Python (adicione ao requirements.txt também)
docker-compose exec backend pip install nome-do-pacote
```

---

## 📐 Decisões arquiteturais

**Por que domain-based e não layer-based?**
Com 3 desenvolvedores backend, dividir por domínio (catalog/, orders/, users/) garante ownership real e elimina conflitos de merge. Cada pessoa entende seu pedaço do banco até o endpoint.

**Por que PostgreSQL e não MySQL?**
PostgreSQL tem suporte nativo a tipos temporais (range types) que facilitam as queries de disponibilidade por período — central no modelo de negócio de aluguel.

**Por que SQLAlchemy 2.0?**
ORM padrão da indústria Python, com suporte async nativo na versão 2.0, melhor integração com FastAPI e maior empregabilidade para o time.

**Por que monorepo?**
Time pequeno (5 pessoas), entrega integrada nos mesmos milestones. Um repo, um clone, uma fonte da verdade.

**Disponibilidade por contagem e não por unidade física:**
A Caixa Mágica não rastreia qual unidade saiu para qual cliente. O modelo usa `total_units` INT em products e valida disponibilidade contando reservas ativas no período. Simples, alinhado com a operação real.

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos — IFS Campus Aracaju · Bolsa Futuro Digital – Capacita 04 · 2025.
