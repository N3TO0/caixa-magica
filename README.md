# Caixa Mágica

MVP do site de aluguel de brinquedos infantis **Caixa Mágica**.

**Stack:** FastAPI + React + PostgreSQL + SQLAlchemy 2.0 + Docker.

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Como rodar (desenvolvimento)

```bash
# Clone o repositório
git clone <url>
cd caixa-magica

# Copie o .env
cp backend/.env.example backend/.env

# Suba os containers
docker-compose up --build

# Em outro terminal, rode as migrations
docker-compose exec backend alembic upgrade head
```

### URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Documentação da API (Swagger):** http://localhost:8000/docs
- **Health check:** http://localhost:8000/health

---

## Estrutura do projeto

O backend é organizado em **domínios** (pastas dentro de `backend/app/`), cada um com seus próprios `models.py`, `schemas.py`, `router.py` e `service.py`:

- **`catalog/`** — produtos, categorias, preços e imagens. Tudo que diz respeito ao catálogo de brinquedos.
- **`orders/`** — pedidos, itens, reservas (períodos de aluguel) e histórico de status.
- **`users/`** — usuários (clientes/admin), endereços, autenticação JWT e pagamentos.
- **`core/`** — utilidades transversais: segurança (hash de senha, JWT), exceções customizadas e padrão de response.

O frontend (Vite + React) fica em `frontend/`, com `pages/`, `components/`, `hooks/` e `services/api.js` para chamadas HTTP.

---

## Divisão da equipe

| Frente | Responsável |
| --- | --- |
| Domínio 1 — Catálogo | [Nome 1] |
| Domínio 2 — Pedido e Reserva | Felipe |
| Domínio 3 — Cliente, Auth e Admin | [Nome 3] |
| Frontend A — Catálogo e produto | [Nome 4] |
| Frontend B — Checkout e área do cliente | [Nome 5] |

---

## Padrão de response da API

Toda resposta segue um envelope consistente:

```json
// Sucesso
{ "success": true, "data": {}, "message": "ok" }

// Erro
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Recurso não encontrado" } }
```

Helpers em `backend/app/core/responses.py` (`success_response`, `error_response`).

---

## Git flow

- Branch principal: **`main`**
- Novas features: **`feature/nome-da-feature`**
- Nomenclatura de commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- **PR obrigatório** para merge em `main` (sem push direto)

---

## Milestones

| Marco | Data | Entrega |
| --- | --- | --- |
| **M1** | 25/05 | Setup + ER + endpoints básicos |
| **M2** | 25/06 | Fluxo completo de pedido + integração front/back |
| **M3** | 28/07 | Deploy + refinamento + apresentação |
