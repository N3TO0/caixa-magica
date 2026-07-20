from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from fastapi import HTTPException
from datetime import date, datetime, timezone
from app.catalog.models import (
    Product,
    Category,
    ProductCategory,
    ProductPricing,
    ProductImage
)

from sqlalchemy import (
    select,
    func
)
from app.catalog.schemas import (
    CategoryCreate,
    ProductImageCreate,
    ProductCreate,
    ProductUpdate
)
from app.orders.models import Reservation

# -------------------------------------------------------------------------
# Camada de serviço responsável pelas regras de negócio do catálogo
# -------------------------------------------------------------------------
class CatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _validate_product_pricing(self, product_type: str, pricing, sale_price):
        if product_type == "sale":
            if sale_price is None or sale_price <= 0:
                raise HTTPException(
                    status_code=422,
                    detail="Produtos do tipo venda exigem um valor unico de venda"
                )
            return

        if not pricing:
            raise HTTPException(
                status_code=422,
                detail="Produtos de locacao exigem precos por periodo"
            )

    async def _get_available_units_map(
        self,
        product_ids: list[int],
        start_date: date,
        end_date: date
    ):
        if not product_ids:
            return {}

        result = await self.db.execute(
            select(
                Reservation.product_id,
                func.count(Reservation.id).label("reservas_ativas")
            )
            .where(
                Reservation.product_id.in_(product_ids),
                Reservation.period_start <= end_date,
                Reservation.period_end >= start_date,
                Reservation.status == "active"
            )
            .group_by(Reservation.product_id)
        )

        reserved_units_map = {
            product_id: reserved_units
            for product_id, reserved_units in result.all()
        }

        return {
            product_id: reserved_units_map.get(product_id, 0)
            for product_id in product_ids
        }

    async def _attach_available_units(
        self,
        products: list[Product],
        start_date: date | None = None,
        end_date: date | None = None
    ):
        if not products:
            return products

        reference_start = start_date or date.today()
        reference_end = end_date or reference_start
        product_ids = [product.id for product in products]
        reserved_units_map = await self._get_available_units_map(
            product_ids,
            reference_start,
            reference_end
        )

        for product in products:
            reserved_units = reserved_units_map.get(product.id, 0)
            product.available_units = max(product.total_units - reserved_units, 0)

        return products

    async def _save_product_images(
        self,
        product_id: int,
        images: list[ProductImageCreate]
    ):
        for image in images:
            self.db.add(
                ProductImage(
                    product_id=product_id,
                    url=image.url,
                    display_order=image.display_order
                )
            )

    # ---------------------------------------------------------------------
    # Cria uma nova categoria de produto
    # ---------------------------------------------------------------------
    async def create_category(self, data: CategoryCreate):
        name_exists = await self.db.execute(
            select(Category).where(Category.name == data.name)
        )

        if name_exists.scalar_one_or_none():
            raise HTTPException(
                status_code=409,
                detail="Já existe uma categoria com este nome"
            )

        slug_exists = await self.db.execute(
            select(Category).where(Category.slug == data.slug)
        )

        if slug_exists.scalar_one_or_none():
            raise HTTPException(
                status_code=409,
                detail="Já existe uma categoria com este slug"
            )

        if data.parent_id is not None:
            parent_category = await self.db.get(Category, data.parent_id)

            if not parent_category:
                raise HTTPException(
                    status_code=404,
                    detail="Categoria pai não encontrada"
                )

        category = Category(
            name=data.name,
            slug=data.slug,
            description=data.description,
            parent_id=data.parent_id,
            is_active=data.is_active
        )

        self.db.add(category)

        await self.db.commit()
        await self.db.refresh(category)

        return category

     # ---------------------------------------------------------------------
    # Cria um novo produto com categorias e faixas de preço
    # ---------------------------------------------------------------------
    async def create_product(self, data: ProductCreate):

        # Verifica se já existe um produto com o mesmo slug
        slug_exists = await self.db.execute(
            select(Product).where(Product.slug == data.slug)
        )

        if slug_exists.scalar_one_or_none():
            raise HTTPException(
                status_code=409,
                detail="Já existe um produto com este slug"
            )

        self._validate_product_pricing(
            data.type,
            data.pricing,
            data.sale_price
        )

        # Cria o registro principal do produto
        product = Product(
            name=data.name,
            slug=data.slug,
            description=data.description,
            type=data.type,
            age_range=data.age_range,
            total_units=data.total_units,
            sale_price=data.sale_price if data.type == "sale" else None,
            rental_rules=data.rental_rules,
            is_featured=data.is_featured
        )

        self.db.add(product)

        # gera o ID antes de criar relacionamentos
        await self.db.flush()

        # Vincula categorias ao produto
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

        # Cadastra as faixas de preço
        if data.type != "sale":
            for preco in data.pricing:

                self.db.add(
                    ProductPricing(
                        product_id=product.id,
                        days=preco.days,
                        price=preco.price
                    )
                )

        await self._save_product_images(
            product.id,
            data.images
        )

        await self.db.commit()
        await self.db.refresh(product)

        return await self.get_product_by_id(product.id)
    
    # ---------------------------------------------------------------------
    # Atualiza informações de um produto existente
    # Permite atualização parcial dos dados
    # ---------------------------------------------------------------------
    async def update_product(
        self,
        product_id: int,
        data: ProductUpdate
    ):
        product = await self.db.get(
            Product,
            product_id
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Produto não encontrado"
            )

        # VALIDAÇÃO DE SLUG DUPLICADO
        if data.slug:

            slug_exists = await self.db.execute(
                select(Product).where(
                    Product.slug == data.slug,
                    Product.id != product_id
                )
            )

            if slug_exists.scalar_one_or_none():
                raise HTTPException(
                    status_code=409,
                    detail="Já existe um produto com este slug"
                )

        update_data = data.model_dump(
            exclude_unset=True
        )

        next_type = update_data.get("type", product.type)
        next_sale_price = update_data.get("sale_price", product.sale_price)
        next_pricing = data.pricing if data.pricing is not None else product.pricing
        self._validate_product_pricing(next_type, next_pricing, next_sale_price)

        # Atualiza campos simples
        for field, value in update_data.items():

            if field not in ["categories", "pricing", "images"]:
                setattr(
                    product,
                    field,
                    None if field == "sale_price" and next_type != "sale" else value
                )

        if next_type != "sale":
            product.sale_price = None

        # Atualiza categorias
        if data.categories is not None:

            await self.db.execute(
                ProductCategory.__table__.delete().where(
                    ProductCategory.product_id == product_id
                )
            )

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
                        product_id=product_id,
                        category_id=categoria_id
                    )
                )

        # Atualiza preços
        if data.pricing is not None or next_type == "sale":

            await self.db.execute(
                ProductPricing.__table__.delete().where(
                    ProductPricing.product_id == product_id
                )
            )

            if next_type != "sale":
                for preco in data.pricing or []:

                    self.db.add(
                        ProductPricing(
                            product_id=product_id,
                            days=preco.days,
                            price=preco.price
                        )
                    )

        if data.images is not None:

            await self.db.execute(
                ProductImage.__table__.delete().where(
                    ProductImage.product_id == product_id
                )
            )

            await self._save_product_images(
                product_id,
                data.images
            )

        await self.db.commit()

        return await self.get_product_by_id(
            product_id
        )
    
     # ---------------------------------------------------------------------
    # Ativa ou desativa um produto no catálogo
    # ---------------------------------------------------------------------
    async def update_product_status(
        self,
        product_id: int,
        ativo: bool
    ):
        product = await self.db.get(
            Product,
            product_id
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Produto não encontrado"
            )

        product.is_active = ativo

        await self.db.commit()

        return await self.get_product_by_id(
            product_id
        )

    # ---------------------------------------------------------------------
    # Exclui logicamente um produto do catálogo
    # ---------------------------------------------------------------------
    async def delete_product(self, product_id: int):
        product = await self.db.get(
            Product,
            product_id
        )

        if not product or product.deleted_at is not None:
            raise HTTPException(
                status_code=404,
                detail="Produto não encontrado"
            )

        product.is_active = False
        product.deleted_at = datetime.now(timezone.utc)

        await self.db.commit()


    # ---------------------------------------------------------------------
    # Lista produtos ativos com filtros opcionais
    # ---------------------------------------------------------------------
    async def get_products(
        self,
        categoria_id=None,
        faixa_etaria=None,
        start_date=None,
        end_date=None
    ):
        
        # Consulta base retornando apenas produtos ativos
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

        # filtro disponibilidade
        if start_date and end_date:

            # Conta quantas reservas ativas existem para cada produto    
            reservas_subquery = (
                select(
                    Reservation.product_id,
                    func.count(Reservation.id).label(
                        "reservas_ativas"
                    )
                )
                .where(
                    Reservation.period_start <= end_date,
                    Reservation.period_end >= start_date,
                    Reservation.status == "active"
                )
                .group_by(
                    Reservation.product_id
                )
                .subquery()
            )

            # Retorna apenas produtos com unidades disponíveis
            query = (
                query.outerjoin(
                    reservas_subquery,
                    Product.id == reservas_subquery.c.product_id
                )
                .where(
                    Product.total_units >
                    func.coalesce(
                        reservas_subquery.c.reservas_ativas,
                        0
                    )
                )
            )

        result = await self.db.execute(query)
        products = result.scalars().unique().all()

        return await self._attach_available_units(
            products,
            start_date=start_date,
            end_date=end_date
        )

    # ---------------------------------------------------------------------
    # Lista produtos do admin incluindo ativos e inativos
    # ---------------------------------------------------------------------
    async def get_admin_products(self):
        result = await self.db.execute(
            select(Product)
            .options(
                joinedload(Product.pricing),
                joinedload(Product.images),
                joinedload(Product.categories)
            )
            .where(Product.deleted_at == None)
        )

        products = result.scalars().unique().all()
        return await self._attach_available_units(products)

    async def get_admin_products_summary(self):
        result = await self.db.execute(
            select(Product).where(Product.deleted_at == None)
        )
        products = result.scalars().all()

        return {
            "total": len(products),
            "active": len([product for product in products if product.is_active]),
            "inactive": len([product for product in products if not product.is_active]),
            "sale": len([product for product in products if product.type == "sale"]),
            "rental": len([product for product in products if product.type == "rental"]),
        }

    # ---------------------------------------------------------------------
    # Busca produto por ID com preços, imagens e categorias
    # ---------------------------------------------------------------------
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

        await self._attach_available_units([product])

        return product


     # ---------------------------------------------------------------------
    # Lista categorias ativas do catálogo
    # ---------------------------------------------------------------------
    async def get_categories(self):
        result = await self.db.execute(
            select(Category).where(
                Category.is_active == True
            )
        )

        return result.scalars().all()
