# Deployment & Configuration Checklist

Complete guide for all services and environment variables needed for AximoIX deployment.

---

## 📋 Table of Contents

1. [Vercel Environment Variables](#vercel-environment-variables)
2. [Services Setup](#services-setup)
3. [Local Development Setup](#local-development-setup)
4. [Vercel Backend Configuration](#vercel-backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [API Endpoints](#api-endpoints)
7. [Deployment Checklist](#deployment-checklist)

---

## 🔐 VERCEL ENVIRONMENT VARIABLES

### Step 1: Access Vercel Dashboard
```
1. Go to: https://vercel.com/dashboard
2. Select your project: AximoIX-website-main
3. Go to: Settings → Environment Variables
```

### Step 2: Add the Following Environment Variables

**PRODUCTION** (for live site):

| Variable Name | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Email service API key (from Resend.com) |
| `CONTACT_EMAIL_FROM` | `noreply@aximoix.com` | Sender email address |
| `MONGODB_URL` | `mongodb+srv://username:password@cluster.mongodb.net/aximoix` | MongoDB connection string |
| `DB_NAME` | `aximoix` | Database name |
| `VERCEL_ENV` | `production` | Environment identifier |

**PREVIEW** (for preview deployments):

Use the same variables as PRODUCTION

**DEVELOPMENT** (for local testing via Vercel):

Use the same variables as PRODUCTION

### Step 3: Save and Redeploy

```
1. After adding variables, click "Save"
2. Go to Deployments tab
3. Find the latest deployment
4. Click "Redeploy" or push new commit to trigger redeploy
```

---

## 🛠️ SERVICES SETUP

### 1. Resend (Email Service)

**Account Setup:**
```
Website: https://resend.com
Email: your-email@example.com
Password: [your-password]
```

**API Key:**
```
Key: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx (Get from https://resend.com/api-keys)
Location: Dashboard → API Keys
Status: ✅ Active
```

**What it does:**
- Sends contact form submissions to `services@aximoix.com`
- Provides email delivery tracking
- Handles email bounces and failures

**Dashboard:** https://resend.com/dashboard

---

### 2. MongoDB Atlas (Database)

**Account Setup:**
```
Website: https://cloud.mongodb.com
Email: your-email@example.com
Organization: [Your Organization]
```

**Cluster Information:**
```
Cluster Name: [Your Cluster Name]
Database: aximoix
Collections:
  - contacts (stores contact form submissions)
  - services (stores service information)
  - company (stores company information)
```

**Connection String Format:**
```
mongodb+srv://[username]:[password]@[cluster-name].mongodb.net/aximoix?retryWrites=true&w=majority
```

**How to Get Connection String:**
1. Go to MongoDB Atlas Dashboard
2. Click "Clusters" → Your cluster
3. Click "Connect" button
4. Select "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<username>` with your database username
8. Ensure database name is `aximoix`

**Example Connection String:**
```
mongodb+srv://aximoix_user:mySecurePassword123@aximoix-cluster.mongodb.net/aximoix?retryWrites=true&w=majority
```

**Dashboard:** https://cloud.mongodb.com

---

### 3. Vercel (Frontend & Backend Hosting)

**Account Setup:**
```
Website: https://vercel.com
Email: your-email@example.com
GitHub: Connected to TadMwenje/AximoIX-website-main
```

**Project Details:**
```
Project Name: AximoIX-website-main
Repository: TadMwenje/AximoIX-website-main
Frontend Framework: React
Build Command: npm run build
Output Directory: build/ or dist/
```

**Backend Settings:**
```
Framework: FastAPI (Python)
Runtime: Python 3.11+
Build Command: pip install -r backend/requirements.txt
Start Command: uvicorn backend.server:app --host 0.0.0.0 --port 8000
```

**Dashboard:** https://vercel.com/dashboard

---

## 🏠 LOCAL DEVELOPMENT SETUP

### Step 1: Create `.env` file in `backend/` directory

Create file: `backend/.env`

```bash
# ===== MONGODB =====
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/aximoix?retryWrites=true&w=majority
DB_NAME=aximoix

# ===== EMAIL (RESEND) =====
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_FROM=noreply@aximoix.com

# ===== ENVIRONMENT =====
VERCEL_ENV=development
```

### Step 2: Create `.env.local` in `frontend/` directory (optional)

Create file: `frontend/.env.local`

```bash
# Frontend API Configuration
REACT_APP_API_URL=http://localhost:8000/api
```

### Step 3: Verify `.gitignore` excludes `.env`

Check file: `.gitignore`

Should contain:
```
.env
.env.local
.env.*.local
*.env
```

**⚠️ NEVER commit `.env` files to Git!**

---

## 🚀 VERCEL BACKEND CONFIGURATION

### Backend API URL

**Production:**
```
https://aximoixwebsitemain.vercel.app/api
```

**Local Development:**
```
http://localhost:8000/api
```

### Vercel Python Runtime

Vercel automatically detects Python from `backend/requirements.txt`

**Requirements for Vercel:**
✅ `backend/requirements.txt` exists  
✅ `backend/server.py` defines FastAPI app  
✅ Python version 3.11+ (Vercel default)  

### How Vercel Finds Backend

Vercel uses `vercel.json` configuration file:

**File: `vercel.json`** (at root level)
```json
{
  "buildCommand": "pip install -r backend/requirements.txt",
  "outputDirectory": "backend",
  "env": {
    "RESEND_API_KEY": "@resend_api_key",
    "MONGODB_URL": "@mongodb_url",
    "DB_NAME": "@db_name"
  }
}
```

---

## 💻 FRONTEND CONFIGURATION

### Automatic Configuration

Frontend automatically detects environment:

**File: `src/config.js`**
```javascript
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';  // Local dev
  }
  return 'https://aximoixwebsitemain.vercel.app/api';  // Production
};
```

### No Frontend Environment Variables Needed

Frontend is static and automatically routes to:
- Local backend when running locally
- Production backend when deployed

### Frontend Homepage

**File: `package.json`**
```json
{
  "homepage": "https://aximoix.com"
}
```

Update this to your production domain once configured.

---

## 📡 API ENDPOINTS

### Contact Form Submission

**Endpoint:** `POST /api/contact`

**URL:**
```
Production: https://aximoixwebsitemain.vercel.app/api/contact
Local: http://localhost:8000/api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "service_interest": "AI Solutions",
  "message": "I'm interested in your services."
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "database": "mongodb",
  "email_status": "sent"
}
```

### Get Services

**Endpoint:** `GET /api/services`

**URL:**
```
https://aximoixwebsitemain.vercel.app/api/services
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "ICT Solutions",
    "description": "...",
    "icon": "Monitor",
    "features": [...],
    "detailed_info": {...},
    "is_active": true
  },
  ...
]
```

### Get Company Info

**Endpoint:** `GET /api/company`

**URL:**
```
https://aximoixwebsitemain.vercel.app/api/company
```

**Response:**
```json
{
  "name": "AximoIX",
  "motto": "Innovate. Engage. Grow.",
  "tagline": "Where Vision Meets Velocity",
  "description": "...",
  "about": {
    "goal": "...",
    "vision": "...",
    "mission": "..."
  },
  "contact": {
    "email": "hello@aximoix.com",
    "phone": "+1 470 506 4390",
    "address": "3rd Floor 120 West Trinity Place Decatur, GA 30030"
  }
}
```

### Health Check

**Endpoint:** `GET /api/health`

**URL:**
```
https://aximoixwebsitemain.vercel.app/api/health
```

**Response:**
```json
{
  "backend": "running",
  "python_version": "3.11...",
  "database": "connected",
  "environment": "production",
  "timestamp": "2026-03-13T14:30:45.000Z"
}
```

---

## ✅ COMPLETE DEPLOYMENT CHECKLIST

### Pre-Deployment (Local)

- [ ] Clone repository: `git clone https://github.com/TadMwenje/AximoIX-website-main.git`
- [ ] Create `backend/.env` with all variables
- [ ] Install backend dependencies: `pip install -r backend/requirements.txt`
- [ ] Test backend locally: `python -m uvicorn backend.server:app --reload`
- [ ] Install frontend dependencies: `npm install` (from frontend folder)
- [ ] Test frontend locally: `npm start`
- [ ] Test contact form submission locally
- [ ] Verify email arrives at services@aximoix.com
- [ ] Run: `npm run build` to test production build

### Vercel Setup

- [ ] Sign in to Vercel: https://vercel.com
- [ ] Import project from GitHub (if not already connected)
- [ ] Go to Settings → Environment Variables
- [ ] Add all environment variables (see table above)
- [ ] Set variables for Production, Preview, and Development
- [ ] Trigger redeploy or push new commit
- [ ] Wait for build to complete
- [ ] Check build logs for errors

### Verification (Post-Deployment)

- [ ] Visit frontend: https://aximoixwebsitemain.vercel.app
- [ ] Test contact form on live site
- [ ] Verify email sent to services@aximoix.com
- [ ] Check Resend dashboard for delivery status
- [ ] Check MongoDB for contact record
- [ ] Visit `/api/health` endpoint for status
- [ ] Visit `/api/services` for service list
- [ ] Visit `/api/company` for company info
- [ ] Test on mobile devices
- [ ] Check browser console for errors

### Documentation

- [ ] Update `frontend/package.json` homepage with production domain
- [ ] Update frontend config if using custom domain
- [ ] Document all environment variables in team docs
- [ ] Share Resend dashboard access if needed
- [ ] Share MongoDB access if needed

### Monitoring

- [ ] Monitor Resend dashboard for email delivery: https://resend.com/dashboard
- [ ] Check MongoDB Atlas for new contacts: https://cloud.mongodb.com
- [ ] Monitor Vercel deployments: https://vercel.com/dashboard
- [ ] Set up alerts in Vercel for deployment failures
- [ ] Setup email forwarding for services@aximoix.com if needed

---

## 🔒 SECURITY CHECKLIST

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit API keys to Git
- [ ] Vercel environment variables are marked as secret
- [ ] MongoDB credentials are strong passwords
- [ ] Resend API key is rotated periodically
- [ ] Frontend doesn't contain any API keys
- [ ] CORS is properly configured in backend
- [ ] Rate limiting is configured (optional)
- [ ] MongoDB access is restricted by IP (optional)

---

## 📞 SUPPORT RESOURCES

### Resend
- Dashboard: https://resend.com/dashboard
- Docs: https://resend.com/docs
- Email: support@resend.com
- Status: https://status.resend.com

### MongoDB Atlas
- Dashboard: https://cloud.mongodb.com
- Docs: https://docs.mongodb.com
- Support: https://www.mongodb.com/support

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://www.vercel-status.com

### FastAPI
- Docs: https://fastapi.tiangolo.com
- GitHub: https://github.com/tiangolo/fastapi

### React
- Docs: https://react.dev
- GitHub: https://github.com/facebook/react

---

## 📱 TESTING CURL COMMANDS

### Test Contact Form

```bash
curl -X POST https://aximoixwebsitemain.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service_interest": "AI Solutions",
    "message": "Testing the contact form"
  }'
```

### Test Services Endpoint

```bash
curl -X GET https://aximoixwebsitemain.vercel.app/api/services
```

### Test Company Endpoint

```bash
curl -X GET https://aximoixwebsitemain.vercel.app/api/company
```

### Test Health Check

```bash
curl -X GET https://aximoixwebsitemain.vercel.app/api/health
```

---

## 🔄 UPDATING ENVIRONMENT VARIABLES

If you need to update any environment variable:

1. Go to Vercel Dashboard
2. Navigate to: Settings → Environment Variables
3. Click on the variable to edit
4. Update the value
5. Save changes
6. Redeploy by:
   - Option A: Push a new commit to main branch
   - Option B: Go to Deployments → Find latest → Click "Redeploy"

---

## 📊 QUICK REFERENCE TABLE

| Service | Variable | Value | Where Set |
|---------|----------|-------|-----------|
| **Email** | RESEND_API_KEY | re_7wnF9iz9_... | Vercel, .env |
| **Email** | CONTACT_EMAIL_FROM | noreply@aximoix.com | Vercel, .env |
| **Database** | MONGODB_URL | mongodb+srv://... | Vercel, .env |
| **Database** | DB_NAME | aximoix | Vercel, .env |
| **Environment** | VERCEL_ENV | production | Vercel |
| **Frontend API** | (Automatic) | http://localhost:8000/api | config.js |
| **Frontend API** | (Automatic) | https://aximoixwebsitemain... | config.js |

---

## 🎯 DEPLOYMENT FLOW SUMMARY

```
1. Local Development
   ├─ Create .env with credentials
   ├─ Test backend: uvicorn
   ├─ Test frontend: npm start
   └─ Verify email works

2. Push to GitHub
   ├─ git add .
   ├─ git commit -m "message"
   └─ git push origin main

3. Vercel Auto-Deploy
   ├─ Detects new commit
   ├─ Reads environment variables
   ├─ Installs dependencies
   ├─ Builds frontend & backend
   └─ Deploys to production

4. Post-Deployment Testing
   ├─ Test live website
   ├─ Test contact form
   ├─ Verify email delivery
   └─ Check error logs
```

---

**Last Updated:** March 13, 2026  
**Status:** ✅ Ready for Production  
**Version:** 1.0.0
