from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.catalog.service import CatalogService


router = APIRouter(
    prefix="/produtos",
    tags=["Catálogo"]
)


@router.get("/")
async def list_products(
    db: AsyncSession = Depends(get_db)
):
    service = CatalogService(db)
    return await service.get_products()


@router.get("/categorias")
async def list_categories(
    db: AsyncSession = Depends(get_db)
):
    service = CatalogService(db)
    return await service.get_categories()


@router.get("/{product_id}")
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = CatalogService(db)
    return await service.get_product_by_id(product_id)