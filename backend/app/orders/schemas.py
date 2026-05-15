from datetime import date, datetime
from decimal import Decimal
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class OrderItemCreate(BaseModel):
    product_id: int
    days: Literal[7, 15, 30]
    start_date: date
    end_date: date


class OrderCreate(BaseModel):
    address_id: Optional[int] = None
    delivery_type: Literal["delivery", "pickup"]
    payment_type: Literal["on_delivery_cash", "on_delivery_card", "pending"]
    notes: Optional[str] = None
    baby_name: Optional[str] = None
    baby_birthdate: Optional[date] = None
    origin: str = "site"
    items: List[OrderItemCreate] = Field(min_length=1)


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    days: int
    price_snapshot: Decimal
    start_date: date
    end_date: date


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    delivery_type: str
    payment_type: str
    total_amount: Decimal
    origin: str
    created_at: datetime
    items: List[OrderItemOut] = []


class OrderDetailOut(OrderOut):
    pass
