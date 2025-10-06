from pydantic import BaseModel, Field
from typing import List



class Nutrients(BaseModel):
    protein: float
    carbs: float
    fiber: float
    energy: float


class RecipeCreationBase(BaseModel):
    '''
    Base model for receiving recipe from AI/generate
    '''
    prompt:List[str]
    ingredients:List[str]
    nutrients:Nutrients
    method:List[str]

class RecipeEditResponse(RecipeCreationBase):
    title:str


class RecipeEditRequest(BaseModel):
    recipe: RecipeEditResponse
    prompt:str

class GenerateRequest(BaseModel):
    prompt:str
