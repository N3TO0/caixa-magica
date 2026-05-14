from sqlalchemy.ext.asyncio import AsyncSession


class CatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_products(self):
        # TODO: implementar listagem com filtros
        raise NotImplementedError

    async def get_product_by_id(self, product_id: int):
        # TODO: implementar busca por id
        raise NotImplementedError

    async def get_categories(self):
        # TODO: implementar listagem de categorias
        raise NotImplementedError
