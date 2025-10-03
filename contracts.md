# AximoIX Backend API Contracts

## Overview
This document outlines the API contracts for the AximoIX website backend implementation. The backend will replace mock data with real database operations and provide full functionality.

## Database Models

### 1. Contact Submissions
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  serviceInterest: String, // One of: "ICT Solutions", "AI Solutions", etc.
  message: String,
  createdAt: Date,
  status: String // "new", "in-progress", "resolved"
}
```

### 2. Services
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  icon: String,
  features: [String],
  detailedInfo: {
    overview: String,
    benefits: [String],
    technologies: [String],
    caseStudies: [String]
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Company Information
```javascript
{
  _id: ObjectId,
  name: String,
  motto: String,
  tagline: String,
  description: String,
  about: {
    goal: String,
    vision: String,
    mission: String
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    socialMedia: Object
  },
  updatedAt: Date
}
```

## API Endpoints

### Contact Management
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin)
- `PUT /api/contact/:id` - Update contact status (admin)

### Services Management
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get detailed service information
- `POST /api/services` - Create new service (admin)
- `PUT /api/services/:id` - Update service (admin)

### Company Information
- `GET /api/company` - Get company information
- `PUT /api/company` - Update company information (admin)

## Mock Data Integration Plan

### Current Mock Data in `/frontend/src/components/mock.js`:
- Company information (name, motto, tagline, description, about, contact)
- Services array (5 services with features)
- Images URLs

### Backend Integration Steps:
1. **Seed Database**: Initialize MongoDB with current mock data
2. **Replace Frontend Calls**: Update frontend to use actual API endpoints instead of mock data
3. **Form Functionality**: Make contact form submit to backend
4. **Service Details**: Implement "Learn More" functionality with detailed service pages
5. **Admin Features**: Add basic admin endpoints for content management

## Frontend Changes Required
1. Remove dependency on `mock.js` for static data
2. Add API calls using axios to fetch dynamic data
3. Update "Learn More" button to fetch detailed service information
4. Make contact form submit to backend endpoint
5. Add loading states and error handling

## Key Features to Implement
1. **Functional Contact Form**: Store submissions in database
2. **Dynamic Services**: Fetch services from database
3. **Service Details**: Detailed "Learn More" functionality
4. **Content Management**: Basic admin endpoints for updating content
5. **Email Notifications**: Send email when contact form is submitted

## Error Handling
- Validation for all form inputs
- Proper HTTP status codes
- User-friendly error messages
- Fallback to cached data if API fails

## Security Considerations
- Input validation and sanitization
- Rate limiting for contact form
- CORS configuration
- Basic admin authentication (future enhancement)