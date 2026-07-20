from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


__all__ = [
    "Category",
    "ProductCategory",
    "Product",
    "ProductPricing",
    "ProductImage",
]

# -------------------------------------------------------------------------
# Categoria de produtos
# Permite estrutura hierárquica (categoria pai e categorias filhas)
# Ex.: Brinquedos -> Desenvolvimento Sensorial
# -------------------------------------------------------------------------
class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    # Relacionamento recursivo para categorias pai/filhas
    parent_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL")
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    parent: Mapped[Optional["Category"]] = relationship(
        "Category", remote_side="Category.id", back_populates="children"
    )
    children: Mapped[List["Category"]] = relationship(
        "Category", back_populates="parent"
    )
    products: Mapped[List["Product"]] = relationship(
        "Product",
        secondary="product_categories",
        back_populates="categories",
        viewonly=True,
    )

# -------------------------------------------------------------------------
# Tabela associativa Produto x Categoria
# Implementa relacionamento muitos-para-muitos
# -------------------------------------------------------------------------
class ProductCategory(Base):
    __tablename__ = "product_categories"
    __table_args__ = (
        UniqueConstraint("product_id", "category_id", name="uq_product_category"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True
    )
# -------------------------------------------------------------------------
# Produto disponível para locação
# -------------------------------------------------------------------------

class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("total_units > 0", name="ck_products_total_units_positive"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
     # Tipo do produto (rental, sale, etc.)
    type: Mapped[str] = mapped_column(String(20), default="rental", nullable=False)
    age_range: Mapped[Optional[str]] = mapped_column(String(50))
    # Quantidade total disponível para locação
    total_units: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    sale_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2))
    rental_rules: Mapped[Optional[str]] = mapped_column(Text)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
     # Exclusão lógica
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    categories: Mapped[List["Category"]] = relationship(
        "Category",
        secondary="product_categories",
        back_populates="products",
        viewonly=True,
    )
    pricing: Mapped[List["ProductPricing"]] = relationship(
        "ProductPricing", back_populates="product", cascade="all, delete-orphan"
    )
    images: Mapped[List["ProductImage"]] = relationship(
        "ProductImage", back_populates="product", cascade="all, delete-orphan"
    )


# -------------------------------------------------------------------------
# Faixas de preço do produto por período de locação
# Ex.: 7 dias = R$49,90 | 15 dias = R$89,90
# -------------------------------------------------------------------------
class ProductPricing(Base):
    __tablename__ = "product_pricing"
    __table_args__ = (
        UniqueConstraint("product_id", "days", name="uq_product_pricing_days"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    days: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    product: Mapped["Product"] = relationship("Product", back_populates="pricing")

# -------------------------------------------------------------------------
# Imagens associadas ao produto
# -------------------------------------------------------------------------
class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    # Ordem de exibição das imagens na interface
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    product: Mapped["Product"] = relationship("Product", back_populates="images")
