from fastapi import APIRouter, HTTPException
from ...schemas import UserCreate, UserResponse, ErrorResponse
from ...services import register_user, login_user

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

@router.get("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def login_route(username: str, password: str):
    is_logged_in = login_user(username, password)
    if is_logged_in:
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid username or password")
