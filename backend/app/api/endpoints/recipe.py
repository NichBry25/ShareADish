from fastapi import APIRouter, HTTPException, Depends
from ...services import get_current_user
from ...schemas import RecipeCreate, RecipeDB, RecipeList, RecipeSearch
from ...database import recipe_db
from ...services import save_new_recipe

router = APIRouter(prefix="/recipe", tags=["recipe"])

@router.get("/", response_model=RecipeList)
def return_all_recipe(limit: int = 10):
    """
    Fetch all recipes from the database with an optional limit.
    1. Query the database for recipes, limiting the number of results.
    2. Convert each recipe to the appropriate schema format.
    3. Return the list of recipes.
    """
    recipes = [
        RecipeDB.model_validate(recipe).model_dump(by_alias=True)
        for recipe in recipe_db.find().limit(limit)
    ]
    return {"recipes": recipes}

@router.post("/")
def post_recipe(recipe_post: RecipeCreate, user:dict = Depends(get_current_user)):
    new_recipe_id = save_new_recipe(recipe_post, user)
    return {"id": new_recipe_id}

@router.get("/{recipe_id}", response_model=RecipeDB)
def get_recipe(recipe_id: str):
    """
    Fetch a specific recipe by its ID.
    1. Query the database for the recipe with the given ID.
    2. If found, convert it to the appropriate schema format and return it.
    3. If not found, raise a 404 HTTP exception.
    """
    recipe = recipe_db.find_one({"_id": recipe_id})
    if recipe:
        return RecipeDB.model_validate(recipe)
    else:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
@router.post("/search/")
def search_recipes(payload: RecipeSearch):
    search_filter = {}

    # 🔍 1. Search by recipe title (case-insensitive)
    if payload.query:
        search_filter["title"] = {"$regex": payload.query, "$options": "i"}

    # 🏷️ 2. Search by tags (if any provided)
    if payload.tags:
        search_filter["tags"] = {"$in": payload.tags}

    # ⭐ 3. Filter by rating if needed
    if payload.min_rating is not None:
        # Assuming your documents have a numeric "rating" field
        search_filter["rating"] = {"$gte": payload.min_rating}

    # 📋 4. Query MongoDB
    cursor = recipe_db.find(search_filter).limit(payload.max_results or 10)

    # 🧩 5. Validate and serialize
    recipes = [
        RecipeDB.model_validate(recipe).model_dump(by_alias=True)
        for recipe in cursor
    ]

    # 📦 6. Return structured response
    return RecipeList(recipes=recipes)