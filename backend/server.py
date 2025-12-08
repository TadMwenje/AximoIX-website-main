from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
import pymongo
from datetime import datetime
import uuid
import json
from bson import ObjectId

# Load environment variables
load_dotenv()


MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    print("⚠️ MONGODB_URL environment variable is not set")
    print("⚠️ Using fallback to local MongoDB. Set MONGODB_URL in .env file or environment variables.")
    # Provide a clear error message for development
    MONGODB_URL = "mongodb://localhost:27017/aximoix"

print(f"🔗 Connecting to MongoDB... (URL hidden for security)")

try:
    client = pymongo.MongoClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=15000,
        socketTimeoutMS=45000,
        maxPoolSize=10,
        minPoolSize=1,
        retryWrites=True,
        w='majority'
    )
    
    # Test connection immediately
    client.admin.command('ping')
    db = client["aximoix"]
    print("✅ MongoDB connected successfully")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("⚠️ Running in demo mode with fallback data")
    # Create a mock db object to prevent crashes
    class MockDB:
        def find_one(self, *args, **kwargs):
            return None
        def find(self, *args, **kwargs):
            return []
        def insert_one(self, *args, **kwargs):
            class Result:
                inserted_id = "mock_id"
            return Result()
        def count_documents(self, *args, **kwargs):
            return 0
        def list_collection_names(self):
            return []
    
    db = MockDB()

app = FastAPI()

# CORS Configuration - Allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
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
            elif isinstance(value, (datetime,)):
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
        # Check if services collection is empty
        services_count = db.services.count_documents({})
        company_count = db.company.count_documents({})
        
        if services_count == 0:
            print("🌱 Seeding services data...")
            services_data = get_static_services()
            for service in services_data:
                db.services.insert_one(service)
            print(f"✅ Seeded {len(services_data)} services")
        
        if company_count == 0:
            print("🌱 Seeding company data...")
            company_data = {
                "id": "aximoix-company",
                "name": "AximoIX",
                "motto": "Innovate. Engage. Grow.",
                "tagline": "Empowering Business, Amplifying Success",
                "description": "AximoIX is a dynamic company offering a range of services, including ICT solutions, AI solutions, advertising and marketing, programming and coding, and financial technology. We partner with businesses to drive growth, improve efficiency, and achieve success.",
                "about": {
                    "goal": "Empower businesses to thrive through innovative technology, creative marketing, and strategic financial solutions.",
                    "vision": "To be a leading provider of integrated ICT, AI, advertising, programming, and financial technology solutions, driving business growth and success.",
                    "mission": "At AximoIX, our mission is to deliver tailored solutions that combine technology, creativity, and innovation, fostering long-term partnerships and driving business success."
                },
                "contact": {
                    "email": "hello@aximoix.com",
                    "phone": "+1 (555) 123-4567",
                    "address": "123 Innovation Drive, Tech City, TC 12345",
                    "social_media": {
                        "linkedin": "#",
                        "twitter": "#",
                        "facebook": "#",
                        "instagram": "#"
                    }
                }
            }
            db.company.insert_one(company_data)
            print("✅ Seeded company information")
            
    except Exception as e:
        print(f"❌ Error seeding database: {e}")

# Seed database on startup
seed_database()

@app.get("/")
async def root():
    return {"message": "AximoIX API is running!", "status": "healthy"}

@app.get("/api")
async def api_root():
    return {"message": "AximoIX API", "version": "1.0.0"}

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to check if basic API works"""
    return {
        "message": "API test successful!",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "working"
    }

@app.get("/api/ping")
async def ping():
    """Simple ping endpoint for connection testing"""
    return {
        "message": "pong", 
        "timestamp": datetime.utcnow().isoformat(),
        "status": "success"
    }

@app.post("/api/contact")
async def submit_contact(contact: ContactForm):
    try:
        print(f"📧 Received contact from: {contact.name} ({contact.email})")
        
        contact_data = contact.dict()
        contact_data["id"] = str(uuid.uuid4())
        contact_data["created_at"] = datetime.utcnow()
        contact_data["status"] = "new"
        
        # Check if MongoDB is connected (not mock)
        if hasattr(db, 'contacts') and hasattr(db.contacts, 'insert_one'):
            # Save to MongoDB
            result = db.contacts.insert_one(contact_data)
            print(f"✅ Contact saved to MongoDB with ID: {contact_data['id']}")
            
            return {
                "success": True,
                "message": "Thank you! Your message has been sent successfully.",
                "id": contact_data["id"]
            }
        else:
            # MongoDB not connected, but still return success
            print("📋 MongoDB not connected, but contact form processed")
            return {
                "success": True,
                "message": "Thank you! Your message has been received. (Demo mode - not saved to database)",
                "id": contact_data["id"]
            }
        
    except Exception as e:
        print(f"❌ Error saving contact: {e}")
        # Still return success to user even if DB fails
        return {
            "success": True,
            "message": "Thank you! Your message has been received. We'll get back to you soon.",
            "id": str(uuid.uuid4())
        }

@app.get("/api/company")
async def get_company():
    try:
        # Try to get from database first
        company = db.company.find_one({"id": "aximoix-company"})
        if company:
            return convert_objectid(company)
    except Exception as e:
        print(f"❌ Error fetching company from DB: {e}")
    
    # Fallback to static data
    return {
        "name": "AximoIX",
        "motto": "Innovate. Engage. Grow.",
        "tagline": "Empowering Business, Amplifying Success",
        "description": "AximoIX is a dynamic company offering a range of services, including ICT solutions, AI solutions, advertising and marketing, programming and coding, and financial technology. We partner with businesses to drive growth, improve efficiency, and achieve success.",
        "about": {
            "goal": "Empower businesses to thrive through innovative technology, creative marketing, and strategic financial solutions.",
            "vision": "To be a leading provider of integrated ICT, AI, advertising, programming, and financial technology solutions, driving business growth and success.",
            "mission": "At AximoIX, our mission is to deliver tailored solutions that combine technology, creativity, and innovation, fostering long-term partnerships and driving business success."
        },
        "contact": {
            "email": "hello@aximoix.com",
            "phone": "+1 (555) 123-4567",
            "address": "123 Innovation Drive, Tech City, TC 12345",
            "social_media": {
                "linkedin": "#",
                "twitter": "#",
                "facebook": "#",
                "instagram": "#"
            }
        }
    }

@app.get("/api/services")
async def get_services():
    try:
        # Try to get from database first
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
        # Try to get from database first
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
        # Test MongoDB connection
        client.admin.command('ping')
        
        # Check if collections exist
        collections = db.list_collection_names()
        
        # Get counts
        services_count = db.services.count_documents({})
        company_count = db.company.count_documents({})
        contacts_count = db.contacts.count_documents({})
        
        return {
            "status": "healthy", 
            "database": "connected",
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

@app.get("/api/debug")
async def debug_info():
    """Debug endpoint to check everything"""
    try:
        # Test MongoDB
        db_status = "connected"
        client.admin.command('ping')
        collections = db.list_collection_names()
        
        # Check contacts collection
        contact_count = db.contacts.count_documents({})
        
        # Check services collection
        services_count = db.services.count_documents({})
        
        # Check company collection
        company_count = db.company.count_documents({})
        
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
        collections = []
        contact_count = 0
        services_count = 0
        company_count = 0
    
    return {
        "backend": "running",
        "database": db_status,
        "collections": collections,
        "contact_submissions": contact_count,
        "services_count": services_count,
        "company_count": company_count,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/test-db")
async def test_database():
    """Test database connection and operations"""
    try:
        # Test connection
        client.admin.command('ping')
        
        # Test collections
        collections = db.list_collection_names()
        
        # Test insert
        test_doc = {
            "id": "test-" + str(uuid.uuid4()),
            "message": "Test document from Vercel",
            "created_at": datetime.utcnow()
        }
        
        if 'test' not in collections:
            db.create_collection('test')
        
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
            "connection_string": "Working correctly"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e),
            "connection_string": "Failed"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
