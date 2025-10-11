from io import BytesIO
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from ...services import get_current_user
from ...schemas import RecipeCreate,RecipeUpdate, ErrorResponse, RecipeDB, RecipeList, RecipeSearch, CommentCreate, CommentResponse, Comment
from ...database import recipe_db
from ...services import save_new_recipe
from ...services.image import upload, delete
from typing import Optional

router = APIRouter(prefix="/recipe", tags=["recipe"])

@router.get("/", response_model=RecipeList)
async def return_all_recipe(limit: int = 10):
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
async def post_recipe(recipe_post: RecipeCreate, user:dict = Depends(get_current_user)):
    new_recipe_id = save_new_recipe(recipe_post, user)
    return {"id": new_recipe_id}

@router.get("/{recipe_id}", response_model=RecipeDB)
async def get_recipe(recipe_id: str):
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
async def search_recipes(payload: RecipeSearch):
    search_filter = {}
    if len(payload.query) !=0:
        words = payload.query.split()
        search_filter["$and"] = [
            {"title": {"$regex": word, "$options": "i"}} for word in words
        ]
        print('query')
        print(payload.query)
    if len(payload.tag) !=0:
        print('tag')
        print(payload.tag)
        search_filter["tags"] = {"$in": [payload.tag]}
    if payload.min_rating is not None:
        search_filter["rating"] = {"$gte": payload.min_rating}
    cursor = recipe_db.find(search_filter)
    recipes = [
        RecipeDB.model_validate(recipe).model_dump(by_alias=True)
        for recipe in cursor
    ]
    return RecipeList(recipes=recipes)

@router.put("/rate/{recipe_id}")
async def like_recipe(recipe_id: str, rating:float = Query(..., ge=1, le=5), user: dict = Depends(get_current_user)):
    recipe = recipe_db.find_one({"_id": recipe_id})
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    if any(r["username"] == user["username"] for r in recipe.get("rated_by", [])):
        raise HTTPException(status_code=400, detail="User has already rated this recipe")
    
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    no_rated = recipe.get("no_rated", 0) + 1
    current_rating = recipe.get("rating", 0)
    new_rating = (current_rating * (no_rated - 1) + rating) / no_rated
    rated_by = recipe.get("rated_by", [])
    rated_by.append({"username": user["username"], "value": rating})
    recipe_db.update_one(
        {"_id": recipe_id},
        {"$set": {"rating": new_rating, "no_rated": no_rated, "rated_by": rated_by}}
    )
    return {"message": "Recipe rated successfully"}

@router.put("/comment/{recipe_id}")
async def comment_recipe(recipe_id: str, content: str = Form(...), image: Optional[UploadFile] = File(None), user: dict = Depends(get_current_user)):
    recipe = recipe_db.find_one({"_id": recipe_id})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    url = None
    if image:
        file_bytes = BytesIO(await image.read())
        url = await upload(file_bytes)
    
    comment_doc = {
        'username':user['username'],
        'content':content,
        'image_url':url
    }

    comment_db= CommentCreate.model_validate(comment_doc).model_dump(by_alias=True)
    recipe_db.update_one(
        {"_id": recipe_id},
        {"$push": {"comments": comment_db}}
    )
    return {"message": "Comment added successfully"}

@router.delete("/comment/{recipe_id}/{comment_id}")
async def delete_comment(recipe_id: str, comment_id: str, user: dict = Depends(get_current_user)):
    recipe = recipe_db.find_one({"_id": recipe_id})

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    comment_to_delete = None
    for comment in recipe.get("comments", []):
        if str(comment["_id"]) == comment_id:
            comment_to_delete = comment
            break
    

    if not comment_to_delete:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment_to_delete['image_url']:
        image_id = comment_to_delete['image_url'].split('/')[-1].split('.')[0] # Get the last part of the link and the file name, eg https://cloudinaryurl/smthsmth.jpg -> smthsmth
        await delete(image_id)

    if comment_to_delete["username"] != user["username"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    recipe_db.update_one(
        {"_id": recipe_id},
        {"$pull": {"comments": {"_id": comment_to_delete["_id"]}}}
    )
    return {"message": "Comment deleted successfully"}

@router.delete("/{recipe_id}")
async def delete_recipe(recipe_id: str, user: dict = Depends(get_current_user)):
    recipe = recipe_db.find_one({"_id": recipe_id})

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    if recipe["created_by"] != user["username"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this recipe")

    recipe_db.delete_one({"_id": recipe_id})
    return {"message": "Recipe deleted successfully"}

@router.put('/{recipe_id}')
async def update(recipe_id: str,recipe:RecipeUpdate, user: dict = Depends(get_current_user)):
    recipe_a = recipe_db.find_one({"_id": recipe_id})
    if recipe_a["created_by"] != user["username"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this recipe")
    recipe_db.update_one({'_id':recipe_id},{'$set':recipe.model_dump(by_alias=True)})
    return {"message": "Recipe edited successfully"}