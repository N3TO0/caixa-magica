from sqlalchemy.ext.asyncio import AsyncSession



class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, data):
        from sqlalchemy import select
        from app.core.security import hash_password
        from app.core.exceptions import ConflictException
        from app.users.models import User

        # 1. Verificar se já existe um usuário com esse email
        query = select(User).where(User.email == data.email)
        result = await self.db.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            # Retorna o erro 409 (Conflito) exigido na regra da atividade
            raise ConflictException("Já existe um usuário cadastrado com este e-mail.")

        # 2. Transformar a senha pura em hash usando a função do security.py
        hashed_password = hash_password(data.password)

        # 3. Criar o objeto do modelo User com os dados recebidos do schema
        new_user = User(
            name=data.name,
            email=data.email,
            password_hash=hashed_password,
            phone=data.phone,
            cpf=data.cpf,
            role="customer",  # Padrão para novos cadastros
            is_active=True
        )

        # 4. Salvar o novo usuário no banco de dados (PostgreSQL)
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        # 5. Retornar o usuário criado com seus dados reais do banco
        return new_user

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


def  get_current_user(usuario_logado):
    
    ...
    