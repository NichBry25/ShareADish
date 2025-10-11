from typing import Optional, List
from datetime import datetime, timezone
from bson import ObjectId
from pydantic import BaseModel, Field
from .pyid import PyObjectId
from .nutrient import Nutrients
from fastapi import UploadFile

# --- Comment Models ---
class Comment(BaseModel):
    content: str
    image_url: Optional[str] = ""

class CommentCreate(Comment):
    username: str
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommentResponse(Comment):
    username: str
    created_at: datetime
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

class RatingCreate(BaseModel):
    value: float

class Rating(BaseModel):
    username: str
    value: float

# --- Recipe Models ---
class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    ingredients: list[str]
    instructions: list[str]
    nutrition: Nutrients
    rating: Optional[float] = 0.0
    rated_by: Optional[list[Rating]] = []
    no_rated: Optional[int] = 0
    tags: Optional[list[str]] = []
    comments:list[CommentResponse]=[]
    original_prompt: str
    verified: bool = False

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(RecipeBase):
    id:str

class RecipeDB(RecipeBase):
    created_by: str  # User ID
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    sections: Optional[List[str]] = ['feed']
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class RecipeSearch(BaseModel):
    query: str
    tag: str
    min_rating: Optional[float] = None
    max_results: Optional[int] = 10

class RecipeList(BaseModel):
    recipes: list[RecipeDB]