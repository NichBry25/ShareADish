from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password:str) -> str:
    """Hashes a password

    Args:
        password (str): unhashed_password

    Returns:
        str: hashed password
    """
    return pwd_context.hash(password)

def verify_password(plain_password:str, hashed_password: str) -> bool:
    """ Verifies a plain password against a hashed password retrieved using username."""
    return pwd_context.verify(plain_password, hashed_password)