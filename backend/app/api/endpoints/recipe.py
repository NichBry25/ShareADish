from fastapi import APIRouter, HTTPException, Depends
from ...services import get_current_user
from ...schemas import RecipeCreate, RecipeDB
from ...services import save_new_recipe

router = APIRouter(prefix="/recipe", tags=["recipe"])

@router.get("/", response_model=dict)
def return_all_recipe(limit: int = 10):
    pass

@router.post("/")
def post_recipe(recipe_post: RecipeCreate, user:dict = Depends(get_current_user)):
    new_recipe_id = save_new_recipe(recipe_post, user)
    return {"id": new_recipe_id}