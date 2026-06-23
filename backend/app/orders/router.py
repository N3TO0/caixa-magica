from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.responses import success_response
from app.core.security import get_current_user
from app.database import get_db
from app.orders.schemas import OrderCreate, OrderStatusUpdate
from app.orders.service import OrderService
from app.users.models import User


router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post("/")
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = OrderService(db)
    order = await service.create_order(data, user_id=current_user.id)
    return success_response(
        data={
            "id": order.id,
            "status": order.status,
            "total": float(order.total_amount),
        },
        message="Pedido criado com sucesso",
    )


@router.get("/disponibilidade/{product_id}")
async def check_availability(
    product_id: int,
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    result = await service.check_availability(product_id, start_date, end_date)
    return success_response(data=result)


@router.get("/{order_id}")
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = OrderService(db)
    order = await service.get_order_by_id(
        order_id, requesting_user_id=current_user.id
    )

    return success_response(
        data={
            "id": order.id,
            "status": order.status,
            "delivery_type": order.delivery_type,
            "payment_type": order.payment_type,
            "total_amount": float(order.total_amount),
            "origin": order.origin,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "id": item.id,
                    "product_name": item.product.name,
                    "days": item.days,
                    "price": float(item.price_snapshot),
                    "start_date": item.start_date.isoformat(),
                    "end_date": item.end_date.isoformat(),
                }
                for item in order.items
            ],
            "status_history": [
                {
                    "status": h.new_status,
                    "changed_at": h.created_at.isoformat(),
                }
                for h in order.status_history
            ],
        }
    )


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado"
        )

    service = OrderService(db)
    order = await service.update_status(
        order_id, data.novo_status, data.observacao, current_user.id
    )
    return success_response(data={"id": order.id, "status": order.status})


@router.post("/admin/expirar")
async def expire_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado"
        )

    service = OrderService(db)
    result = await service.expire_pending_orders()
    return success_response(
        data=result,
        message=f"{result['cancelados']} pedido(s) expirado(s)",
    )
