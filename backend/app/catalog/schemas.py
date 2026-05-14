from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool


class ProductPricingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    days: int
    price: Decimal
    is_active: bool


class ProductImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    display_order: int


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    type: str
    age_range: Optional[str] = None
    total_units: int
    is_featured: bool
    is_active: bool


class ProductDetailOut(ProductOut):
    pricing: List[ProductPricingOut] = []
    images: List[ProductImageOut] = []
