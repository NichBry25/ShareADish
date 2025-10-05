from fastapi import APIRouter, HTTPException
from ...schemas import RecipeCreationBase, RecipeEditRequest, GenerateRequest,RecipeEditResponse, ErrorResponse
from ...services.inference import generate,ai_edit

router = APIRouter(prefix="/ai",
                   tags=["ai"])


@router.post('/generate', response_model=RecipeCreationBase,
                responses={400: {"error": ErrorResponse}}
            )
async def generate(prompt: GenerateRequest):
    recipe = generate(prompt.prompt)
    if 'error' in recipe.keys():
        raise HTTPException(status_code=400, detail=recipe['error'])

    return(RecipeCreationBase(prompt=recipe['prompt'], 
                              ingredients=recipe['ingredients'],
                              method=recipe['method']))

@router.post('/edit', response_model=RecipeEditResponse,
                responses={400: {"error": ErrorResponse}}
            )
async def generate(prompt: RecipeEditRequest):
    recipe = ai_edit(prompt.recipe, prompt.prompt)

    if type(recipe) == Exception :
        raise HTTPException(status_code=400, detail=str(recipe))

    return(RecipeEditResponse(title=prompt.title,prompt=recipe['prompt'],
                              ingredients=recipe['ingredients'],
                              method=recipe['method']))



