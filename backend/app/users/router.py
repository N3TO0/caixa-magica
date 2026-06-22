from fastapi import APIRouter, status, Depends, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user 

from app.database import get_db  
from app.users.schemas import UserCreate, UserOut, LoginRequest, TokenOut, AddressCreate, AddressOut, OrderHistoryPaginatedResponse
from app.users.service import UserService
# --------------------------------------------------------------------- import para utilizar o botão de autenticação do swagger:
from fastapi.security import OAuth2PasswordRequestForm

auth_router = APIRouter(prefix="/auth", tags=["Usuários"])
users_router = APIRouter(prefix="/usuarios", tags=["Usuários"])


@auth_router.post(
    "/register", 
    response_model=UserOut, 
    status_code=status.HTTP_201_CREATED
)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Instancia o serviço passando a sessão do banco de dados
    user_service = UserService(db)
    
    # Executa a lógica de cadastro e guarda o usuário retornado
    new_user = await user_service.register(data)
    
    return new_user

@auth_router.post(
    "/login", 
    response_model=TokenOut, 
    status_code=status.HTTP_200_OK
)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):  # <- Mudou aqui
    user_service = UserService(db)
    
    token_response = await user_service.authenticate(data)
    
    return token_response

@auth_router.post(
    "/login-swagger", 
    response_model=TokenOut, 
    status_code=status.HTTP_200_OK,
    include_in_schema=True 
)
async def login_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    user_service = UserService(db)
    
    data = LoginRequest(
        email=form_data.username, 
        password=form_data.password
    )
    
    token_response = await user_service.authenticate(data)
    
    return token_response

@users_router.get("/me", status_code=status.HTTP_200_OK, response_model=UserOut)
async def get_me(current_user = Depends(get_current_user)):
    return current_user


@users_router.get(
    "/me/pedidos", 
    status_code=status.HTTP_200_OK, 
    response_model=OrderHistoryPaginatedResponse
)
async def get_my_orders(
    page: int = Query(1, ge=1, description="Número da página"),
    limit: int = Query(10, ge=1, description="Itens por página"),
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_service = UserService(db)
    
    result = await user_service.get_user_orders(
        user_id=current_user.id, # Pega o ID do usuário autenticado no JWT [cite: 122]
        page=page,
        limit=limit
    )
    
    return OrderHistoryPaginatedResponse(
        success=True,
        data=result["data"],
        total_orders=result["total_orders"],
        total_pages=result["total_pages"],
        page=result["page"],
        limit=result["limit"],
        message="ok"
    )


@users_router.post(
    "/me/enderecos", 
    status_code=status.HTTP_201_CREATED, 
    response_model=AddressOut
)
async def add_address(
    data: AddressCreate, 
    current_user = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    user_service = UserService(db)
    
    # Vincula o endereço ao id do usuário do token e salva
    new_address = await user_service.add_address(
        user_id=current_user.id, 
        data=data
    )
    
    return new_address
