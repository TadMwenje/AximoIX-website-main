import azure.functions as func
import logging
import os
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import ObjectId
import uuid
from datetime import datetime

# MongoDB Atlas connection
MONGO_URL = "mongodb+srv://tadiwamwenje00_db_user:RPvXEHmqSU4d12V6@aximoixcluster.yhr0vt9.mongodb.net/?retryWrites=true&w=majority&appName=aximoixcluster"
DB_NAME = "aximoix"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = func.FunctionApp()

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

@app.route(route="api", methods=["GET"])
async def api_root(req: func.HttpRequest) -> func.HttpResponse:
    try:
        await client.admin.command('ping')
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    response_data = {
        "message": "AximoIX API is running", 
        "status": "healthy",
        "database": db_status,
        "version": "1.0.0"
    }
    
    return func.HttpResponse(
        json.dumps(response_data, cls=JSONEncoder),
        status_code=200,
        headers={"Content-Type": "application/json"}
    )

@app.route(route="api/contact", methods=["POST"])
async def create_contact(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        
        contact_data = {
            "id": str(uuid.uuid4()),
            "name": req_body.get("name"),
            "email": req_body.get("email"),
            "service_interest": req_body.get("service_interest", ""),
            "message": req_body.get("message"),
            "status": "new",
            "created_at": datetime.utcnow()
        }
        
        result = await db.contacts.insert_one(contact_data)
        
        if result.inserted_id:
            return func.HttpResponse(
                json.dumps(contact_data, cls=JSONEncoder),
                status_code=201,
                headers={"Content-Type": "application/json"}
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": "Failed to create contact submission"}),
                status_code=500
            )
            
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500
        )

@app.route(route="api/services", methods=["GET"])
async def get_services(req: func.HttpRequest) -> func.HttpResponse:
    try:
        services = await db.services.find({"is_active": True}).to_list(100)
        return func.HttpResponse(
            json.dumps(services, cls=JSONEncoder),
            status_code=200,
            headers={"Content-Type": "application/json"}
        )
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500
        )

@app.route(route="api/company", methods=["GET"])
async def get_company(req: func.HttpRequest) -> func.HttpResponse:
    try:
        company = await db.company.find_one({"id": "aximoix-company"})
        if company:
            return func.HttpResponse(
                json.dumps(company, cls=JSONEncoder),
                status_code=200,
                headers={"Content-Type": "application/json"}
            )
        else:
            return func.HttpResponse(
                json.dumps({"error": "Company not found"}),
                status_code=404
            )
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500
        )

@app.route(route="api/health", methods=["GET"])
async def health_check(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({"status": "healthy", "service": "azure-function"}),
        status_code=200,
        headers={"Content-Type": "application/json"}
    )