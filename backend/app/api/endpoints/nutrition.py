from ...schemas import Nutrients, NutrientsRequest
from fastapi import APIRouter, HTTPException, ErrorResponse
from ...utils.matching import match_ingredients

router = APIRouter(prefix="/nutrition",
                   tags=["nutrition"])

@router.post('/', response_model=Nutrients,
                responses={400: {"model": ErrorResponse}}
            )
async def get_nutrients(ingredients: NutrientsRequest):
    nutrients = match_ingredients(ingredients_list=ingredients.ingredients)

    return(Nutrients(protein=nutrients['protein'], 
                     carbohydrates=nutrients['carbohydrates'],
                     fiber=nutrients['fiber'],
                     calories=nutrients['calories'],
                     fats=nutrients['fat']))