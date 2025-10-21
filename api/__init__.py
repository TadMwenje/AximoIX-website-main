import azure.functions as func
import json
from datetime import datetime
import uuid

app = func.FunctionApp()

@app.route(route="api", methods=["GET"])
def api_root(req: func.HttpRequest) -> func.HttpResponse:
    """Root API endpoint"""
    response_data = {
        "message": "AximoIX API is running", 
        "status": "healthy",
        "version": "1.0.0"
    }
    
    return func.HttpResponse(
        json.dumps(response_data),
        status_code=200,
        headers={"Content-Type": "application/json"}
    )

@app.route(route="api/services", methods=["GET"])
def get_services(req: func.HttpRequest) -> func.HttpResponse:
    """Get all services"""
    services = [
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
        },
        {
            "id": "3",
            "title": "Advertising & Marketing",
            "description": "Creative campaigns and strategies to amplify your brand and reach your target audience.",
            "icon": "Megaphone",
            "features": ["Digital Marketing", "Brand Strategy", "Creative Campaigns", "Social Media Marketing"],
            "is_active": True
        },
        {
            "id": "4",
            "title": "Programming & Coding",
            "description": "Custom software development solutions tailored to your business needs and objectives.",
            "icon": "Code",
            "features": ["Web Development", "Mobile Apps", "Custom Software", "API Integration"],
            "is_active": True
        },
        {
            "id": "5",
            "title": "Financial Technology",
            "description": "Innovative fintech solutions to streamline financial processes and enhance user experience.",
            "icon": "CreditCard",
            "features": ["Payment Systems", "Digital Banking", "Blockchain Solutions", "Financial Analytics"],
            "is_active": True
        }
    ]
    
    return func.HttpResponse(
        json.dumps(services),
        status_code=200,
        headers={"Content-Type": "application/json"}
    )

@app.route(route="api/company", methods=["GET"])
def get_company(req: func.HttpRequest) -> func.HttpResponse:
    """Get company information"""
    company = {
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
    
    return func.HttpResponse(
        json.dumps(company),
        status_code=200,
        headers={"Content-Type": "application/json"}
    )

@app.route(route="api/health", methods=["GET"])
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """Health check endpoint"""
    return func.HttpResponse(
        json.dumps({"status": "healthy", "service": "azure-function"}),
        status_code=200,
        headers={"Content-Type": "application/json"}
    )

@app.route(route="api/contact", methods=["POST"])
def create_contact(req: func.HttpRequest) -> func.HttpResponse:
    """Submit contact form"""
    try:
        req_body = req.get_json()
        
        contact_data = {
            "id": str(uuid.uuid4()),
            "name": req_body.get("name", ""),
            "email": req_body.get("email", ""),
            "service_interest": req_body.get("service_interest", ""),
            "message": req_body.get("message", ""),
            "status": "new",
            "created_at": datetime.utcnow().isoformat(),
            "note": "Contact form submission received successfully"
        }
        
        return func.HttpResponse(
            json.dumps(contact_data),
            status_code=201,
            headers={"Content-Type": "application/json"}
        )
        
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            headers={"Content-Type": "application/json"}
        )

@app.route(route="api/debug", methods=["GET"])
def debug_info(req: func.HttpRequest) -> func.HttpResponse:
    """Debug information endpoint"""
    debug_data = {
        "function_runtime": "Python 3.9",
        "api_version": "1.0.0",
        "endpoints": [
            "/api",
            "/api/services",
            "/api/company", 
            "/api/health",
            "/api/contact",
            "/api/debug"
        ],
        "status": "operational"
    }
    
    return func.HttpResponse(
        json.dumps(debug_data),
        status_code=200,
        headers={"Content-Type": "application/json"}
    )