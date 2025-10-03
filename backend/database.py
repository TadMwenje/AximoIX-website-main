from motor.motor_asyncio import AsyncIOMotorClient
from models import Service, ServiceDetail, CompanyInfo, CompanyAbout, CompanyContact
import os
from dotenv import load_dotenv
from pathlib import Path


async def seed_database(db):
    """Initialize database with default data"""
    
    # Use collections from the passed db instance
    contacts_collection = db.contacts
    services_collection = db.services
    company_collection = db.company
    
    # Check if data already exists
    existing_services = await services_collection.count_documents({})
    existing_company = await company_collection.count_documents({})
    
    if existing_services > 0 and existing_company > 0:
        print("✅ Database already seeded")
        return
    
    print("🌱 Seeding database with initial data...")
    
    try:
        # Seed Services
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
        
        # Insert services only if they don't exist
        for service_data in services_data:
            existing_service = await services_collection.find_one({"id": service_data["id"]})
            if not existing_service:
                await services_collection.insert_one(service_data)
                print(f"✅ Seeded service: {service_data['title']}")
        
        # Seed Company Information
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
        
        existing_company = await company_collection.find_one({"id": "aximoix-company"})
        if not existing_company:
            await company_collection.insert_one(company_data)
            print("✅ Seeded company information")
        
        print("🎉 Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise
