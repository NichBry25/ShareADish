from pydantic import BaseModel

# schema for errors
class ErrorResponse(BaseModel):
    detail: str