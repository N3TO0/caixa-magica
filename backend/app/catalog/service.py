from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from fastapi import HTTPException
from app.catalog.models import (
    Product,
    Category,
    ProductCategory,
    ProductPricing
)

from sqlalchemy import select
from app.catalog.schemas import ProductCreate


class CatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_product(self, data: ProductCreate):

        slug_exists = await self.db.execute(
            select(Product).where(Product.slug == data.slug)
        )

        if slug_exists.scalar_one_or_none():
            raise HTTPException(
                status_code=409,
                detail="Já existe um produto com este slug"
            )

        product = Product(
            name=data.name,
            slug=data.slug,
            description=data.description,
            type=data.type,
            age_range=data.age_range,
            total_units=data.total_units,
            rental_rules=data.rental_rules,
            is_featured=data.is_featured
        )

        self.db.add(product)

        # gera o ID antes de criar relacionamentos
        await self.db.flush()

        for categoria_id in data.categories:

            categoria = await self.db.get(
                Category,
                categoria_id
            )

            if not categoria:
                raise HTTPException(
                    status_code=404,
                    detail=f"Categoria {categoria_id} não encontrada"
                )

            self.db.add(
                ProductCategory(
                    product_id=product.id,
                    category_id=categoria_id
                )
            )

        for preco in data.pricing:

            self.db.add(
                ProductPricing(
                    product_id=product.id,
                    days=preco.days,
                    price=preco.price
                )
            )

        await self.db.commit()
        await self.db.refresh(product)

        return await self.get_product_by_id(product.id)


    async def get_products(self,
    categoria_id=None,
    faixa_etaria=None,
    start_date=None,
    end_date=None
    ):
        query = (
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

        # filtro categoria
        if categoria_id:
            query = (
                query.join(ProductCategory)
                .where(
                    ProductCategory.category_id == categoria_id
                )
            )

        # filtro faixa etária
        if faixa_etaria:
            query = query.where(
                Product.age_range == faixa_etaria
            )

        result = await self.db.execute(query)

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