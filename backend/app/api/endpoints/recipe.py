from fastapi import APIRouter, HTTPException, Depends
from ...services import get_current_user
from ...schemas import RecipeCreate, RecipeDB
from ...services import create_recipe

router = APIRouter(prefix="/recipe", tags=["recipe"])

@router.get("/", response_model=dict)
def return_all_recipe(limit: int = 10):
    pass

@router.post("/")
def post_recipe(recipe_post: dict): # TODO - Should checking for JWT Token be here or frontend?
    new_recipe_id = create_recipe(recipe_post)
    return {"id": new_recipe_id}