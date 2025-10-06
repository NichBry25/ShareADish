from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
import os
import cloudinary


'''
used to store stuffs like the paths, and env vars
'''
config_dir = Path(__file__).resolve().parent

class Settings(BaseSettings):
    # dataset
    DATA_DIR: Path = config_dir.parent/'data'

    FOUNDATIONAL_PATH: Path = DATA_DIR/'foundational.json'
    SRLEGACY_PATH: Path = DATA_DIR/'legacy.json'

    OPENAI_API_KEY: str
    CLOUDINARY_API_KEY: str

    MONGODB_URL:str

    # add stuff for mongo later

    class Config:
        env_file = str(config_dir.parent.parent / ".env")  
        env_file_encoding = 'utf-8'

settings = Settings()

cloudinary.config( 
    cloud_name = "dj9nb6usk", 
    api_key = "758954237145246", 
    api_secret = settings.CLOUDINARY_API_KEY, 
    secure=True
)