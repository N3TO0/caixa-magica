from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.responses import success_response
from app.database import get_db
from app.orders.schemas import OrderCreate
from app.orders.service import OrderService


router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post("/")
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.create_order(data)
    return success_response(
        data={
            "id": order.id,
            "status": order.status,
            "total": float(order.total_amount),
        },
        message="Pedido criado com sucesso",
    )


@router.get("/disponibilidade/{product_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def check_availability(product_id: int):
    return {"detail": "Endpoint em desenvolvimento"}


@router.get("/{order_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_order(order_id: int):
    return {"detail": "Endpoint em desenvolvimento"}


@router.patch("/{order_id}/status", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def update_order_status(order_id: int):
    return {"detail": "Endpoint em desenvolvimento"}
