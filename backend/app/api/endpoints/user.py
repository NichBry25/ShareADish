from fastapi import APIRouter, Depends
from ...db import get_session
from ...schemas import UserCreate

router = APIRouter(prefix="/user",
                   tags=["user"])

@router.post("/")
async def register_user(user_data: UserCreate, db=Depends(get_session)):
    print(user_data.model_dump)
