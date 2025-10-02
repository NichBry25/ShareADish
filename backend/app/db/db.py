from pymongo import MongoClient
from fastapi import Depends
from dotenv import load_dotenv
import os 

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

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
