# Quick Start: Email Setup for Contact Form (Resend)

**TL;DR** - Get emails working in 5 minutes

---

## 🚀 Quick Setup

### 1. Get Resend API Key (2 min)
```bash
# Go to https://resend.com → Sign up (free)
# API Keys → Create API Key
# Copy the key (looks like: re_xxxxxxxxxxxx)
```

### 2. Set Environment Variable (1 min)

**Local Development** - Create `backend/.env`:
```bash
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL_FROM=noreply@aximoix.com
```

**Vercel Production** - Dashboard → Settings → Environment Variables:
```
RESEND_API_KEY = re_your_key_here
CONTACT_EMAIL_FROM = noreply@aximoix.com
```

### 3. Install Dependencies (1 min)
```bash
cd backend
pip install -r requirements.txt
```

### 4. Test Locally (1 min)
```bash
python -m uvicorn server:app --reload
```

Open another terminal:
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service_interest": "AI Solutions",
    "message": "Testing email functionality"
  }'
```

### 5. Check Email
- Look in your Resend dashboard → Emails
- Check services@aximoix.com inbox
- Should see email with all contact details

---

## ✅ What Happens Now

When someone fills the contact form:

1. ✅ Form data sent to backend
2. ✅ Saved to MongoDB
3. ✅ Email sent to services@aximoix.com automatically
4. ✅ User sees success message
5. ✅ Services team gets notified

---

## 📧 Email Preview

**To**: services@aximoix.com  
**From**: noreply@aximoix.com  
**Subject**: New Contact Form Submission from [Name]  

**Contains**:
- Submitter's name
- Submitter's email (can reply directly)
- Service interest they selected
- Full message
- Submission timestamp

---

## 🔧 Verification Steps

Resend account created? → YES ✅  
API key copied (starts with re_)? → YES ✅  
Environment variable set? → YES ✅  
Dependencies installed? → YES ✅  
Backend running? → YES ✅  
Form field names correct? → YES ✅  
Email sends to services@aximoix.com? → YES ✅  

---

## 📊 Troubleshooting

| Problem | Solution |
|---------|----------|
| Email not sending | Check RESEND_API_KEY env var is set correctly |
| Wrong recipient | Verify CONTACT_EMAIL_TO = "services@aximoix.com" |
| Email goes to spam | Check domain verification in Resend dashboard |
| Backend error | Check backend console for error messages |
| Still not working? | See full guide: EMAIL_SETUP.md |

---

## 📞 Quick Links

- Resend Dashboard: https://resend.com/dashboard
- Resend Docs: https://resend.com/docs
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com

---

**You're done!** The contact form now sends emails automatically. 🎉

For detailed setup and troubleshooting: See `EMAIL_SETUP.md`
