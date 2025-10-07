from pydantic import BaseModel
from typing import List

class Nutrients(BaseModel):
    protein: str
    carbohydrates: str
    fiber: str
    fats: str
    calories: str

class NutrientsRequest(BaseModel):
    ingredients: List[str]