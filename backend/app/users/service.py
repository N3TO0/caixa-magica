from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from math import ceil
from sqlalchemy import select, func, update
from sqlalchemy.orm import joinedload
from app.config import settings
from app.orders.models import Order
from app.users.models import User, Address
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.core.exceptions import BadRequestException, ConflictException, NotFoundException, UnauthorizedException
from sqlalchemy.orm import selectinload


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _ensure_unique_user_fields(self, user_id: int | None, email: str | None, cpf: str | None):
        if email:
            email_result = await self.db.execute(
                select(User).where(User.email == email, User.id != user_id)
            )
            if email_result.scalar_one_or_none():
                raise ConflictException("Já existe um usuário cadastrado com este e-mail.")

        if cpf:
            cpf_result = await self.db.execute(
                select(User).where(User.cpf == cpf, User.id != user_id)
            )
            if cpf_result.scalar_one_or_none():
                raise ConflictException("Já existe um usuário cadastrado com este CPF.")

    async def _get_user_with_addresses(self, user_id: int):
        result = await self.db.execute(
            select(User)
            .execution_options(populate_existing=True)
            .options(selectinload(User.addresses))
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    def create_user_token(self, user: User) -> str:
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }
        return create_access_token(data=token_data)

    async def register(self, data):

        # 1. Verificar se já existe um usuário com esse email
        query = select(User).where(User.email == data.email)
        result = await self.db.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            # Retorna o erro 409 (Conflito) exigido na regra da atividade
            raise ConflictException("Já existe um usuário cadastrado com este e-mail.")

        if data.cpf:
            await self._ensure_unique_user_fields(None, None, data.cpf)

        # 2. Transformar a senha pura em hash usando a função do security.py
        hashed_password = hash_password(data.password)

        # 3. Criar o objeto do modelo User com os dados recebidos do schema
        new_user = User(
            name=data.name,
            email=data.email,
            password_hash=hashed_password,
            phone=data.phone,
            cpf=data.cpf,
            birthdate=data.birthdate,
            role="customer",  # Padrão para novos cadastros
            is_active=True
        )

        # 4. Salvar o novo usuário no banco de dados (PostgreSQL)
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        # 5. Retornar o usuário criado com seus dados reais do banco
        return await self._get_user_with_addresses(new_user.id)

    async def authenticate(self, data):
        

        # 1. Buscar o usuário pelo e-mail enviado
        query = select(User).options(selectinload(User.addresses)).where(User.email == data.email)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        # 2. Se o usuário não existir, barra na hora com erro 401
        if not user:
            raise UnauthorizedException("E-mail ou senha incorretos.")

        # 3. Se existir, usa a função do security.py para ver se a senha bate com o hash
        if not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("E-mail ou senha incorretos.")

        # 4. Retorna o token e o usuário para as rotas montarem a resposta.
        return self.create_user_token(user), user

    async def update_profile(self, user_id: int, data):
        user = await self._get_user_with_addresses(user_id)

        if user is None:
            raise NotFoundException("Usuário não encontrado.")

        update_data = data.model_dump(exclude_unset=True)

        email = update_data.get("email")
        if email is not None and email != user.email:
            await self._ensure_unique_user_fields(user_id, email, None)

        cpf = update_data.get("cpf")
        if cpf is not None and cpf != user.cpf:
            await self._ensure_unique_user_fields(user_id, None, cpf)

        address_fields = {
            "zip_code",
            "street",
            "number",
            "complement",
            "neighborhood",
            "city",
            "state",
        }
        address_data = {
            field: update_data.pop(field)
            for field in list(update_data.keys())
            if field in address_fields
        }

        password = update_data.pop("password", None)
        if password:
            user.password_hash = hash_password(password)

        if address_data and any(value is not None for value in address_data.values()):
            address = user.default_address

            if address is None:
                address = Address(user_id=user_id, is_default=True)
                self.db.add(address)

            for field, value in address_data.items():
                if value is None:
                    continue
                setattr(address, field, value)

        for field, value in update_data.items():
            if field in {"name", "email"} and value is None:
                continue
            setattr(user, field, value)

        self.db.add(user)
        await self.db.commit()
        return await self._get_user_with_addresses(user_id)


    async def get_by_id(self, user_id: int):
        user = await self._get_user_with_addresses(user_id)

        if user is None or user.deleted_at is not None:
            raise NotFoundException("Usuário não encontrado.")

        return user

    async def create_admin_user(self, data):
        await self._ensure_unique_user_fields(None, data.email, data.cpf)

        new_user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            phone=data.phone,
            cpf=data.cpf,
            birthdate=data.birthdate,
            role=data.role,
            is_active=data.is_active,
        )

        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        return await self._get_user_with_addresses(new_user.id)

    async def update_admin_user(self, user_id: int, data):
        user = await self._get_user_with_addresses(user_id)

        if user is None or user.deleted_at is not None:
            raise NotFoundException("Usuário não encontrado.")

        update_data = data.model_dump(exclude_unset=True)

        email = update_data.get("email")
        if email is not None and email != user.email:
            await self._ensure_unique_user_fields(user_id, email, None)

        cpf = update_data.get("cpf")
        if cpf is not None and cpf != user.cpf:
            await self._ensure_unique_user_fields(user_id, None, cpf)

        address_fields = {
            "zip_code",
            "street",
            "number",
            "complement",
            "neighborhood",
            "city",
            "state",
        }
        address_data = {
            field: update_data.pop(field)
            for field in list(update_data.keys())
            if field in address_fields
        }

        password = update_data.pop("password", None)
        if password:
            user.password_hash = hash_password(password)

        if address_data and any(value is not None for value in address_data.values()):
            address = user.default_address

            if address is None:
                address = Address(user_id=user_id, is_default=True)
                self.db.add(address)

            for field, value in address_data.items():
                if value is None:
                    continue
                setattr(address, field, value)

        for field, value in update_data.items():
            setattr(user, field, value)

        self.db.add(user)
        await self.db.commit()
        return await self._get_user_with_addresses(user_id)

    async def delete_admin_user(self, user_id: int):
        user = await self._get_user_with_addresses(user_id)

        if user is None or user.deleted_at is not None:
            raise NotFoundException("Usuário não encontrado.")

        user.deleted_at = datetime.now(timezone.utc)
        user.is_active = False

        self.db.add(user)
        await self.db.commit()

    async def get_user_orders(self, user_id: int, page: int = 1, limit: int = 10):
        

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
    
    async def get_user_addresses(self, user_id: int):
        

        # Busca todos os endereços do usuário
        # Ordena por is_default DESC para que o True (padrão) fique no topo da lista
        query = (
            select(Address)
            .where(Address.user_id == user_id)
            .order_by(Address.is_default.desc(), Address.id.asc())
        )
        
        result = await self.db.execute(query)
        addresses_list = result.scalars().all()

        return addresses_list
    
    async def get_all_orders_admin(self, page: int = 1, limit: int = 10, status_filter: str = None):

        if page < 1: page = 1
        if limit < 1: limit = 10
        offset = (page - 1) * limit

        # 1. Base da query para contagem e listagem (filtrando soft delete)
        count_stmt = select(func.count(Order.id)).where(Order.deleted_at.is_(None))
        select_stmt = (
            select(Order)
            .where(Order.deleted_at.is_(None))
            .options(joinedload(Order.user)) # Carrega o relacionamento com o cliente
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        # 2. Se o admin passou um status para filtrar, aplica nas duas queries
        if status_filter:
            count_stmt = count_stmt.where(Order.status == status_filter)
            select_stmt = select_stmt.where(Order.status == status_filter)

        # 3. Executa a contagem total
        total_result = await self.db.execute(count_stmt)
        total_orders = total_result.scalar() or 0

        # 4. Executa a busca dos pedidos
        orders_result = await self.db.execute(select_stmt)
        orders_list = orders_result.scalars().all()

        # 5. Formata a resposta mapeando o nome do cliente vindo da relação Order.user
        from app.users.schemas import AdminOrderResponse
        formatted_orders = [
            AdminOrderResponse(
                id=order.id,
                client_name=order.user.name if order.user else "Cliente Desconhecido",
                status=order.status,
                total_amount=order.total_amount,
                created_at=order.created_at
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
    async def get_all_customers_admin(self, page: int = 1, limit: int = 10):

        if page < 1: page = 1
        if limit < 1: limit = 10
        offset = (page - 1) * limit

        # 1. Conta o total de usuários não deletados
        count_stmt = select(func.count(User.id)).where(
            User.deleted_at.is_(None)
        )
        total_result = await self.db.execute(count_stmt)
        total_users = total_result.scalar() or 0

        # 2. Busca os usuários e faz um LEFT JOIN com a tabela de pedidos agrupando por ID
        select_stmt = (
            select(User, func.count(Order.id).label("total_orders"))
            .join(Order, Order.user_id == User.id, isouter=True)
            .where(
                User.deleted_at.is_(None)
            )
            .group_by(User.id)
            .offset(offset)
            .limit(limit)
        )
        
        users_result = await self.db.execute(select_stmt)
        rows = users_result.all()

        # 3. Formata a lista de saída conforme o Schema
        from app.users.schemas import AdminUserListResponse
        formatted_users = [
            AdminUserListResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                phone=user.phone,
                role=user.role,
                is_active=user.is_active,
                total_orders=total_orders,
                created_at=user.created_at
            )
            for user, total_orders in rows
        ]

        total_pages = ceil(total_users / limit) if total_users > 0 else 1

        return {
            "data": formatted_users,
            "total_users": total_users,
            "total_pages": total_pages,
            "page": page,
            "limit": limit
        }

    async def get_admin_users_summary(self):
        result = await self.db.execute(
            select(User).where(User.deleted_at.is_(None))
        )
        users = result.scalars().all()
        customers = [user for user in users if user.role == "customer"]
        admins = [user for user in users if user.role == "admin"]

        return {
            "total": len(users),
            "customers": len(customers),
            "admins": len(admins),
            "inactive": len([user for user in users if not user.is_active]),
        }
