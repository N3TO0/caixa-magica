from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.catalog.service import CatalogService
from datetime import date
from typing import Optional
from app.catalog.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductStatusUpdate,
    ProductDetailOut
)

from app.core.security import get_current_user


# -------------------------------------------------------------------------
# Rotas do módulo de catálogo
# -------------------
router = APIRouter(
    prefix="/produtos",
    tags=["Catálogo"]
)


# -------------------------------------------------------------------------
# Lista produtos ativos com filtros opcionais:
# - categoria
# - faixa etária
# - disponibilidade por período
# -------------------------------------------------------------------------
@router.get("/")
async def list_products(
    categoria_id: Optional[int] = None,
    faixa_etaria: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    service = CatalogService(db)

    return await service.get_products(
        categoria_id=categoria_id,
        faixa_etaria=faixa_etaria,
        start_date=start_date,
        end_date=end_date
    )

# -------------------------------------------------------------------------
# Lista todas as categorias ativas do catálogo
# -------------------------------------------------------------------------
@router.get("/categorias")
async def list_categories(
    db: AsyncSession = Depends(get_db)
):
    service = CatalogService(db)
    return await service.get_categories()

# -------------------------------------------------------------------------
# Cadastro de produto
# Acesso restrito para usuários administradores
# -------------------------------------------------------------------------
@router.post(
    "/admin",
    response_model=ProductDetailOut,
    status_code=201
)
async def create_product(
    data: ProductCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Apenas administradores podem realizar esta ação"
        )

    service = CatalogService(db)

    return await service.create_product(data)

# -------------------------------------------------------------------------
# Atualização de produto
# Permite atualização parcial dos dados do produto
# Acesso restrito para administradores
# -------------------------------------------------------------------------
@router.put(
    "/admin/{product_id}",
    response_model=ProductDetailOut
)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Apenas administradores podem realizar esta ação"
        )

    service = CatalogService(db)

    return await service.update_product(
        product_id,
        data
    )

# -------------------------------------------------------------------------
# Ativa ou desativa um produto no catálogo
# Produtos inativos não aparecem na listagem pública
# Acesso restrito para administradores
# -------------------------------------------------------------------------
@router.patch(
    "/admin/{product_id}/status",
    response_model=ProductDetailOut
)
async def update_product_status(
    product_id: int,
    data: ProductStatusUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Apenas administradores podem realizar esta ação"
        )

    service = CatalogService(db)

    return await service.update_product_status(
        product_id,
        data.ativo
    )

# -------------------------------------------------------------------------
# Retorna os detalhes completos de um produto pelo ID
# -------------------------------------------------------------------------
@router.get("/{product_id}")
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = CatalogService(db)
    return await service.get_product_by_id(product_id)