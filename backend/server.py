from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# MongoDB connection - USING YOUR EXISTING ATLAS CLUSTER
MONGODB_URL = "mongodb+srv://tadiwamwenje00_db_user:RPvXEHmqSU4d12V6@aximoixcluster.yhr0vt9.mongodb.net/?retryWrites=true&w=majority&appName=aximoixcluster"
DB_NAME = "aximoix"

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]

app = FastAPI()

# Enable CORS for GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://tadmwenje.github.io",
        "https://tadmwenje.github.io/AximoIX-website-main"
    ],
    allow_credentials=True,
    allow_methods=["*"],
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
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/company")
async def get_company():
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
    return [
        {
            "id": "1",
            "title": "ICT Solutions",
            "description": "Technology solutions for businesses - infrastructure, networking, and digital transformation services.",
            "icon": "Monitor",
            "features": ["Network Infrastructure", "Cloud Solutions", "Digital Transformation", "IT Consulting"],
            "is_active": True
        },
        {
            "id": "2",
            "title": "AI Solutions",
            "description": "Artificial intelligence-powered solutions to automate processes and enhance decision-making.",
            "icon": "Brain",
            "features": ["Machine Learning", "Predictive Analytics", "Process Automation", "AI Consulting"],
            "is_active": True
        }
    ]

@app.get("/api/health")
async def health_check():
    try:
        # Test MongoDB connection
        await client.admin.command('ping')
        return {
            "status": "healthy", 
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected", 
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)