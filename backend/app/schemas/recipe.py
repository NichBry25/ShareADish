from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId
from pydantic import BaseModel, Field
from .pyid import PyObjectId
from .nutrient import Nutrients

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
    nutrition: Nutrients
    comments: list[CommentResponse] = []  # fully embedded comments
    rating: Optional[float] = None
    rated_by: Optional[list[str]] = []  # List of user IDs who rated
    no_rated: Optional[int] = 0
    tags: Optional[list[str]] = []
    original_prompt: str
    verified: bool = False

class RecipeCreate(RecipeBase):
    pass

class RecipeDB(RecipeBase):
    created_by: str  # User ID
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

class RecipeSearch(BaseModel):
    query: str
    tags: Optional[list[str]] = []
    min_rating: Optional[float] = None
    max_results: Optional[int] = 10

class RecipeList(BaseModel):
    recipes: list[RecipeDB]