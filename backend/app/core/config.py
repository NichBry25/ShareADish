from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pathlib import Path

'''
used to store stuffs like the paths, and env vars
'''

load_dotenv()

config_dir = Path(__file__).resolve().parent

class Settings(BaseSettings):
    # dataset
    DATA_DIR: Path = config_dir.parent/'data'

    FOUNDATIONAL_PATH: Path = DATA_DIR/'foundational.json'
    SRLEGACY_PATH: Path = DATA_DIR/'legacy.json'

    # add stuff for mongo later

settings = Settings()