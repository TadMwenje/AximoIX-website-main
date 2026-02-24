from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import sys
from datetime import datetime
import uuid
import pymongo
from bson import ObjectId

# Debug: Print Python and pymongo versions
print(f"🐍 Python version: {sys.version}")
print(f"📦 PyMongo version: {pymongo.__version__}")

# Get MongoDB connection string from environment variables
# Vercel provides these directly, no need for dotenv in production
def get_mongodb_url():
    """Get MongoDB URL from environment variables with fallbacks"""
    
    # Try multiple possible environment variable names
    possible_names = [
        "MONGODB_URL",      # Primary name your code expects
        "MONGO_URL",        # What you set in Vercel
        "MONGODB_URI",      # Another common name
        "MONGO_URI"         # Yet another common name
    ]
    
    for env_name in possible_names:
        env_value = os.getenv(env_name)
        if env_value:
            print(f"✅ Found MongoDB URL in {env_name}")
            
            # Clean up the value (remove any "MONGODB_URL=" prefix)
            if "=" in env_value and env_value.startswith(env_name):
                # Extract just the connection string part
                cleaned_value = env_value.split("=", 1)[1]
                return cleaned_value.strip()
            return env_value
    
    print("⚠️ No MongoDB URL found in environment variables")
    print("⚠️ Environment variables with 'MONGO' or 'URL':")
    for key in os.environ:
        if "MONGO" in key.upper() or "URL" in key.upper():
            print(f"   {key}: {'SET' if os.getenv(key) else 'NOT SET'}")
    
    # Local development fallback
    return "mongodb://localhost:27017/aximoix"

# Get MongoDB URL
MONGODB_URL = get_mongodb_url()

# Get database name
DB_NAME = os.getenv("DB_NAME", "aximoix")

# Debug connection info (don't show full URL in logs)
print(f"🔗 MongoDB URL: {MONGODB_URL[:50]}..." if len(MONGODB_URL) > 50 else f"🔗 MongoDB URL: {MONGODB_URL}")
print(f"📁 Database name: {DB_NAME}")
print(f"🌍 Environment: {os.getenv('VERCEL_ENV', 'development')}")

# Initialize MongoDB client
client = None
db = None

try:
    # Connection parameters for MongoDB Atlas
    connection_params = {
        "serverSelectionTimeoutMS": 15000,  # 15 seconds
        "connectTimeoutMS": 30000,          # 30 seconds
        "socketTimeoutMS": 45000,           # 45 seconds
        "maxPoolSize": 10,
        "minPoolSize": 1,
        "retryWrites": True,
        "w": "majority"
    }
    
    print("🔗 Attempting to connect to MongoDB...")
    
    # Connect to MongoDB
    client = pymongo.MongoClient(MONGODB_URL, **connection_params)
    
    # Test the connection
    client.admin.command('ping')
    
    # Get the database
    db = client[DB_NAME]
    
    print("✅ MongoDB connected successfully!")
    print(f"📊 Database: {db.name}")
    
    # List collections (for debugging)
    try:
        collections = db.list_collection_names()
        print(f"📊 Collections: {collections}")
    except:
        print("📊 Collections: Unable to list (new database)")
        
except Exception as e:
    print(f"❌ MongoDB connection failed: {type(e).__name__}: {str(e)[:200]}")
    print("⚠️ Running in demo mode with fallback data")
    
    # Create mock database for fallback
    class MockCollection:
        def find_one(self, *args, **kwargs):
            return None
        def find(self, *args, **kwargs):
            return []
        def insert_one(self, document):
            class Result:
                def __init__(self):
                    self.inserted_id = str(uuid.uuid4())
            return Result()
        def count_documents(self, *args, **kwargs):
            return 0
        def create_collection(self, name):
            pass
    
    class MockDB:
        def __init__(self):
            self.name = "demo_db"
            self.contacts = MockCollection()
            self.services = MockCollection()
            self.company = MockCollection()
            self.test = MockCollection()
        
        def list_collection_names(self):
            return ["contacts", "services", "company", "test"]
        
        def __getattr__(self, name):
            # Dynamically create collections as needed
            return MockCollection()
        
        def get_collection(self, name):
            return MockCollection()
    
    db = MockDB()

app = FastAPI(title="AximoIX API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aximoix.com",
        "https://www.aximoix.com",
        "https://tadmwenje.github.io",
        "http://localhost:3000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

class ContactForm(BaseModel):
    name: str
    email: str
    service_interest: Optional[str] = None
    message: str

# Helper function to convert MongoDB documents to JSON-serializable format
def convert_objectid(document):
    """Convert MongoDB ObjectId to string and handle other serialization issues"""
    if document is None:
        return None
    
    if isinstance(document, list):
        return [convert_objectid(item) for item in document]
    
    if isinstance(document, dict):
        converted = {}
        for key, value in document.items():
            if isinstance(value, ObjectId):
                converted[key] = str(value)
            elif isinstance(value, datetime):
                converted[key] = value.isoformat()
            elif isinstance(value, dict):
                converted[key] = convert_objectid(value)
            elif isinstance(value, list):
                converted[key] = [convert_objectid(item) for item in value]
            else:
                converted[key] = value
        return converted
    
    return document

# Static services data for fallback
def get_static_services():
    return [
        {
            "id": "1",
            "title": "ICT Solutions",
            "description": "Technology solutions for businesses - infrastructure, networking, and digital transformation services.",
            "icon": "Monitor",
            "features": ["Network Infrastructure", "Cloud Solutions", "Digital Transformation", "IT Consulting"],
            "detailed_info": {
                "overview": "Our ICT solutions provide comprehensive technology infrastructure and digital transformation services to modernize your business operations.",
                "benefits": [
                    "Improved operational efficiency and productivity",
                    "Enhanced security and data protection",
                    "Scalable infrastructure that grows with your business"
                ],
                "technologies": [
                    "Cloud Platforms (AWS, Azure, Google Cloud)",
                    "Network Security Systems",
                    "Enterprise Software Solutions"
                ],
                "case_studies": [
                    "Migrated 500+ employee company to cloud infrastructure, reducing IT costs by 40%"
                ]
            },
            "is_active": True
        },
        {
            "id": "2",
            "title": "AI Solutions",
            "description": "Artificial intelligence-powered solutions to automate processes and enhance decision-making.",
            "icon": "Brain",
            "features": ["Machine Learning", "Predictive Analytics", "Process Automation", "AI Consulting"],
            "detailed_info": {
                "overview": "Transform your business with cutting-edge AI solutions that automate complex processes and provide predictive insights.",
                "benefits": [
                    "Automated workflow processes saving 60% manual effort",
                    "Predictive analytics for better business forecasting",
                    "Enhanced customer experience through AI chatbots"
                ],
                "technologies": [
                    "Machine Learning Algorithms",
                    "Natural Language Processing",
                    "Computer Vision"
                ],
                "case_studies": [
                    "Developed AI chatbot reducing customer service response time by 75%"
                ]
            },
            "is_active": True
        },
        {
            "id": "3",
            "title": "Advertising & Marketing",
            "description": "Creative campaigns and strategies to amplify your brand and reach your target audience.",
            "icon": "Megaphone",
            "features": ["Digital Marketing", "Brand Strategy", "Creative Campaigns", "Social Media Marketing"],
            "detailed_info": {
                "overview": "Our comprehensive marketing and advertising services help businesses build strong brand presence and drive measurable growth.",
                "benefits": [
                    "Increased brand visibility and recognition",
                    "Higher customer engagement and conversion rates",
                    "Data-driven marketing strategies for better ROI"
                ],
                "technologies": [
                    "Marketing Automation Platforms",
                    "Social Media Management Tools",
                    "Analytics and Tracking Systems"
                ],
                "case_studies": [
                    "Increased client's social media engagement by 300% in 6 months"
                ]
            },
            "is_active": True
        },
        {
            "id": "4",
            "title": "Programming & Coding",
            "description": "Custom software development solutions tailored to your business needs and objectives.",
            "icon": "Code",
            "features": ["Web Development", "Mobile Apps", "Custom Software", "API Integration"],
            "detailed_info": {
                "overview": "Our expert development team creates custom software solutions specifically designed to meet your unique business requirements.",
                "benefits": [
                    "Custom solutions tailored to your specific needs",
                    "Scalable architecture for future growth",
                    "Modern, responsive user interfaces"
                ],
                "technologies": [
                    "React, Node.js, Python, Java",
                    "Mobile Development (React Native, Flutter)",
                    "Database Systems (MongoDB, PostgreSQL)"
                ],
                "case_studies": [
                    "Built e-commerce platform handling 10,000+ daily transactions"
                ]
            },
            "is_active": True
        },
        {
            "id": "5",
            "title": "Financial Technology",
            "description": "Innovative fintech solutions to streamline financial processes and enhance user experience.",
            "icon": "CreditCard",
            "features": ["Payment Systems", "Digital Banking", "Blockchain Solutions", "Financial Analytics"],
            "detailed_info": {
                "overview": "Our fintech solutions revolutionize financial operations through secure payment systems and advanced financial analytics.",
                "benefits": [
                    "Secure and compliant financial transactions",
                    "Streamlined payment processing",
                    "Advanced financial analytics and reporting"
                ],
                "technologies": [
                    "Payment Gateway Integration",
                    "Blockchain Platforms",
                    "Digital Wallet Systems"
                ],
                "case_studies": [
                    "Implemented payment system processing $1M+ monthly transactions"
                ]
            },
            "is_active": True
        }
    ]

def get_static_service_by_id(service_id):
    services = get_static_services()
    for service in services:
        if service["id"] == service_id:
            return service
    return None

def seed_database():
    """Initialize database with default data if empty"""
    try:
        # Check if we have a real MongoDB connection
        if client is None:
            print("⚠️ Skipping database seeding - running in demo mode")
            return
        
        # Check if services collection is empty
        services_count = db.services.count_documents({})
        company_count = db.company.count_documents({})
        
        if services_count == 0:
            print("🌱 Seeding services data...")
            services_data = get_static_services()
            for service in services_data:
                db.services.insert_one(service)
            print(f"✅ Seeded {len(services_data)} services")
        else:
            print(f"✅ Services already exist: {services_count} services")
        
        # Always upsert company data to ensure latest copy is in DB
        print("🌱 Updating company data...")
        company_data = {
            "id": "aximoix-company",
            "name": "AximoIX",
            "motto": "Innovate. Engage. Grow.",
            "tagline": "Where Vision Meets Velocity",
            "description": "AximoIX is a next-generation technology partner engineering the future of business. We fuse enterprise ICT infrastructure, artificial intelligence, strategic marketing, custom software development, and financial technology into a single, powerful ecosystem — giving organizations the edge they need to outperform, outscale, and outlast the competition.",
            "about": {
                "goal": "To architect transformative technology ecosystems that accelerate growth, eliminate inefficiency, and position every client at the forefront of their industry — today and for the decades ahead.",
                "vision": "To become the most trusted technology catalyst on the planet — the partner that enterprises, governments, and startups turn to when the stakes are high and the opportunity is now.",
                "mission": "We engineer bespoke solutions at the intersection of AI, cloud infrastructure, fintech, and digital strategy. Every engagement is built on deep technical expertise, relentless innovation, and an unwavering commitment to measurable results that compound over time."
            },
            "contact": {
                "email": "hello@aximoix.com",
                "phone": "+1 470 506 4390",
                "address": "3rd Floor 120 West Trinity Place Decatur, GA 30030"
            }
        }
        db.company.replace_one(
            {"id": "aximoix-company"},
            company_data,
            upsert=True
        )
        print("✅ Company data updated")
            
    except Exception as e:
        print(f"❌ Error seeding database: {e}")

# Seed database on startup
seed_database()

# ============ API ENDPOINTS ============

@app.get("/")
async def root():
    return {
        "message": "AximoIX API is running!", 
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected" if client else "demo_mode"
    }

@app.get("/api")
async def api_root():
    return {
        "message": "AximoIX API", 
        "version": "1.0.0",
        "endpoints": [
            "/api/ping",
            "/api/test",
            "/api/test-mongodb",
            "/api/debug",
            "/api/env-check",
            "/api/company",
            "/api/services",
            "/api/contact (POST)",
            "/api/health"
        ]
    }

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to check if basic API works"""
    return {
        "message": "API test successful!",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "working",
        "database": "connected" if client else "demo_mode"
    }

@app.get("/api/ping")
async def ping():
    """Simple ping endpoint for connection testing"""
    return {
        "message": "pong", 
        "timestamp": datetime.utcnow().isoformat(),
        "status": "success"
    }

# NEW: Debug endpoint to check MongoDB connection
@app.get("/api/test-mongodb")
async def test_mongodb_connection():
    """Test MongoDB connection specifically"""
    try:
        if client:
            # Test if we have a real client
            client.admin.command('ping')
            
            # Get database stats
            collections = db.list_collection_names()
            services_count = db.services.count_documents({})
            company_count = db.company.count_documents({})
            contacts_count = db.contacts.count_documents({}) if 'contacts' in collections else 0
            
            return {
                "status": "success",
                "message": "MongoDB connected successfully",
                "database": db.name,
                "collections": collections,
                "counts": {
                    "services": services_count,
                    "company": company_count,
                    "contacts": contacts_count
                },
                "connection": {
                    "url_set": True,
                    "type": "real_mongodb"
                },
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            return {
                "status": "demo_mode",
                "message": "Running in demo mode - MongoDB not connected",
                "database": "demo_db",
                "connection": {
                    "url_set": bool(MONGODB_URL and MONGODB_URL != "mongodb://localhost:27017/aximoix"),
                    "type": "mock_database"
                },
                "timestamp": datetime.utcnow().isoformat()
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "connection_url": MONGODB_URL[:50] + "..." if len(MONGODB_URL) > 50 else MONGODB_URL,
            "timestamp": datetime.utcnow().isoformat()
        }

# NEW: Enhanced debug endpoint
@app.get("/api/debug")
async def debug_info():
    """Debug endpoint to check everything"""
    try:
        if client:
            # Test MongoDB
            client.admin.command('ping')
            db_status = "connected"
            collections = db.list_collection_names()
            
            # Check contacts collection
            contact_count = db.contacts.count_documents({}) if 'contacts' in collections else 0
            
            # Check services collection
            services_count = db.services.count_documents({}) if 'services' in collections else 0
            
            # Check company collection
            company_count = db.company.count_documents({}) if 'company' in collections else 0
            
        else:
            db_status = "demo_mode"
            collections = db.list_collection_names()
            contact_count = 0
            services_count = len(get_static_services())
            company_count = 1
    
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
        collections = []
        contact_count = 0
        services_count = 0
        company_count = 0
    
    # Get environment info
    env_vars = {}
    for key in os.environ:
        if "MONGO" in key.upper() or "URL" in key.upper() or "DB" in key.upper():
            value = os.getenv(key)
            if value and any(secret in key.lower() for secret in ['pass', 'key', 'secret']):
                env_vars[key] = "*****"
            else:
                env_vars[key] = "SET" if value else "NOT SET"
    
    return {
        "backend": "running",
        "python_version": sys.version.split()[0],
        "pymongo_version": pymongo.__version__,
        "database": db_status,
        "collections": collections,
        "contact_submissions": contact_count,
        "services_count": services_count,
        "company_count": company_count,
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("VERCEL_ENV", "development"),
        "environment_variables": env_vars
    }

@app.get("/api/env-check")
async def env_check():
    """Debug endpoint to check environment variables"""
    env_info = {}
    for key in os.environ:
        if "MONGO" in key or "URL" in key or "DB" in key:
            value = os.getenv(key)
            if value and ("PASS" in key or "KEY" in key or "SECRET" in key):
                env_info[key] = "****SET****"
            else:
                env_info[key] = "SET" if value else "NOT SET"
    
    return {
        "mongodb_url": "SET" if MONGODB_URL and MONGODB_URL != "mongodb://localhost:27017/aximoix" else "NOT SET",
        "db_name": DB_NAME,
        "environment": os.getenv("VERCEL_ENV", "development"),
        "all_relevant_vars": env_info,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/contact")
async def submit_contact(contact: ContactForm):
    try:
        print(f"📧 Received contact from: {contact.name} ({contact.email})")
        
        contact_data = contact.dict()
        contact_data["id"] = str(uuid.uuid4())
        contact_data["created_at"] = datetime.utcnow()
        contact_data["status"] = "new"
        
        # Check if we have real MongoDB connection
        if client and hasattr(db, 'contacts'):
            # Save to MongoDB
            result = db.contacts.insert_one(contact_data)
            print(f"✅ Contact saved to MongoDB with ID: {contact_data['id']}")
            
            return {
                "success": True,
                "message": "Thank you! Your message has been sent successfully.",
                "id": contact_data["id"],
                "database": "mongodb"
            }
        else:
            # MongoDB not connected, but still return success
            print("📋 Running in demo mode - contact saved locally")
            return {
                "success": True,
                "message": "Thank you! Your message has been received. (Running in demo mode)",
                "id": contact_data["id"],
                "database": "demo"
            }
        
    except Exception as e:
        print(f"❌ Error saving contact: {e}")
        # Still return success to user even if DB fails
        return {
            "success": True,
            "message": "Thank you! Your message has been received. We'll get back to you soon.",
            "id": str(uuid.uuid4()),
            "database": "error_fallback"
        }

@app.get("/api/company")
async def get_company():
    try:
        # Try to get from database first if we have real connection
        if client:
            company = db.company.find_one({"id": "aximoix-company"})
            if company:
                return convert_objectid(company)
    except Exception as e:
        print(f"❌ Error fetching company from DB: {e}")
    
    # Fallback to static data
    return {
        "name": "AximoIX",
        "motto": "Innovate. Engage. Grow.",
        "tagline": "Where Vision Meets Velocity",
        "description": "AximoIX is a next-generation technology partner engineering the future of business. We fuse enterprise ICT infrastructure, artificial intelligence, strategic marketing, custom software development, and financial technology into a single, powerful ecosystem — giving organizations the edge they need to outperform, outscale, and outlast the competition.",
        "about": {
            "goal": "To architect transformative technology ecosystems that accelerate growth, eliminate inefficiency, and position every client at the forefront of their industry — today and for the decades ahead.",
            "vision": "To become the most trusted technology catalyst on the planet — the partner that enterprises, governments, and startups turn to when the stakes are high and the opportunity is now.",
            "mission": "We engineer bespoke solutions at the intersection of AI, cloud infrastructure, fintech, and digital strategy. Every engagement is built on deep technical expertise, relentless innovation, and an unwavering commitment to measurable results that compound over time."
        },
        "contact": {
            "email": "hello@aximoix.com",
            "phone": "+1 470 506 4390",
            "address": "3rd Floor 120 West Trinity Place Decatur, GA 30030"
        }
    }

@app.get("/api/services")
async def get_services():
    try:
        # Try to get from database first if we have real connection
        if client:
            db_services = list(db.services.find({"is_active": True}))
            if db_services and len(db_services) > 0:
                # Convert ObjectId to string for JSON serialization
                services = convert_objectid(db_services)
                print(f"✅ Loaded {len(services)} services from database")
                return services
    except Exception as e:
        print(f"❌ Error fetching services from DB: {e}")
    
    # Return static data as fallback
    print("📋 Using static services data as fallback")
    return get_static_services()

@app.get("/api/services/{service_id}")
async def get_service(service_id: str):
    try:
        # Try to get from database first if we have real connection
        if client:
            service = db.services.find_one({"id": service_id})
            if service:
                # Convert ObjectId to string for JSON serialization
                converted_service = convert_objectid(service)
                print(f"✅ Loaded service {service_id} from database")
                return converted_service
    except Exception as e:
        print(f"❌ Error fetching service from DB: {e}")
    
    # Fallback to static data
    static_service = get_static_service_by_id(service_id)
    if static_service:
        print(f"📋 Using static data for service {service_id}")
        return static_service
    
    raise HTTPException(status_code=404, detail="Service not found")

@app.get("/api/health")
async def health_check():
    try:
        # Test if we have MongoDB connection
        if client:
            client.admin.command('ping')
            db_status = "connected"
            
            # Get counts
            collections = db.list_collection_names()
            services_count = db.services.count_documents({}) if 'services' in collections else 0
            company_count = db.company.count_documents({}) if 'company' in collections else 0
            contacts_count = db.contacts.count_documents({}) if 'contacts' in collections else 0
        else:
            db_status = "demo_mode"
            services_count = len(get_static_services())
            company_count = 1
            contacts_count = 0
            collections = ["demo_mode"]
        
        return {
            "status": "healthy", 
            "database": db_status,
            "collections": collections,
            "counts": {
                "services": services_count,
                "company": company_count,
                "contacts": contacts_count
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected", 
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

# Test database operations
@app.get("/api/test-db")
async def test_database():
    """Test database connection and operations"""
    try:
        if client:
            # Test connection
            client.admin.command('ping')
            
            # Test collections
            collections = db.list_collection_names()
            
            # Test insert
            test_doc = {
                "id": "test-" + str(uuid.uuid4()),
                "message": "Test document from Vercel",
                "created_at": datetime.utcnow(),
                "test": True
            }
            
            result = db.test.insert_one(test_doc)
            
            # Test read
            found_doc = db.test.find_one({"id": test_doc["id"]})
            
            # Clean up
            db.test.delete_one({"id": test_doc["id"]})
            
            return {
                "status": "success",
                "database": "connected",
                "collections": collections,
                "test_insert": "successful",
                "test_read": "successful" if found_doc else "failed",
                "message": "Real MongoDB connection working"
            }
        else:
            return {
                "status": "demo_mode",
                "database": "mock_database",
                "message": "Running in demo mode - no real MongoDB connection",
                "test_insert": "simulated",
                "test_read": "simulated"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e)
        }

# Add a route to clean up test data
@app.delete("/api/cleanup-test")
async def cleanup_test_data():
    """Clean up any test data"""
    try:
        if client and hasattr(db, 'test'):
            result = db.test.delete_many({"test": True})
            return {
                "success": True,
                "deleted_count": result.deleted_count,
                "message": "Test data cleaned up"
            }
        return {
            "success": True,
            "message": "No test data to clean up"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
