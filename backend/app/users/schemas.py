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
    total_amount: Decimal  
    created_at: datetime
    items_count: int

class OrderHistoryPaginatedResponse(BaseModel):
    success: bool = True
    data: List[OrderHistoryResponse]  
    total_orders: int
    total_pages: int
    page: int
    limit: int
    message: str = "ok"

class AdminOrderResponse(BaseModel):
    id: int
    client_name: str  
    status: str
    total_amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class AdminOrderPaginatedResponse(BaseModel):
    success: bool
    data: List[AdminOrderResponse]
    total_orders: int
    total_pages: int
    page: int
    limit: int
    message: str