#!/usr/bin/env python3
"""
AximoIX Backend API Test Suite
Tests all backend endpoints with comprehensive scenarios
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "https://innovix-tech.preview.emergentagent.com"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def add_pass(self, test_name):
        self.passed += 1
        print(f"✅ PASS: {test_name}")
        
    def add_fail(self, test_name, error):
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        print(f"❌ FAIL: {test_name} - {error}")
        
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total Tests: {total}")
        print(f"Passed: {self.passed}")
        print(f"Failed: {self.failed}")
        print(f"Success Rate: {(self.passed/total*100):.1f}%" if total > 0 else "0%")
        
        if self.errors:
            print(f"\n{'='*60}")
            print("FAILED TESTS:")
            print(f"{'='*60}")
            for error in self.errors:
                print(f"• {error}")
        
        return self.failed == 0

def test_health_check(results):
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "AximoIX API is running" and data.get("status") == "healthy":
                results.add_pass("Health Check - API is running")
            else:
                results.add_fail("Health Check", f"Unexpected response: {data}")
        else:
            results.add_fail("Health Check", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Health Check", f"Connection error: {str(e)}")

def test_contact_form_valid(results):
    """Test contact form submission with valid data"""
    try:
        contact_data = {
            "name": "John Smith",
            "email": "john.smith@example.com",
            "service_interest": "AI Solutions",
            "message": "I'm interested in learning more about your AI solutions for my business. Could you provide more details about implementation timelines and pricing?"
        }
        
        response = requests.post(f"{API_URL}/contact", json=contact_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if (data.get("name") == contact_data["name"] and 
                data.get("email") == contact_data["email"] and
                data.get("id")):
                results.add_pass("Contact Form - Valid submission")
            else:
                results.add_fail("Contact Form - Valid", f"Invalid response data: {data}")
        else:
            results.add_fail("Contact Form - Valid", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Contact Form - Valid", f"Error: {str(e)}")

def test_contact_form_invalid(results):
    """Test contact form submission with invalid data"""
    try:
        # Test missing required fields
        invalid_data = {
            "name": "",
            "email": "invalid-email",
            "message": ""
        }
        
        response = requests.post(f"{API_URL}/contact", json=invalid_data, timeout=10)
        if response.status_code == 422:  # Validation error expected
            results.add_pass("Contact Form - Invalid data validation")
        else:
            results.add_fail("Contact Form - Invalid", f"Expected 422, got {response.status_code}")
    except Exception as e:
        results.add_fail("Contact Form - Invalid", f"Error: {str(e)}")

def test_get_contact_submissions(results):
    """Test getting all contact submissions (admin endpoint)"""
    try:
        response = requests.get(f"{API_URL}/contact", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("Get Contact Submissions - Admin endpoint")
            else:
                results.add_fail("Get Contact Submissions", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("Get Contact Submissions", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Get Contact Submissions", f"Error: {str(e)}")

def test_get_services(results):
    """Test getting all services"""
    try:
        response = requests.get(f"{API_URL}/services", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                # Check if services have required fields
                service = data[0]
                required_fields = ["id", "title", "description", "icon", "features", "detailed_info"]
                if all(field in service for field in required_fields):
                    # Check detailed_info structure
                    detailed_info = service["detailed_info"]
                    if all(key in detailed_info for key in ["overview", "benefits", "technologies"]):
                        results.add_pass("Get Services - Structure and data")
                    else:
                        results.add_fail("Get Services", f"Missing detailed_info fields: {detailed_info.keys()}")
                else:
                    results.add_fail("Get Services", f"Missing required fields in service: {service.keys()}")
            else:
                results.add_fail("Get Services", f"Expected non-empty list, got: {data}")
        else:
            results.add_fail("Get Services", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Get Services", f"Error: {str(e)}")

def test_get_service_details(results):
    """Test getting individual service details"""
    service_ids = ["1", "2", "3", "4", "5"]
    
    for service_id in service_ids:
        try:
            response = requests.get(f"{API_URL}/services/{service_id}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "title", "description", "detailed_info"]
                if all(field in data for field in required_fields):
                    detailed_info = data["detailed_info"]
                    if all(key in detailed_info for key in ["overview", "benefits", "technologies", "case_studies"]):
                        results.add_pass(f"Get Service Details - Service {service_id}")
                    else:
                        results.add_fail(f"Get Service Details - Service {service_id}", 
                                       f"Missing detailed_info fields: {detailed_info.keys()}")
                else:
                    results.add_fail(f"Get Service Details - Service {service_id}", 
                                   f"Missing required fields: {data.keys()}")
            else:
                results.add_fail(f"Get Service Details - Service {service_id}", 
                               f"Status code: {response.status_code}")
        except Exception as e:
            results.add_fail(f"Get Service Details - Service {service_id}", f"Error: {str(e)}")

def test_get_service_not_found(results):
    """Test getting non-existent service"""
    try:
        response = requests.get(f"{API_URL}/services/999", timeout=10)
        if response.status_code == 404:
            results.add_pass("Get Service - 404 handling")
        else:
            results.add_fail("Get Service - 404", f"Expected 404, got {response.status_code}")
    except Exception as e:
        results.add_fail("Get Service - 404", f"Error: {str(e)}")

def test_get_company_info(results):
    """Test getting company information"""
    try:
        response = requests.get(f"{API_URL}/company", timeout=10)
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "name", "motto", "tagline", "description", "about", "contact"]
            if all(field in data for field in required_fields):
                # Check about section
                about = data["about"]
                if all(key in about for key in ["goal", "vision", "mission"]):
                    # Check contact section
                    contact = data["contact"]
                    if all(key in contact for key in ["email", "phone", "address", "social_media"]):
                        results.add_pass("Get Company Info - Complete structure")
                    else:
                        results.add_fail("Get Company Info", f"Missing contact fields: {contact.keys()}")
                else:
                    results.add_fail("Get Company Info", f"Missing about fields: {about.keys()}")
            else:
                results.add_fail("Get Company Info", f"Missing required fields: {data.keys()}")
        else:
            results.add_fail("Get Company Info", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Get Company Info", f"Error: {str(e)}")

def test_database_seeding(results):
    """Test that database has been properly seeded"""
    try:
        # Check services count
        services_response = requests.get(f"{API_URL}/services", timeout=10)
        if services_response.status_code == 200:
            services = services_response.json()
            if len(services) == 5:
                results.add_pass("Database Seeding - Services count")
            else:
                results.add_fail("Database Seeding - Services", f"Expected 5 services, got {len(services)}")
        
        # Check company info exists
        company_response = requests.get(f"{API_URL}/company", timeout=10)
        if company_response.status_code == 200:
            company = company_response.json()
            if company.get("name") == "AximoIX":
                results.add_pass("Database Seeding - Company info")
            else:
                results.add_fail("Database Seeding - Company", f"Expected AximoIX, got {company.get('name')}")
        
    except Exception as e:
        results.add_fail("Database Seeding", f"Error: {str(e)}")

def main():
    print(f"{'='*60}")
    print("AximoIX Backend API Test Suite")
    print(f"{'='*60}")
    print(f"Testing API at: {API_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")
    
    results = TestResults()
    
    # Run all tests
    print("\n🔍 Running Health Check...")
    test_health_check(results)
    
    print("\n🔍 Testing Database Seeding...")
    test_database_seeding(results)
    
    print("\n🔍 Testing Contact Form API...")
    test_contact_form_valid(results)
    test_contact_form_invalid(results)
    test_get_contact_submissions(results)
    
    print("\n🔍 Testing Services API...")
    test_get_services(results)
    test_get_service_details(results)
    test_get_service_not_found(results)
    
    print("\n🔍 Testing Company Information API...")
    test_get_company_info(results)
    
    # Print summary
    success = results.summary()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())