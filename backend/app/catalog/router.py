from fastapi import APIRouter, status


router = APIRouter(prefix="/produtos", tags=["Catálogo"])


@router.get("/", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def list_products():
    return {"detail": "Endpoint em desenvolvimento"}


@router.get("/categorias", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def list_categories():
    return {"detail": "Endpoint em desenvolvimento"}


@router.get("/{product_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_product(product_id: int):
    return {"detail": "Endpoint em desenvolvimento"}
