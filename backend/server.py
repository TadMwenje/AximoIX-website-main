from fastapi import FastAPI, APIRouter, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from pathlib import Path
from typing import List
from datetime import datetime
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Enhanced MongoDB connection with Atlas support
try:
    # Use Atlas connection string from environment, fallback to local
    mongo_url = os.environ.get('MONGO_URL')
    
    if not mongo_url:
        # Fallback to local MongoDB
        mongo_url = 'mongodb://localhost:27017'
        print("⚠️  Using local MongoDB - MONGO_URL not set in environment")
    else:
        print("🔗 Using MongoDB Atlas connection")
    
    db_name = os.environ.get('DB_NAME', 'aximoix')
    
    # Configure motor for Atlas connection
    client = AsyncIOMotorClient(
        mongo_url,
        # Atlas connection optimizations
        maxPoolSize=50,
        minPoolSize=10,
        maxIdleTimeMS=30000,
        socketTimeoutMS=30000,
        connectTimeoutMS=30000,
        serverSelectionTimeoutMS=30000
    )
    
    db = client[db_name]
    
    # Test connection immediately
    async def test_connection():
        try:
            await client.admin.command('ping')
            print(f"✅ MongoDB connection successful")
            print(f"📊 Using database: {db_name}")
            return True
        except Exception as e:
            print(f"❌ MongoDB connection test failed: {e}")
            return False
    
    # We'll test in the lifespan manager
    
except Exception as e:
    print(f"❌ MongoDB connection setup failed: {e}")
    raise

# Import after db is defined
from database import seed_database
from models import (
    ContactSubmission, ContactSubmissionCreate, ContactSubmissionUpdate,
    Service, ServiceCreate, ServiceUpdate,
    CompanyInfo, CompanyInfoUpdate
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting AximoIX API...")
    
    # Test MongoDB connection
    connection_ok = await test_connection()
    if not connection_ok:
        raise RuntimeError("MongoDB connection failed on startup")
    
    try:
        await seed_database(db)
        print("✅ Database seeded successfully")
    except Exception as e:
        print(f"❌ Database seeding failed: {e}")
        # Don't raise here, allow app to start for testing
    
    yield  # The app runs here
    
    # Shutdown
    print("🛑 Shutting down AximoIX API...")
    client.close()
    print("✅ MongoDB connection closed")

# Create the main app with lifespan
app = FastAPI(
    title="AximoIX API", 
    version="1.0.0", 
    lifespan=lifespan,
    description="AximoIX Backend API with MongoDB Atlas",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

api_router = APIRouter(prefix="/api")

# CORS middleware - update with your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"  # Remove this in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint with DB status
@api_router.get("/")
async def root():
    try:
        # Test DB connection
        await client.admin.command('ping')
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    return {
        "message": "AximoIX API is running", 
        "status": "healthy",
        "database": db_status,
        "version": "1.0.0"
    }

# Enhanced contact endpoint with better logging
@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(contact_data: ContactSubmissionCreate):
    """Submit a new contact form"""
    try:
        print(f"📧 Received contact form submission from: {contact_data.email}")
        
        # Create contact submission with generated ID and timestamp
        contact_dict = contact_data.dict()
        contact_dict["id"] = str(uuid.uuid4())
        contact_dict["created_at"] = datetime.utcnow()
        contact_dict["status"] = "new"
        
        # Insert into MongoDB
        result = await db.contacts.insert_one(contact_dict)
        
        if result.inserted_id:
            print(f"✅ Contact submission saved to database with ID: {contact_dict['id']}")
            
            # Verify the data was saved by retrieving it
            saved_contact = await db.contacts.find_one({"id": contact_dict["id"]})
            if saved_contact:
                print(f"✅ Verified contact saved successfully")
                # Log the saved contact details (without sensitive info)
                print(f"📝 Saved contact: {saved_contact['name']} - {saved_contact['email']}")
            else:
                print("⚠️  Contact saved but verification query failed")
                
            return ContactSubmission(**contact_dict)
        else:
            print("❌ Failed to insert contact submission - no inserted_id returned")
            raise HTTPException(status_code=500, detail="Failed to create contact submission")
            
    except Exception as e:
        logging.error(f"Error creating contact submission: {str(e)}")
        print(f"❌ Detailed error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Add a debug endpoint to check collections
@api_router.get("/debug/collections")
async def debug_collections():
    """Debug endpoint to check collections and counts"""
    try:
        collections = await db.list_collection_names()
        result = {}
        
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            result[collection_name] = count
            
        return {
            "collections": result,
            "database": db.name,
            "connection": "active"
        }
    except Exception as e:
        return {"error": str(e), "connection": "failed"}

# Keep your existing endpoints (services, company, etc.)
@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    """Get all contact submissions (admin endpoint)"""
    try:
        submissions = await db.contacts.find().sort("created_at", -1).to_list(1000)
        print(f"📋 Found {len(submissions)} contact submissions")
        return [ContactSubmission(**submission) for submission in submissions]
    except Exception as e:
        logging.error(f"Error fetching contact submissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/services", response_model=List[Service])
async def get_services():
    """Get all active services"""
    try:
        services = await db.services.find({"is_active": True}).to_list(100)
        return [Service(**service) for service in services]
    except Exception as e:
        logging.error(f"Error fetching services: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service_details(service_id: str):
    """Get detailed service information"""
    try:
        service = await db.services.find_one({"id": service_id, "is_active": True})
        
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        return Service(**service)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching service details: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/company", response_model=CompanyInfo)
async def get_company_info():
    """Get company information"""
    try:
        company = await db.company.find_one({"id": "aximoix-company"})
        
        if not company:
            raise HTTPException(status_code=404, detail="Company information not found")
        
        return CompanyInfo(**company)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching company info: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add this at the VERY END of server.py
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Uvicorn server on http://localhost:8000")
    print("📊 API Documentation available at http://localhost:8000/api/docs")
    uvicorn.run(
        "server:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )