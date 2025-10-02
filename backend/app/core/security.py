from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password:str) -> str:
    """Hashes a password

    Args:
        password (str): unhashed_password

    Returns:
        str: hashed password
    """
    sha = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(sha)

def verify_password(plain_password:str, hashed_password: str) -> bool:
    """ Verifies a plain password against a hashed password retrieved using username."""
    sha = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    pwd_context.verify(sha, hashed_password)