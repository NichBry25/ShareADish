from pydantic import BaseModel
from typing import List
from .nutrient import Nutrients



class RecipeCreationBase(BaseModel):
    '''
    Base model for receiving recipe from AI/generate
    '''
    prompt:List[str]
    ingredients:List[str]
    nutrients:Nutrients
    steps:List[str]

class RecipeEditResponse(RecipeCreationBase):
    title:str


class RecipeEditRequest(BaseModel):
    recipe: RecipeEditResponse
    prompt:str

class GenerateRequest(BaseModel):
    prompt:str
