from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid
import json

# MongoDB connection
MONGODB_URL = "mongodb+srv://tadiwamwenje00_db_user:RPvXEHmqSU4d12V6@aximoixcluster.yhr0vt9.mongodb.net/?retryWrites=true&w=majority&appName=aximoixcluster"
DB_NAME = "aximoix"

try:
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    # Create a mock db object to prevent crashes
    class MockDB:
        async def find_one(self, *args, **kwargs):
            return None
        async def find(self, *args, **kwargs):
            return []
        async def insert_one(self, *args, **kwargs):
            class Result:
                inserted_id = "mock_id"
            return Result()
        async def count_documents(self, *args, **kwargs):
            return 0
        async def list_collection_names(self):
            return []
    
    db = MockDB()

app = FastAPI()

# FIXED CORS - More specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "https://tadmwenje.github.io",
        "https://tadmwenje.github.io/AximoIX-website-main",
        "*"  # Allow all for testing
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    service_interest: Optional[str] = None
    message: str

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

@app.post("/api/contact")
async def submit_contact(contact: ContactForm):
    try:
        print(f"📧 Received contact from: {contact.name} ({contact.email})")
        
        contact_data = contact.dict()
        contact_data["id"] = str(uuid.uuid4())
        contact_data["created_at"] = datetime.utcnow()
        contact_data["status"] = "new"
        
        # Save to MongoDB
        result = await db.contacts.insert_one(contact_data)
        
        print(f"✅ Contact saved with ID: {contact_data['id']}")
        
        return {
            "success": True,
            "message": "Thank you! Your message has been sent successfully.",
            "id": contact_data["id"]
        }
        
    except Exception as e:
        print(f"❌ Error saving contact: {e}")
        # Return error response instead of raising exception
        return {
            "success": False,
            "error": f"Failed to save contact: {str(e)}"
        }

@app.get("/api/company")
async def get_company():
    try:
        # Try to get from database first
        company = await db.company.find_one({"id": "aximoix-company"})
        if company:
            return company
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
    services_data = [
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
    
    try:
        # Try to get from database first
        db_services = await db.services.find({"is_active": True}).to_list(100)
        if db_services:
            return db_services
    except Exception as e:
        print(f"❌ Error fetching services from DB: {e}")
    
    # Return static data as fallback
    return services_data

@app.get("/api/services/{service_id}")
async def get_service(service_id: str):
    try:
        # Try to get from database first
        service = await db.services.find_one({"id": service_id})
        if service:
            return service
    except Exception as e:
        print(f"❌ Error fetching service from DB: {e}")
    
    # Fallback to static data
    services_data = await get_services()
    for service in services_data:
        if service["id"] == service_id:
            return service
    
    raise HTTPException(status_code=404, detail="Service not found")

@app.get("/api/health")
async def health_check():
    try:
        # Test MongoDB connection
        await client.admin.command('ping')
        
        # Check if collections exist
        collections = await db.list_collection_names()
        
        return {
            "status": "healthy", 
            "database": "connected",
            "collections": collections,
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
        await client.admin.command('ping')
        collections = await db.list_collection_names()
        
        # Check contacts collection
        contact_count = await db.contacts.count_documents({})
        
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
        collections = []
        contact_count = 0
    
    return {
        "backend": "running",
        "database": db_status,
        "collections": collections,
        "contact_submissions": contact_count,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)