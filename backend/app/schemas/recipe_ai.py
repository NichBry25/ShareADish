from pydantic import BaseModel, Field
from typing import List

class UnitName(BaseModel):
    protein: str
    carbs: str
    fiber: str
    energy: str

class Nutrients(BaseModel):
    protein: float
    carbs: float
    fiber: float
    energy: float
    unit_name: UnitName


class Ingredient(BaseModel):
    name: str 
    nutrients: Nutrients

class RecipeCreationBase(BaseModel):
    '''
    Base model for receiving recipe from AI/generate
    '''
    prompt:List[str]
    ingredients:List[Ingredient]
    method:List[str]

class RecipeEditResponse(RecipeCreationBase):
    title:str


class RecipeEditRequest(BaseModel):
    recipe: RecipeEditResponse
    prompt:str

class GenerateRequest(BaseModel):
    prompt:str
