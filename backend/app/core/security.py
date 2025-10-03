from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import os

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "changelater")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")

# --- Password Hashing and Verification ---
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

# --- JWT Token Creation and Verification ---
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Generates a JWT access token with an expiration time.
    Args:
        data (dict): The payload data to encode into the JWT.
        expires_delta (timedelta | None, optional): The time duration until the token expires. 
            If not provided, defaults to 30 minutes.
    Returns:
        str: The encoded JWT access token as a string.
    """

    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt 

def decode_access_token(token: str):
    """
    Decodes a JWT access token and returns its payload.
    Args:
        token (str): The JWT access token to decode.
    Returns:
        dict or None: The decoded payload if the token is valid, otherwise None.
    """

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

if __name__ == "__main__":
    print(hash_password("mysecretpassword"))
    print(verify_password("mysecretpassword", hash_password("mysecretpassword")))