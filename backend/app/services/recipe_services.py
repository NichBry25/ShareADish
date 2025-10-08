from ..schemas import RecipeCreate, RecipeDB, Nutrients
from fastapi import HTTPException
from ..database import recipe_db

def save_new_recipe(recipe_data: RecipeCreate, user: dict):
    recipe_doc = recipe_data.model_dump()
    recipe_doc["created_by"] = user["id"]
    try:
        result = RecipeDB.model_validate(recipe_doc)
        inserted = recipe_db.insert_one(result.model_dump(by_alias=True))
        return str(inserted.inserted_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create recipe")
    
if __name__ == "__main__":
    test = RecipeCreate(
        title="Test Recipe",
        description="A simple test recipe",
        ingredients=["1 cup flour", "2 eggs"],
        instructions=["Mix ingredients", "Bake at 350F for 20 minutes"],
        nutrition=Nutrients(
            protein=str(10),
            carbohydrates=str(20),
            fiber=str(3),
            fats=str(5),
            calories=str(200)
        ),
        original_prompt="Create a simple recipe",
        verified=False
    )
    user = {"id": "user123"}
    print(save_new_recipe(test, user))