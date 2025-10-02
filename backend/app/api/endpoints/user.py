from fastapi import APIRouter

router = APIRouter(prefix="/user",
                   tags=["user"])

@router.get("/")
def test():
    return [{"str":"success"}]