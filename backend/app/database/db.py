from pymongo import MongoClient
from dotenv import load_dotenv
import os 

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
shareadish = client.get_database("shareadish")

user_db = shareadish.get_collection("users")

def ping_db():
    try:
        client.admin.command('ping')
        print("MongoDB connection: Successful")
    except Exception as e:
        print(f"MongoDB connection: Failed - {e}")
        
def get_session():
    return client

if __name__ == "__main__":
    ping_db()
    user_db.insert_one({"username": "testuser", "password": "testpass"})
