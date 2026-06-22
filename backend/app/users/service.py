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

    async def get_user_orders(self, user_id: int, page: int = 1, limit: int = 10):
        from math import ceil
        from sqlalchemy import select, func
        from sqlalchemy.orm import selectinload
        from app.orders.models import Order

        if page < 1:
            page = 1
        if limit < 1:
            limit = 10
            
        offset = (page - 1) * limit

        # 1. Conta o total de pedidos do usuário (excluindo soft delete) [cite: 122, 126]
        count_query = select(func.count(Order.id)).where(
            Order.user_id == user_id,
            Order.deleted_at.is_(None)
        )
        total_result = await self.db.execute(count_query)
        total_orders = total_result.scalar() or 0

        # 2. Busca os pedidos trazendo os itens pré-carregados (evita lazy loading) [cite: 122, 123, 124, 125]
        orders_query = (
            select(Order)
            .where(Order.user_id == user_id, Order.deleted_at.is_(None))
            .options(selectinload(Order.items))
            .order_by(Order.created_at.desc())  # Mais recente primeiro [cite: 123]
            .offset(offset)
            .limit(limit)
        )
        orders_result = await self.db.execute(orders_query)
        orders_list = orders_result.scalars().all()

        # 3. Formata os dados injetando a contagem de itens [cite: 125]
        from app.users.schemas import OrderHistoryResponse
        formatted_orders = [
            OrderHistoryResponse(
                id=order.id,
                status=order.status,
                total_amount=order.total_amount,
                created_at=order.created_at,
                items_count=len(order.items)
            )
            for order in orders_list
        ]

        total_pages = ceil(total_orders / limit) if total_orders > 0 else 1 

        return {
            "data": formatted_orders,
            "total_orders": total_orders,
            "total_pages": total_pages,
            "page": page,
            "limit": limit
        }

    async def add_address(self, user_id: int, data):
        from sqlalchemy import update, select
        from app.users.models import Address

        # Se o novo endereço for o padrão, desmarca todos os outros do usuário primeiro
        if data.is_default:
            stmt = (
                update(Address)
                .where(Address.user_id == user_id, Address.is_default == True)
                .values(is_default=False)
            )
            await self.db.execute(stmt)

        # Cria o novo objeto de endereço mapeando os campos do Pydantic
        new_address = Address(
            user_id=user_id,
            label=data.label,
            zip_code=data.zip_code,
            street=data.street,
            number=data.number,
            complement=data.complement,
            neighborhood=data.neighborhood,
            city=data.city,
            state=data.state,
            is_default=data.is_default
        )

        # Salva no PostgreSQL
        self.db.add(new_address)
        await self.db.commit()
        await self.db.refresh(new_address)

        return new_address