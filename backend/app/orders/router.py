from fastapi import APIRouter, status


router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post("/", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def create_order():
    return {"detail": "Endpoint em desenvolvimento"}


@router.get("/disponibilidade/{product_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def check_availability(product_id: int):
    return {"detail": "Endpoint em desenvolvimento"}


@router.get("/{order_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_order(order_id: int):
    return {"detail": "Endpoint em desenvolvimento"}


@router.patch("/{order_id}/status", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def update_order_status(order_id: int):
    return {"detail": "Endpoint em desenvolvimento"}
