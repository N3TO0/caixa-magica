from datetime import UTC, date, datetime, timedelta
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.catalog.models import Product, ProductPricing
from app.orders.models import Order, OrderItem, OrderStatusHistory, Reservation
from app.orders.schemas import OrderCreate
from app.users.models import User


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_order(self, data: OrderCreate) -> Order:
        try:
            item_specs = []
            for item in data.items:
                product = await self.db.get(Product, item.product_id)
                if product is None or not product.is_active:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Produto {item.product_id} não encontrado",
                    )

                pricing_result = await self.db.execute(
                    select(ProductPricing).where(
                        ProductPricing.product_id == item.product_id,
                        ProductPricing.days == item.days,
                        ProductPricing.is_active.is_(True),
                    )
                )
                pricing = pricing_result.scalar_one_or_none()
                if pricing is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Produto {product.name} não possui preço para {item.days} dias",
                    )

                item_specs.append((item, product, pricing))

            for item, product, _ in item_specs:
                count_result = await self.db.execute(
                    select(func.count())
                    .select_from(Reservation)
                    .where(
                        Reservation.product_id == item.product_id,
                        Reservation.status == "active",
                        Reservation.period_start < item.end_date,
                        Reservation.period_end > item.start_date,
                    )
                )
                active_count = count_result.scalar_one()
                if active_count >= product.total_units:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Produto {product.name} não está disponível no período selecionado",
                    )

            total_amount = sum(
                (pricing.price for _, _, pricing in item_specs), Decimal("0")
            )

            order = Order(
                user_id=1,  # TODO: trocar por current_user.id quando o JWT do Neto chegar
                address_id=data.address_id,
                delivery_type=data.delivery_type,
                payment_type=data.payment_type,
                status="pendente",
                total_amount=total_amount,
                baby_name=data.baby_name,
                baby_birthdate=data.baby_birthdate,
                notes=data.notes,
                origin=data.origin,
                expires_at=datetime.now(UTC) + timedelta(days=3),
            )
            self.db.add(order)
            await self.db.flush()

            for item, _, pricing in item_specs:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    days=item.days,
                    price_snapshot=pricing.price,
                    start_date=item.start_date,
                    end_date=item.end_date,
                )
                self.db.add(order_item)
                await self.db.flush()

                reservation = Reservation(
                    product_id=item.product_id,
                    order_item_id=order_item.id,
                    period_start=item.start_date,
                    period_end=item.end_date,
                    status="active",
                )
                self.db.add(reservation)

            history = OrderStatusHistory(
                order_id=order.id,
                previous_status=None,
                new_status="pendente",
                changed_by=None,
            )
            self.db.add(history)

            await self.db.commit()
            await self.db.refresh(order)
            return order
        except Exception:
            await self.db.rollback()
            raise

    async def get_order_by_id(
        self, order_id: int, requesting_user_id: int
    ) -> Order:
        result = await self.db.execute(
            select(Order)
            .options(
                selectinload(Order.items).joinedload(OrderItem.product),
                selectinload(Order.status_history),
            )
            .where(Order.id == order_id)
        )
        order = result.scalar_one_or_none()
        if order is None or order.deleted_at is not None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido não encontrado",
            )

        if order.user_id != requesting_user_id:
            user = await self.db.get(User, requesting_user_id)
            if user is None or user.role != "admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Acesso negado",
                )

        return order

    async def update_status(
        self, order_id: int, new_status: str, changed_by: int | None = None
    ):
        raise NotImplementedError

    async def check_availability(self, product_id: int, start: date, end: date):
        raise NotImplementedError
