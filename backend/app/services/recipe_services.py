from ..schemas import RecipeCreate
from fastapi import HTTPException
from ..database import recipe_db

def create_recipe(recipe_data: dict):
    recipe_doc = recipe_data # TODO make a proper model
    try:
        result = recipe_db.insert_one({"test":recipe_doc})
        return str(result.inserted_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    