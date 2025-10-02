# Handles user CRUD
from ..core import hash_password, verify_password
from fastapi import Depends
from ..db import get_session, user_db
from ..schemas import UserCreate

async def register_user(user_data: UserCreate):
    hashed_pw = hash_password(user_data.password)
    user_doc = {
        "username": user_data.username,
        "password": hashed_pw
    }
    result = await user_db.insert_one(user_doc)
    return str(result.inserted_id)