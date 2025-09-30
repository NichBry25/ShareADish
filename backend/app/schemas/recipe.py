from pydantic import BaseModel
from typing import List

# Schema for comments
class CommentBase(BaseModel):
    id: int
    recipe_id: int
    user_id: int
    content: str

# Schema for creating a comment
class CommentCreate(CommentBase):
    pass

# Schema for returning comment information
class CommentRead(CommentBase):
    pass

# Schema for creating recipe
class Recipe(BaseModel):
    title: str
    description: str
    ingredients: str # TODO define how we store ingredients
    instructions: List[str]

# Schema for returning recipe information
class RecipeRead(BaseModel):
    id: int
    title: str
    description: str
    ingredients: str # TODO define how we store ingredients
    instructions: List[str]

class RecipeImage(BaseModel):
    id: int
    image_url: str
