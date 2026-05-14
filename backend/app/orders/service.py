from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_order(self, data):
        # TODO: implementar criação de pedido com itens e reservas
        raise NotImplementedError

    async def get_order_by_id(self, order_id: int):
        # TODO: implementar busca de pedido por id
        raise NotImplementedError

    async def update_status(self, order_id: int, new_status: str, changed_by: int | None = None):
        # TODO: implementar atualização de status com histórico
        raise NotImplementedError

    async def check_availability(self, product_id: int, start: date, end: date):
        # TODO: implementar verificação de disponibilidade no período
        raise NotImplementedError
