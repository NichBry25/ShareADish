from pymongo import MongoClient
from dotenv import load_dotenv
import os 

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

def ping_db():
    try:
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ping')
        print("MongoDB connection: Successful")
    except Exception as e:
        print(f"MongoDB connection: Failed - {e}")

if __name__ == "__main__":
    ping_db()
