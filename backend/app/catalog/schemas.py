from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

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
    rental_rules: Optional[str] = None
    is_featured: bool
    is_active: bool


class ProductDetailOut(ProductOut):
    pricing: List[ProductPricingOut] = []
    images: List[ProductImageOut] = []
class ProductPricingCreate(BaseModel):
    days: int = Field(gt=0)
    price: Decimal = Field(gt=0)


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    type: str = "rental"
    age_range: Optional[str] = None
    total_units: int = Field(gt=0)
    rental_rules: Optional[str] = None
    is_featured: bool = False

    categories: list[int]
    pricing: list[ProductPricingCreate]


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    age_range: Optional[str] = None
    total_units: Optional[int] = Field(default=None, gt=0)
    rental_rules: Optional[str] = None
    is_featured: Optional[bool] = None

    categories: Optional[list[int]] = None
    pricing: Optional[list[ProductPricingCreate]] = None


class ProductStatusUpdate(BaseModel):
    ativo: bool