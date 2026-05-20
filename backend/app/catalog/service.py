from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from fastapi import HTTPException

from app.catalog.models import Product, Category


class CatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def get_products(self):
        result = await self.db.execute(
            select(Product)
            .options(
                joinedload(Product.pricing),
                joinedload(Product.images)
            )
            .where(
                Product.is_active == True,
                Product.deleted_at == None
            )
        )

        return result.scalars().unique().all()


    async def get_product_by_id(self, product_id: int):
        result = await self.db.execute(
            select(Product)
            .options(
                joinedload(Product.pricing),
                joinedload(Product.images),
                joinedload(Product.categories)
            )
            .where(
                Product.id == product_id,
                Product.deleted_at == None
            )
        )

        product = result.scalars().first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Produto não encontrado"
            )

        return product


    async def get_categories(self):
        result = await self.db.execute(
            select(Category).where(
                Category.is_active == True
            )
        )

        return result.scalars().all()