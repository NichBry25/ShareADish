# Handles user CRUD
from ..core import hash_password, verify_password
from pymongo.errors import DuplicateKeyError
from ..database import user_db
from ..schemas import UserCreate

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
    user = user_db.find_one({"username": username})
    if user and verify_password(password, user["password"]):
        return True
    return False