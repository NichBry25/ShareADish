# Handles user CRUD
from ..core import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme, decode_access_token
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException, status, Depends
from datetime import timedelta
from ..database import user_db
from ..schemas import UserCreate

def get_user(username: str):
    user = user_db.find_one({"username": username})
    if user:
        return {"username": user["username"], "password": user["password"]}
    return None

def register_user(user_data: UserCreate):
    """
    Registers a new user in the database after hashing the password.
    Args:
        user_data (UserCreate): User data containing username and password.
        Returns:
        tuple: (user_id, username) if successful, (None, "Username already exists") if username is taken.
    
    Validates that the username is unique.
    If the username already exists, it returns None and an error message.
    """
    hashed_pw = hash_password(user_data.password)
    user_doc = {
        "username": user_data.username,
        "password": hashed_pw
    }
    try:
        result = user_db.insert_one(user_doc)
        return str(result.inserted_id), user_data.username
    except DuplicateKeyError:
        return None, "Username already exists"

def login_user(username: str, password: str):
    user = get_user(username)

    # If user doesn't exist
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Verify password (Argon2)
    if not verify_password(password, user["password"]):  # If password is incorrect
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    ) # Payload is username

    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": payload.get("sub")}


