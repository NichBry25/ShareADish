from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from ...schemas import UserCreate, UserResponse, ErrorResponse
from ...services import register_user, login_user, get_current_user

router = APIRouter(prefix="/user",
                   tags=["user"])

@router.post(
    "/",
    response_model=UserResponse,
    responses={400: {"model": ErrorResponse}},
)
async def register_route(user_data: UserCreate):
    id, username = register_user(user_data)

    if id is None:
        raise HTTPException(status_code=400, detail=username)

    return UserResponse(id=id, username=username)

@router.post("/login", response_model=dict, responses={401: {"model": ErrorResponse}})
async def login_route(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        return login_user(form_data.username, form_data.password)
    except HTTPException as e:
        raise e

@router.get("/me", response_model=dict, responses={401: {"model": ErrorResponse}})
async def me_route(current_user: dict = Depends(get_current_user)):
    return current_user