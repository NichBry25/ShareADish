from fastapi import APIRouter
from ...schemas import UserCreate
from ...services import register_user

router = APIRouter(prefix="/user",
                   tags=["user"])

@router.post("/")
async def register_route(user_data: UserCreate):
    id = register_user(user_data)
    return id
