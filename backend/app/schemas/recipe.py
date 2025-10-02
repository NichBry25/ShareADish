from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId
from pydantic import BaseModel, Field
from .pyid import PyObjectId

# --- Comment Models ---
class CommentBase(BaseModel):
    content: str
    created_by: str  # User ID
    image_url: Optional[str] = None

class CommentCreate(CommentBase):
    pass

class CommentDB(CommentBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class CommentResponse(CommentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Recipe Models ---
class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    ingredients: list[str]
    instructions: list[str]
    comments: list[CommentResponse] = []  # fully embedded comments
    created_by: str  # User ID
    likes: int = 0
    original_prompt: str
    verified: bool = False

class RecipeCreate(RecipeBase):
    pass

class RecipeDB(RecipeBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class RecipeResponse(RecipeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
