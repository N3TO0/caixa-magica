from decimal import Decimal
from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool = True


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


class ProductImageCreate(BaseModel):
    url: str
    display_order: int = 0


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    type: str
    age_range: Optional[str] = None
    total_units: int
    available_units: int
    sale_price: Optional[Decimal] = None
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
    sale_price: Optional[Decimal] = Field(default=None, gt=0)
    rental_rules: Optional[str] = None
    is_featured: bool = False

    categories: list[int]
    pricing: list[ProductPricingCreate] = []
    images: list[ProductImageCreate] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    age_range: Optional[str] = None
    total_units: Optional[int] = Field(default=None, gt=0)
    sale_price: Optional[Decimal] = Field(default=None, gt=0)
    rental_rules: Optional[str] = None
    is_featured: Optional[bool] = None

    categories: Optional[list[int]] = None
    pricing: Optional[list[ProductPricingCreate]] = None
    images: Optional[list[ProductImageCreate]] = None


class ProductStatusUpdate(BaseModel):
    ativo: bool
