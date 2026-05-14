from fastapi import APIRouter, status


auth_router = APIRouter(prefix="/auth", tags=["Usuários"])
users_router = APIRouter(prefix="/usuarios", tags=["Usuários"])


@auth_router.post("/register", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def register():
    return {"detail": "Endpoint em desenvolvimento"}


@auth_router.post("/login", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def login():
    return {"detail": "Endpoint em desenvolvimento"}


@users_router.get("/me", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_me():
    return {"detail": "Endpoint em desenvolvimento"}


@users_router.get("/me/pedidos", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_my_orders():
    return {"detail": "Endpoint em desenvolvimento"}


@users_router.post("/me/enderecos", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def add_address():
    return {"detail": "Endpoint em desenvolvimento"}
