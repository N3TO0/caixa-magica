from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import (
    CHAR,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


__all__ = ["User", "Address", "Payment"]


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    cpf: Mapped[Optional[str]] = mapped_column(String(14), unique=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    birthdate: Mapped[Optional[date]] = mapped_column(Date)
    profile_photo: Mapped[Optional[str]] = mapped_column(Text)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="customer", nullable=False)
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
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    addresses: Mapped[List["Address"]] = relationship(
        "Address",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys="Address.user_id",
    )
    orders: Mapped[List["Order"]] = relationship(
        "Order",
        back_populates="user",
        foreign_keys="Order.user_id",
    )

    @property
    def default_address(self) -> Optional["Address"]:
        if not self.addresses:
            return None

        for address in self.addresses:
            if address.is_default:
                return address

        return self.addresses[0]

    @property
    def zip_code(self) -> Optional[str]:
        address = self.default_address
        return address.zip_code if address else None

    @property
    def street(self) -> Optional[str]:
        address = self.default_address
        return address.street if address else None

    @property
    def number(self) -> Optional[str]:
        address = self.default_address
        return address.number if address else None

    @property
    def complement(self) -> Optional[str]:
        address = self.default_address
        return address.complement if address else None

    @property
    def neighborhood(self) -> Optional[str]:
        address = self.default_address
        return address.neighborhood if address else None

    @property
    def city(self) -> Optional[str]:
        address = self.default_address
        return address.city if address else None

    @property
    def state(self) -> Optional[str]:
        address = self.default_address
        return address.state if address else None


class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label: Mapped[Optional[str]] = mapped_column(String(100))
    zip_code: Mapped[Optional[str]] = mapped_column(String(10))
    street: Mapped[Optional[str]] = mapped_column(String(255))
    number: Mapped[Optional[str]] = mapped_column(String(20))
    complement: Mapped[Optional[str]] = mapped_column(String(100))
    neighborhood: Mapped[Optional[str]] = mapped_column(String(100))
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(CHAR(2))
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(
        "User", back_populates="addresses", foreign_keys=[user_id]
    )
    orders: Mapped[List["Order"]] = relationship(
        "Order",
        back_populates="address",
        foreign_keys="Order.address_id",
    )


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    method: Mapped[str] = mapped_column(String(30), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    gateway: Mapped[Optional[str]] = mapped_column(String(50))
    transaction_id: Mapped[Optional[str]] = mapped_column(String(255))
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    order: Mapped["Order"] = relationship("Order", back_populates="payments")  # noqa: F821
