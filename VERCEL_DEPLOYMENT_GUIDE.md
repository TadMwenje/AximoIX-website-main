# Vercel Deployment Guide - AximoIX Website

## Pre-Deployment Checklist

✅ Code changes ready:
- `backend/server.py` - Updated email template with brand colors
- `backend/requirements.txt` - Added Resend package
- `src/App.js` - Enhanced contact form styling

✅ Secrets management:
- `.env` file is in `.gitignore` (NOT committed)
- No hardcoded API keys in code
- MongoDB URL uses environment variables

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "feat: Add Resend email integration with branded template and improved form styling"
git push origin main
```

**Important:** Do NOT include:
- `.env` file
- Test scripts (test_*.ps1)
- Markdown documentation files (optional - can clean up later)

---

## Step 2: Configure Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Select your project
2. Go to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables:

| Variable Name | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` | From Resend.com |
| `CONTACT_EMAIL_FROM` | `noreply@aximoix.com` | Verified domain in Resend |
| `CONTACT_EMAIL_TO` | `services@aximoix.com` | Your iCloud+ email |
| `MONGODB_URL` | `mongodb+srv://[user]:[pass]@[cluster]/aximoix` | Atlas connection string |
| `DB_NAME` | `aximoix` | Database name |
| `VERCEL_ENV` | `production` | Environment flag |

**How to set each:**
- Click **"Add New"** for each variable
- Check the boxes for deployment environments where needed:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

---

## Step 3: Configure Build Settings

1. In Vercel Dashboard → **Settings** → **Build & Development Settings**

### Backend Build Command:
```
pip install -r backend/requirements.txt
```

### Backend Output Directory:
```
backend
```

### Frontend Build Command:
```
cd frontend && npm install && npm run build
```

**Note:** If using default Create React App, Vercel auto-detects the build process

---

## Step 4: Test Production Deployment

1. Push code to GitHub (will trigger auto-deploy)
2. Watch deployment progress in Vercel Dashboard
3. Once deployed, test the live contact form:
   - Go to your production URL
   - Submit test form
   - Verify email arrives in services@aximoix.com

---

## Step 5: Verify Email is Working

**Test Email Submission:**
```
From: mwenjet@africau.edu
To: services@aximoix.com
Subject: New Contact Form Submission
```

**Verify in Resend Dashboard:**
- Go to https://resend.com/emails
- Check email was delivered: ✅ Sent

**Verify in iCloud Mail:**
- Check services@aximoix.com inbox
- Email should have:
  - Cyan-green header (#00FFD1)
  - Dark theme background
  - All form fields formatted

---

## Environment Variables by Stage

### Development (Local - `.env` file)
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_FROM=noreply@aximoix.com
CONTACT_EMAIL_TO=services@aximoix.com
MONGODB_URL=mongodb://localhost:27017/aximoix
DB_NAME=aximoix
VERCEL_ENV=development
```

### Production (Vercel Dashboard)
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_FROM=noreply@aximoix.com
CONTACT_EMAIL_TO=services@aximoix.com
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/aximoix
DB_NAME=aximoix
VERCEL_ENV=production
```

---

## Troubleshooting

### Email not sending in production?
- Check RESEND_API_KEY is set correctly in Vercel
- Verify MongoDB connection string in MONGODB_URL
- Check Resend email logs: https://resend.com/emails

### Contact form returns 500 error?
- Check Vercel function logs: Dashboard → **Functions**
- Verify all environment variables are set
- Check MongoDB Atlas whitelist includes Vercel IPs (or allow all)

### Email going to spam?
- Domain `aximoix.com` is verified in Resend ✅
- Wait 24 hours for domain reputation
- Check Resend DKIM/SPF records

---

## MongoDB Atlas Configuration

If using cloud database, ensure:

1. **IP Whitelist** in Atlas:
   - Add Vercel IP ranges: https://vercel.com/docs/concepts/edge-network/regions
   - Or allow from anywhere (0.0.0.0/0) - less secure

2. **Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/aximoix
   ```

3. **Test Connection:**
   - Vercel will show connection errors in deployment logs

---

## Post-Deployment Monitoring

1. **Resend Dashboard** - Monitor email delivery
2. **Vercel Analytics** - Check site performance
3. **MongoDB Atlas** - Monitor database operations
4. **iCloud Mail** - Check services@aximoix.com inbox regularly

---

## Rollback Plan

If something breaks:
1. Go to Vercel Dashboard → **Deployments**
2. Find last known good deployment
3. Click **"Redeploy"** to revert

---

## Security Checklist

✅ No secrets in GitHub commit
✅ `.env` file in `.gitignore`
✅ Resend API key only in Vercel environment
✅ MongoDB password only in Vercel environment
✅ No hardcoded credentials in source code
✅ `.env.example` provided for developers

---

## Next Steps

1. **Commit & Push** code to GitHub
2. **Set Environment Variables** in Vercel
3. **Trigger Deployment** by pushing to main branch
4. **Test** the live contact form
5. **Monitor** email delivery in Resend dashboard

---

## Questions?

Refer to:
- Vercel Docs: https://vercel.com/docs
- Resend Docs: https://resend.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
