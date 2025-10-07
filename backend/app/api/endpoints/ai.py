from fastapi import APIRouter, HTTPException
from ...schemas import RecipeCreationBase, RecipeEditRequest, GenerateRequest,RecipeEditResponse, ErrorResponse
from ...services.inference import generate,ai_edit

router = APIRouter(prefix="/ai",
                   tags=["ai"])


@router.post('/generate', response_model=RecipeCreationBase,
                responses={400: {"model": ErrorResponse}}
            )
async def generate_ai(request: GenerateRequest):
    recipe = generate(request.prompt)
    print("AI Recipe Output:", recipe)
    if 'error' in recipe.keys():
        if recipe['error'] == 'rate limited':
            raise HTTPException(status_code=429, detail="Rate Limited")
        raise HTTPException(status_code=400, detail=recipe['error'])

    return(RecipeCreationBase(prompt=recipe['prompt'], 
                              ingredients=recipe['ingredients'],
                              steps=recipe['method'],
                              nutrients=recipe['nutrients']))

@router.post('/edit', response_model=RecipeEditResponse,
                responses={400: {"model": ErrorResponse}}
            )
async def edit(prompt: RecipeEditRequest):
    recipe = await ai_edit(prompt.recipe, prompt.prompt)

    if type(recipe) == Exception :
        raise HTTPException(status_code=400, detail=str(recipe))

    return(RecipeEditResponse(title=prompt.title,prompt=recipe['prompt'],
                              ingredients=recipe['ingredients'],
                              nutrients=recipe['nutrients'],
                              steps=recipe['method']))



