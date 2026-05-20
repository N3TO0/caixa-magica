import os
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _resolve_env_file() -> str | None:
    """Em produção na Vercel, usa apenas Environment Variables do painel."""
    if os.getenv("VERCEL") or os.getenv("VERCEL_ENV"):
        return None
    env_path = Path(__file__).resolve().parent.parent / ".env"
    return str(env_path) if env_path.is_file() else None


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=_resolve_env_file(),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if not isinstance(value, str):
            return value
        url = value.strip()
        if url.startswith("postgres://"):
            return "postgresql+asyncpg://" + url[len("postgres://") :]
        if url.startswith("postgresql://") and "+asyncpg" not in url:
            return "postgresql+asyncpg://" + url[len("postgresql://") :]
        return url


settings = Settings()
