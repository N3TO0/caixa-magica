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
from app.database import get_db
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

# Define onde o FastAPI deve buscar o token JWT
# Sempre que uma rota usar Depends(get_current_user),
# o FastAPI vai procurar o token no header:
#
# Authorization: Bearer <token>
#
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login-swagger"
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Recupera o usuário autenticado a partir do token JWT.

    Fluxo:
    1. Recebe o token enviado no header Authorization.
    2. Decodifica o token.
    3. Obtém o ID do usuário salvo no campo "sub".
    4. Busca o usuário no banco.
    5. Retorna o usuário autenticado.
    """

    from app.users.models import User

    # Decodifica o JWT
    payload = decode_token(token)

    # Recupera o ID do usuário armazenado no token
    user_id = payload.get("sub")

    # Se não existir "sub", o token é inválido
    if user_id is None:
        raise UnauthorizedException(
            "Token inválido ou expirado"
        )

    # Busca o usuário diretamente usando a sessão
    # recebida pelo sistema de dependências do FastAPI
    result = await db.execute(
        select(User)
        .options(selectinload(User.addresses))
        .where(
            User.id == int(user_id)
        )
    )

    user = result.scalar_one_or_none()

    # Usuário não encontrado no banco
    if user is None:
        raise UnauthorizedException(
            "Usuário não encontrado"
        )

    # Retorna o usuário autenticado para a rota
    return user
