from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class OrderItemCreate(BaseModel):
    product_id: int
    days: int
    start_date: date
    end_date: date


class OrderCreate(BaseModel):
    user_id: int
    address_id: Optional[int] = None
    delivery_type: str
    payment_type: str
    notes: Optional[str] = None
    baby_name: Optional[str] = None
    baby_birthdate: Optional[date] = None
    origin: str = "site"
    items: List[OrderItemCreate]


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


class OrderDetailOut(OrderOut):
    items: List[OrderItemOut] = []
