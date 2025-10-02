from typing import Optional
from .pyid import PyObjectId
from bson import ObjectId
from datetime import datetime, timezone
from pydantic import BaseModel, Field

# --- Base schema ---
class UserBase(BaseModel):
    username: str

# --- Create input ---
class UserCreate(UserBase):
    password: str

# --- Database model ---
class UserDB(UserBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory= datetime.now(timezone.utc))
    hashed_password: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- Response model ---
class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True
