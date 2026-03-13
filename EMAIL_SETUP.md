# Email Setup Guide - AximoIX Contact Form (Resend)

This guide explains how to set up the email functionality for the AximoIX contact form using **Resend**, a modern email service, which will send contact submissions to `services@aximoix.com`.

## Table of Contents
1. [Overview](#overview)
2. [Resend Setup](#resend-setup)
3. [Environment Variables](#environment-variables)
4. [Local Development Testing](#local-development-testing)
5. [Vercel Production Deployment](#vercel-production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### What Has Been Implemented

The contact form now integrates with **Resend** for reliable email delivery:

- ✅ Contact form submissions are saved to MongoDB
- ✅ Automatic email sent to `services@aximoix.com` with formatted contact details
- ✅ Includes name, email, service interest, and message
- ✅ Beautiful HTML email template with proper styling
- ✅ Reply-to header set to subscriber's email for easy communication
- ✅ Plain text fallback for email clients
- ✅ Error handling with graceful fallbacks

### Contact Form Fields Received
- **Name** * (required)
- **Email** * (required)
- **Service Interest** (optional) - Select from: ICT Solutions, AI Solutions, Advertising & Marketing, Programming & Coding, Financial Technology
- **Message** * (required)

---

## Resend Setup

### Why Resend?

Resend is a modern, developer-friendly email service with:
- ✅ Simple Python API
- ✅ Generous free tier
- ✅ Excellent deliverability
- ✅ Built-in email tracking and analytics
- ✅ Perfect for transactional emails

### Step 1: Create a Resend Account

1. Go to [Resend.com](https://resend.com)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Complete the onboarding

### Step 2: Create API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** (in the left sidebar)
3. Click **"Create API Key"**
4. Name it something like "AximoIX Contact Form"
5. Click **Create**
6. **Copy the API key** (starts with `re_`)

**Your API Key Format**: `re_xxxxxxxxxxxxxxxx...`

### Step 3: Verify Sender Domain (Optional but Recommended)

For production deployments, verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `aximoix.com`
4. Follow DNS verification instructions
5. Add the DNS records to your domain provider

**For quick testing**: Use the default Resend test domain without domain verification

---

## Environment Variables

### For Local Development

Create or update `.env` file in the `backend/` directory:

```bash
# MongoDB
MONGODB_URL=mongodb+srv://your_user:your_password@cluster.mongodb.net/aximoix
DB_NAME=aximoix

# Email Configuration (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx_your_actual_api_key_here
CONTACT_EMAIL_FROM=noreply@aximoix.com
```

### For Vercel Production

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add new environment variables:

| Variable Name | Value | Example |
|---|---|---|
| `RESEND_API_KEY` | Your Resend API Key | `re_x1x2x3x4x...` |
| `CONTACT_EMAIL_FROM` | Sender email address | `noreply@aximoix.com` |
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `aximoix` |

4. Set environment for all deployments (Production, Preview, Development)
5. Redeploy your application for changes to take effect

**Important**: Never commit API keys to git. Use `.gitignore` to exclude `.env` files.

---

## Local Development Testing

### Prerequisites

```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt
```

### Running Backend Locally

```bash
# From the backend directory
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Testing the Contact Endpoint

**Using cURL:**

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "service_interest": "AI Solutions",
    "message": "I am interested in learning more about your AI solutions."
  }'
```

**Using Python:**

```python
import requests

contact_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "service_interest": "AI Solutions",
    "message": "I am interested in learning more about your AI solutions."
}

response = requests.post(
    'http://localhost:8000/api/contact',
    json=contact_data
)

print(response.json())
```

### Expected Response

```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "database": "mongodb",
  "email_status": "sent"
}
```

### Debug Logging

Check the console output for debug messages:

```
📧 Received contact from: John Doe (john@example.com)
✅ Contact saved to MongoDB with ID: 550e8400-e29b-41d4-a716-446655440000
✅ Email sent successfully to services@aximoix.com
   Email ID: d61bbcd9-28e5-4eeb-871d-b467b4f0fc95
✅ Email status updated in database
```

---

## Vercel Production Deployment

### Prerequisites

1. Backend deployed to Vercel
2. MongoDB Atlas cluster set up
3. Resend account with API key

### Deployment Steps

1. **Install dependencies in Vercel:**
   - Push updated `requirements.txt` with Resend library
   - Vercel will automatically install dependencies

2. **Add environment variables in Vercel:**
   - Follow the steps in [Environment Variables](#environment-variables) section above

3. **Deploy:**

```bash
# Commit changes to push to Resend
git add .
git commit -m "Switch to Resend for email notifications"

# Push to trigger Vercel deployment
git push origin main
```

4. **Verify Deployment:**
   - Check Vercel deployment logs for any errors
   - Test the contact form on your live website
   - Check Resend dashboard for sent emails

### Check Deployment Status

Visit your API health endpoint:
```
https://aximoixwebsitemain.vercel.app/api/health
```

Look for email configuration status in the response.

---

## Troubleshooting

### Issue: Email Not Sending

**Symptom**: `email_status: "not_configured"` in response or error in logs

**Solution**:
1. Verify `RESEND_API_KEY` is set as environment variable
2. Check backend logs:
   - Local: See console output
   - Vercel: Check function logs in `Functions` tab
3. Verify API key format starts with `re_`
4. Test API key validity in Resend dashboard

### Issue: "Resend API key not configured"

**Solution**:
1. Confirm environment variable `RESEND_API_KEY` is set
2. For Vercel - redeploy after adding environment variables
3. Check variable name spelling (case-sensitive: `RESEND_API_KEY`)
4. Verify the key starts with `re_`

### Issue: Email Goes to Spam

**Solution**:
1. Verify your sender domain in Resend:
   - Add and verify your domain in Resend dashboard
   - Update `CONTACT_EMAIL_FROM` to use your domain
2. Resend automatically handles SPF and DKIM
3. Inspect first email in Resend dashboard for delivery details

### Issue: Invalid Sender Email

**Solution**:
1. Ensure `CONTACT_EMAIL_FROM` format is valid: `name@domain.com`
2. For testing, use: `onboarding@resend.dev` (Resend test domain)
3. For production, verify your domain in Resend dashboard first
4. Make sure the email is in format: `noreply@aximoix.com` or similar

### Issue: 401 Unauthorized Error

**Solution**:
1. API key is invalid or expired
2. Generate new API key in Resend:
   - Go to API Keys in dashboard
   - Create new key if needed
   - Update environment variable
3. Restart local server or redeploy Vercel
4. Verify key starts with `re_` and has no extra spaces

### Issue: Request Timeout

**Solution**:
1. Check internet connection
2. Verify Resend API is accessible
3. Check backend logs for specific errors
4. Resend status page: https://status.resend.com

---

## Email Template

The email sent to `services@aximoix.com` includes:

- Formatted HTML template with gradient header
- Contact details clearly labeled:
  - Submitter's Name
  - Submitter's Email (clickable mailto link)
  - Service Interest
  - Full Message
- Reply-to header set to submitter's email
- Plain text fallback
- Timestamp of submission

### Sample Email

**From**: noreply@aximoix.com  
**To**: services@aximoix.com  
**Subject**: New Contact Form Submission from John Doe  
**Reply-To**: john@example.com  

**Content**: Beautiful HTML email with all contact details formatted

---

## API Endpoint Details

### POST /api/contact

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "service_interest": "string (optional)",
  "message": "string (required)"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "id": "unique-submission-id",
  "database": "mongodb",
  "email_status": "sent"
}
```

**Response (Email Not Configured):**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "id": "unique-submission-id",
  "database": "mongodb",
  "email_status": "not_configured"
}
```

---

## Security Notes

- 🔐 Never commit API keys to Git
- 🔐 Use `.env.local` for local development (add to `.gitignore`)
- 🔐 For Vercel, use encrypted environment variables only
- 🔐 API key in environment variables is not accessible from frontend
- 🔐 Email addresses are logged but not exposed in response

---

## Monitoring & Analytics

### Resend Dashboard

Monitor sent emails:
1. Go to Resend Dashboard
2. Click **"Emails"** to see:
   - Emails sent
   - Delivery status
   - Open rate
   - Click rate
   - Bounce rate

3. Click on individual emails for detailed information

### MongoDB Tracking

Monitor submissions in database:
```javascript
// View all contact submissions
db.contacts.find({})

// View with email status
db.contacts.find({}, { name: 1, email: 1, email_sent: 1, created_at: 1 })

// Count total submissions
db.contacts.countDocuments({})

// Find submissions where email wasn't sent
db.contacts.find({ email_sent: false })
```

---

## Support & Resources

- **Resend Docs**: https://resend.com/docs
- **Resend API Reference**: https://resend.com/docs/api-reference/emails/send-email
- **Resend Status**: https://status.resend.com
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **MongoDB Documentation**: https://docs.mongodb.com

---

## Next Steps

1. ✅ Create Resend account and get API key
2. ✅ Set environment variables (local and Vercel)
3. ✅ Test locally before deploying
4. ✅ Deploy to Vercel
5. ✅ Test live contact form
6. ✅ Monitor Resend analytics dashboard
7. ✅ Update frontend to collect service selections from dropdown

---

**Last Updated**: March 13, 2026  
**Backend Version**: 1.0.0  
**Email Service**: Resend (Modern, Developer-Friendly)  
**Status**: ✅ Production Ready

- ✅ Contact form submissions are saved to MongoDB
- ✅ Automatic email sent to `services@aximoix.com` with formatted contact details
- ✅ Includes name, email, service interest, and message
- ✅ Beautiful HTML email template with proper styling
- ✅ Reply-to header set to subscriber's email for easy communication
- ✅ Plain text fallback for email clients
- ✅ Error handling with graceful fallbacks

### Contact Form Fields Received
- **Name** * (required)
- **Email** * (required)
- **Service Interest** (optional) - Select from: ICT Solutions, AI Solutions, Advertising & Marketing, Programming & Coding, Financial Technology
- **Message** * (required)

---

## SendGrid Setup

### Step 1: Create a SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com)
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Complete the setup wizard

### Step 2: Create API Key

1. Log in to your SendGrid dashboard
2. Navigate to **Settings → API Keys**
3. Click **"Create API Key"**
4. Name it something like "AximoIX Contact Form"
5. Select **Full Access** (or customize permissions for security)
6. Click **Create & View**
7. **Copy the API key** (you won't see it again!)

### Step 3: Verify Sender Email

1. In SendGrid dashboard, go to **Settings → Sender Authentication**
2. Choose **Domain Authentication** (recommended for production)
   - Or use **Single Sender Verification** for quick setup

#### For Single Sender Verification (Quick):
1. Click **"Verify a Single Sender"**
2. Enter sender details:
   - **Email**: `noreply@aximoix.com` (or your company email)
   - **Name**: AximoIX
   - **Address**: 3rd Floor 120 West Trinity Place Decatur, GA 30030
3. Click **"Create Sender"**
4. Check the verification email sent to your address
5. Click the verification link

#### For Domain Authentication (Production - Recommended):
1. Follow SendGrid's domain verification process
2. Add DNS records to your domain provider
3. This improves email deliverability significantly

---

## Environment Variables

### For Local Development

Create or update `.env` file in the `backend/` directory:

```bash
# MongoDB
MONGODB_URL=mongodb+srv://your_user:your_password@cluster.mongodb.net/aximoix
DB_NAME=aximoix

# Email Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxx_your_actual_api_key_here
CONTACT_EMAIL_FROM=noreply@aximoix.com
```

### For Vercel Production

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add new environment variables:

| Variable Name | Value | Example |
|---|---|---|
| `SENDGRID_API_KEY` | Your SendGrid API Key | `SG.x1x2x3x4x...` |
| `CONTACT_EMAIL_FROM` | Sender email address | `noreply@aximoix.com` |
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `aximoix` |

4. Set environment for all deployments (Production, Preview, Development)
5. Redeploy your application for changes to take effect

**Important**: Never commit API keys to git. Use `.gitignore` to exclude `.env` files.

---

## Local Development Testing

### Prerequisites

```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt
```

### Running Backend Locally

```bash
# From the backend directory
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Testing the Contact Endpoint

**Using cURL:**

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "service_interest": "AI Solutions",
    "message": "I am interested in learning more about your AI solutions."
  }'
```

**Using Python:**

```python
import requests

contact_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "service_interest": "AI Solutions",
    "message": "I am interested in learning more about your AI solutions."
}

response = requests.post(
    'http://localhost:8000/api/contact',
    json=contact_data
)

print(response.json())
```

### Expected Response

```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "database": "mongodb",
  "email_status": "sent"
}
```

### Debug Logging

Check the console output for debug messages:

```
📧 Received contact from: John Doe (john@example.com)
✅ Contact saved to MongoDB with ID: 550e8400-e29b-41d4-a716-446655440000
✅ Email sent successfully to services@aximoix.com
   Status Code: 202
✅ Email status updated in database
```

---

## Vercel Production Deployment

### Prerequisites

1. Backend deployed to Vercel
2. MongoDB Atlas cluster set up
3. SendGrid account with API key

### Deployment Steps

1. **Install dependencies in Vercel:**
   - Push updated `requirements.txt` with email libraries
   - Vercel will automatically install dependencies

2. **Add environment variables in Vercel:**
   - Follow the steps in [Environment Variables](#environment-variables) section above

3. **Deploy:**

```bash
# Commit changes
git add .
git commit -m "Add email functionality for contact form"

# Push to trigger Vercel deployment
git push origin main
```

4. **Verify Deployment:**
   - Check Vercel deployment logs for any errors
   - Test the contact form on your live website
   - Check SendGrid activity dashboard for sent emails

### Check Deployment Status

Visit your API health endpoint:
```
https://aximoixwebsitemain.vercel.app/api/health
```

Look for email configuration status in the response.

---

## Troubleshooting

### Issue: Email Not Sending

**Symptom**: `email_status: "not_configured"` in response

**Solution**:
1. Verify `SENDGRID_API_KEY` is set as environment variable
2. Check backend logs:
   - Local: See console output
   - Vercel: Check function logs in `Functions` tab
3. Verify API key is valid:
   ```bash
   curl -X GET https://api.sendgrid.com/v3/mail/send \
     -H "Authorization: Bearer SG.your_api_key"
   ```

### Issue: "SendGrid API key not configured"

**Solution**:
1. Confirm environment variable `SENDGRID_API_KEY` is set
2. For Vercel - redeploy after adding environment variables
3. Check variable name spelling (case-sensitive: `SENDGRID_API_KEY`)

### Issue: Email Goes to Spam

**Solution**:
1. Use domain authentication in SendGrid (not just single sender verification)
2. Add SPF and DKIM records to your domain:
   - SendGrid provides DNS records in Settings → Sender Authentication
3. Include proper "From" header with your domain
4. Avoid spam trigger words in email content

### Issue: "Invalid From Email"

**Solution**:
1. Verify sender email in SendGrid Dashboard → Settings → Sender Authentication
2. Ensure `CONTACT_EMAIL_FROM` matches verified sender
3. If using domain authentication, wait for verification to complete
4. Try: `noreply@aximoix.com` or `contact@aximoix.com`

### Issue: 401 Unauthorized Error

**Solution**:
1. API key is invalid or expired
2. Generate new API key in SendGrid:
   - Go to Settings → API Keys
   - Create new key with full access
   - Update environment variable
3. Restart local server or redeploy Vercel

### Issue: Request Timeout

**Solution**:
1. Check internet connection
2. Verify SendGrid API is accessible
3. Check backend logs for specific errors
4. Increase timeout if needed (currently 15 seconds)

---

## Email Template

The email sent to `services@aximoix.com` includes:

- Formatted HTML template with gradient header
- Contact details clearly labeled:
  - Submitter's Name
  - Submitter's Email (clickable mailto link)
  - Service Interest
  - Full Message
- Reply-to header set to submitter's email
- Plain text fallback
- Timestamp of submission

### Sample Email

**From**: noreply@aximoix.com  
**To**: services@aximoix.com  
**Subject**: New Contact Form Submission from John Doe  
**Reply-To**: john@example.com  

**Content**: Beautiful HTML email with all contact details formatted

---

## API Endpoint Details

### POST /api/contact

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "service_interest": "string (optional)",
  "message": "string (required)"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "id": "unique-submission-id",
  "database": "mongodb",
  "email_status": "sent"
}
```

**Response (Email Not Configured):**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "id": "unique-submission-id",
  "database": "mongodb",
  "email_status": "not_configured"
}
```

---

## Security Notes

- 🔐 Never commit API keys to Git
- 🔐 Use `.env.local` for local development (add to `.gitignore`)
- 🔐 For Vercel, use encrypted environment variables only
- 🔐 API key in environment variables is not accessible from frontend
- 🔐 Email addresses are logged but not exposed in response

---

## Monitoring & Analytics

### SendGrid Dashboard

Monitor sent emails:
1. Go to SendGrid Dashboard
2. Click **"Analytics"** to see:
   - Emails sent
   - Delivery rate
   - Open rate
   - Click rate
   - Bounce rate
   - Spam rate

### MongoDB Tracking

Monitor submissions in database:
```javascript
// View all contact submissions
db.contacts.find({})

// View with email status
db.contacts.find({}, { name: 1, email: 1, email_sent: 1, created_at: 1 })

// Count total submissions
db.contacts.countDocuments({})

// Find submissions where email wasn't sent
db.contacts.find({ email_sent: false })
```

---

## Support & Resources

- **SendGrid Docs**: https://docs.sendgrid.com
- **SendGrid API Reference**: https://docs.sendgrid.com/api-reference
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **MongoDB Documentation**: https://docs.mongodb.com

---

## Next Steps

1. ✅ Create SendGrid account and get API key
2. ✅ Set environment variables (local and Vercel)
3. ✅ Test locally before deploying
4. ✅ Deploy to Vercel
5. ✅ Test live contact form
6. ✅ Monitor SendGrid analytics
7. ✅ Update frontend to collect service selections from dropdown

---

**Last Updated**: March 13, 2026  
**Backend Version**: 1.0.0  
**Email Service**: SendGrid v6.10.0
