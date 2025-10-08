from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
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

@router.put("/{recipe_id}")
def like_recipe(recipe_id: str, rating:int, user: dict = Depends(get_current_user)):
    recipe = recipe_db.find_one({"_id": recipe_id})
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    if user["username"] in recipe.get("rated_by", []):
        raise HTTPException(status_code=400, detail="User has already rated this recipe")
    
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    no_rated = recipe.get("no_rated", 0) + 1
    current_rating = recipe.get("rating", 0)
    new_rating = (current_rating * (no_rated - 1) + rating) / no_rated
    rated_by = recipe.get("rated_by", [])
    rated_by.append(user["username"])
    recipe_db.update_one(
        {"_id": recipe_id},
        {"$set": {"rating": new_rating, "no_rated": no_rated, "rated_by": rated_by}}
    )
    return {"message": "Recipe rated successfully"}


    
    