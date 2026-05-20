from datetime import datetime, timedelta, timezone
from typing import Optional, Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.core.exceptions import UnauthorizedException


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        raise UnauthorizedException("Token inválido ou expirado") from exc


# -------------------------------------------------------------------------
# Lógica de Autenticação e Dependência do Usuário Atual
# -------------------------------------------------------------------------

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Define onde o FastAPI deve buscar o token em rotas protegidas
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
    
async def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    from app.users.models import User
    from app.core.exceptions import UnauthorizedException
    from app.database import get_db  # Importamos o get_db aqui para buscar a sessão

    # Pegamos a sessão do banco de dados direto aqui dentro de forma limpa
    db = None
    async for session in get_db():
        db = session
        break

    if db is None:
        raise UnauthorizedException("Erro ao conectar ao banco de dados")

    # Decoder do token original
    payload = decode_token(token)
    user_id: str = payload.get("sub")
    
    if user_id is None:
        raise UnauthorizedException("Token inválido ou expirado")

    # Busca o usuário no banco
    query = select(User).where(User.id == int(user_id))
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if user is None:
        raise UnauthorizedException("Usuário não encontrado")

    return user