from pymongo import MongoClient
import os 

MONGODB_URL = os.getenv("MONGODB_URL")

client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
shareadish = client.get_database("shareadish")

user_db = shareadish.get_collection("users")
recipe_db = shareadish.get_collection("recipes")

def print_url():
    print(f"MONGODB_URL: {MONGODB_URL}")

def ping_db():
    try:
        client.admin.command('ping')
        print("MongoDB connection: Successful")
    except Exception as e:
        print(f"MongoDB connection: Failed - {e}")
        
def get_session():
    return client

def close_session():
    client.close()

if __name__ == "__main__":
    ping_db()
    user_db.insert_one({"username": "testuser", "password": "testpass"})
