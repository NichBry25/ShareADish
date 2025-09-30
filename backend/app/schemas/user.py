from pydantic import BaseModel

# Schema for creating a user
class UserCreate(BaseModel):
    username: str
    password: str

# Schema for returning user information
class UserRead(BaseModel):
    username: str

# Schema for retrieving user by ID
class UserByID(BaseModel):
    id: int


