from fastapi import APIRouter, HTTPException, Depends
from ...services import get_current_user
from ...schemas import RecipeCreate, RecipeDB, RecipeList
from ...database import recipe_db
from ...services import save_new_recipe

router = APIRouter(prefix="/recipe", tags=["recipe"])

@router.get("/", response_model=RecipeList)
def return_all_recipe(limit: int = 10):
    recipes = [
        RecipeDB.model_validate(recipe).model_dump(by_alias=True)
        for recipe in recipe_db.find().limit(limit)
    ]
    return {"recipes": recipes}

@router.post("/")
def post_recipe(recipe_post: RecipeCreate, user:dict = Depends(get_current_user)):
    new_recipe_id = save_new_recipe(recipe_post, user)
    return {"id": new_recipe_id}