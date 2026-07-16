from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class UserCreate(BaseModel):
    name: str
    email: str
    password: str = Field(..., min_length=6, max_length=72)
    phone: Optional[str] = None
    cpf: Optional[str] = None
    birthdate: Optional[date] = None


class AdminUserCreate(UserCreate):
    role: str = "customer"
    is_active: bool = True


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    cpf: Optional[str] = None
    phone: Optional[str] = None
    birthdate: Optional[date] = None
    profile_photo: Optional[str] = None
    zip_code: Optional[str] = None
    street: Optional[str] = None
    number: Optional[str] = None
    complement: Optional[str] = None
    neighborhood: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthOut(TokenOut):
    user: UserOut


class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: Optional[str] = None
    email: Optional[str] = None
    cpf: Optional[str] = None
    phone: Optional[str] = None
    birthdate: Optional[date] = None
    profile_photo: Optional[str] = None
    zip_code: Optional[str] = None
    street: Optional[str] = None
    number: Optional[str] = None
    complement: Optional[str] = None
    neighborhood: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6, max_length=72)

    @field_validator(
        "name",
        "email",
        "cpf",
        "phone",
        "profile_photo",
        "zip_code",
        "street",
        "number",
        "complement",
        "neighborhood",
        "city",
        "state",
        "password",
        mode="before",
    )
    @classmethod
    def empty_strings_to_none(cls, value):
        if isinstance(value, str):
            value = value.strip()
            if value == "":
                return None
            return value.upper() if len(value) == 2 else value
        return value

    @field_validator("birthdate", mode="before")
    @classmethod
    def empty_birthdate_to_none(cls, value):
        if value == "":
            return None
        if isinstance(value, datetime):
            return value.date()
        if isinstance(value, str) and "T" in value:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
        return value


class AdminUserUpdate(UserUpdate):
    role: Optional[str] = None
    is_active: Optional[bool] = None


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

class AdminUserListResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    total_orders: int  
    created_at: datetime

    class Config:
        from_attributes = True

class AdminUserPaginatedResponse(BaseModel):
    success: bool
    data: List[AdminUserListResponse]
    total_users: int
    total_pages: int
    page: int
    limit: int
    message: str
