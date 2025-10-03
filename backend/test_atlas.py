import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

def test_atlas_connection():
    try:
        # Your Atlas connection string
        connection_string = "mongodb+srv://tadiwamwenje00_db_user:RPvXEHmqSU4d12V6@aximoixcluster.yhr0vt9.mongodb.net/?retryWrites=true&w=majority&appName=aximoixcluster"
        
        client = pymongo.MongoClient(connection_string)
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # List databases
        print("📊 Available databases:", client.list_database_names())
        
        # Test your specific database
        db = client['aximoix']
        print("📋 Collections in aximoix:", db.list_collection_names())
        
        return True
        
    except Exception as e:
        print(f"❌ MongoDB Atlas connection failed: {e}")
        return False

if __name__ == "__main__":
    test_atlas_connection()