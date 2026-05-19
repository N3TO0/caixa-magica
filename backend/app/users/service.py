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

    async def authenticate(self, data):
        from sqlalchemy import select
        from app.core.security import verify_password, create_access_token
        from app.core.exceptions import UnauthorizedException
        from app.users.models import User

        # 1. Buscar o usuário pelo e-mail enviado
        query = select(User).where(User.email == data.email)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        # 2. Se o usuário não existir, barra na hora com erro 401
        if not user:
            raise UnauthorizedException("E-mail ou senha incorretos.")

        # 3. Se existir, usa a função do security.py para ver se a senha bate com o hash
        if not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("E-mail ou senha incorretos.")

        # 4. Se a senha estiver certa, prepara os dados que vão rodar dentro do Token (Payload)
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }

        # 5. Gera o token JWT de verdade usando a função do security.py
        access_token = create_access_token(data=token_data)

        # 6. Retorna o token no formato que o padrão OAuth2/FastAPI exige
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

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
    