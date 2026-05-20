import logging

import builtins
from typing import Optional
builtins.Optional = Optional  # Isso injeta o Optional no Python inteiro!

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.catalog.router import router as catalog_router
from app.orders.router import router as orders_router
from app.users.router import auth_router, users_router

# Importar todos os models para registrar no SQLAlchemy
import app.users.models  # noqa: F401
import app.catalog.models  # noqa: F401
import app.orders.models  # noqa: F401


logger = logging.getLogger("caixa_magica")
logging.basicConfig(level=logging.INFO)


app = FastAPI(title="Caixa Mágica API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "Caixa Mágica API"}


@app.on_event("startup")
async def on_startup():
    logger.info("API iniciada")
