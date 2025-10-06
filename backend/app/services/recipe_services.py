from ..schemas import RecipeCreate
from fastapi import HTTPException
from ..database import recipe_db

def create_recipe(recipe_data: RecipeCreate):
    recipe_doc = recipe_data.model_dump()
    try:
        result = recipe_db.insert_one(recipe_doc)
        return str(result.inserted_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create recipe")
    

    