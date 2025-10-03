import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

try:
    client = pymongo.MongoClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
    db = client[os.environ.get('DB_NAME', 'aximoix')]
    
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB is running and accessible")
    
    # List databases
    print("📊 Available databases:", client.list_database_names())
    
    # List collections in aximoix database
    print("📋 Collections in aximoix:", db.list_collection_names())
    
    # Check if our specific collections exist and have data
    collections_to_check = ['contacts', 'services', 'company']
    for collection_name in collections_to_check:
        collection = db[collection_name]
        count = collection.count_documents({})
        print(f"📊 {collection_name}: {count} documents")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")