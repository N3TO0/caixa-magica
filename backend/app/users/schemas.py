from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    name: str
    email: str
    password: str = Field(..., min_length=6, max_length=72)
    phone: Optional[str] = None
    cpf: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AddressCreate(BaseModel):
    zip_code: str
    street: str
    number: str
    complement: Optional[str] = None
    neighborhood: str
    city: str
    state: str
    label: Optional[str] = None
    is_default: bool = False


class AddressOut(AddressCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int


# ---------------------------------------------------------------
from decimal import Decimal
from typing import List

class OrderHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    total_amount: Decimal  # Lembre de importar 'from decimal import Decimal' no topo se não tiver
    created_at: datetime
    items_count: int

class OrderHistoryPaginatedResponse(BaseModel):
    success: bool = True
    data: List[OrderHistoryResponse]  # Lembre de importar 'from typing import List' no topo
    total_orders: int
    total_pages: int
    page: int
    limit: int
    message: str = "ok"
