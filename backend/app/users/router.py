from fastapi import APIRouter, status, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.users.schemas import UserOut

from app.core.security import get_current_user # E garanta que o get_current_user está importado

from app.database import get_db  # Ajuste o import se o arquivo de sessão tiver outro nome
from app.users.schemas import UserCreate, UserOut
from app.users.service import UserService
from app.users.schemas import LoginRequest, TokenOut


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
    
    # Executa a autenticação e gera o token
    token_response = await user_service.authenticate(data)
    
    return token_response


@users_router.get("/me", status_code=status.HTTP_200_OK, response_model=UserOut)
async def get_me(current_user = Depends(get_current_user)):
    return current_user


@users_router.get("/me/pedidos", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_my_orders():
    return {"detail": "Endpoint em desenvolvimento"}


@users_router.post("/me/enderecos", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def add_address():
    return {"detail": "Endpoint em desenvolvimento"}
