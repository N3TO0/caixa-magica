from sqlalchemy.ext.asyncio import AsyncSession


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, data):
        # TODO: implementar cadastro de usuário
        raise NotImplementedError

    async def authenticate(self, email: str, password: str):
        # TODO: implementar autenticação e emissão de token
        raise NotImplementedError

    async def get_by_id(self, user_id: int):
        # TODO: implementar busca por id
        raise NotImplementedError

    async def add_address(self, user_id: int, data):
        # TODO: implementar cadastro de endereço do usuário
        raise NotImplementedError

    async def get_user_orders(self, user_id: int):
        # TODO: implementar listagem de pedidos do usuário
        raise NotImplementedError
