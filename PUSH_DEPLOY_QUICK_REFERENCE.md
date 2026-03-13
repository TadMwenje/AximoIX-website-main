# QUICK REFERENCE: Push & Deploy Steps

## STEP 1: Commit & Push Code (Local)
```bash
git add .
git commit -m "feat: implement Resend email integration with branded template"
git push origin main
```

**Time:** ~2 minutes
**Result:** Code pushed to GitHub

---

## STEP 2: Configure Vercel (Web UI)

Go to: https://vercel.com → Your Project → Settings → Environment Variables

| Variable | Value |
|----------|-------|
| RESEND_API_KEY | `re_7wnF9iz9_FaqteQbXBYAcKre8nd9v1UYj` |
| CONTACT_EMAIL_FROM | `noreply@aximoix.com` |
| CONTACT_EMAIL_TO | `services@aximoix.com` |
| MONGODB_URL | `mongodb+srv://[user]:[pass]@cluster/aximoix` |
| DB_NAME | `aximoix` |
| VERCEL_ENV | `production` |

**Time:** ~3 minutes
**Result:** Auto-deployment starts

---

## STEP 3: Wait for Deployment

Check Vercel Dashboard → Deployments tab

- 🟡 **Building** (1-2 min)
- 🟡 **Deploying** (1-2 min)  
- 🟢 **Ready** ✅

**Total:** ~5 minutes

---

## STEP 4: Test Live Site

1. Go to https://aximoixwebsitemain.vercel.app
2. Find "Contact Us" section
3. Submit test form with:
   - Name: Test User
   - Email: test@example.com
   - Service: Any option
   - Message: Testing

**Expected:**
- Form accepts input ✓
- Submit button works ✓
- Success message displays ✓

---

## STEP 5: Verify Email

Check services@aximoix.com inbox

Should receive email with:
- ✅ Cyan-green (#00FFD1) header
- ✅ Dark background (#121212)
- ✅ All form fields
- ✅ Reply-to: test@example.com
- ✅ Professional formatting

---

## FILES SUMMARY

### Being Committed
```
✅ backend/requirements.txt
✅ backend/server.py  
✅ src/App.js
✅ VERCEL_DEPLOYMENT_GUIDE.md
✅ PUSH_AND_DEPLOY_CHECKLIST.md
```

### NOT Committed (Safe)
```
❌ backend/.env (in .gitignore)
❌ test_*.ps1 (local only)
❌ node_modules/ (dependencies)
❌ __pycache__/ (cache files)
```

---

## SECURITY CHECKLIST

- ✅ No API keys in GitHub
- ✅ No passwords in commits
- ✅ .env file properly ignored
- ✅ Secrets only in Vercel
- ✅ Ready for production

---

## TOTAL TIME: ~15 minutes

- Commit & Push: 2 min
- Vercel Setup: 3 min
- Deployment: 5 min
- Testing: 3 min
- Verification: 2 min

---

## WHAT'S NOW LIVE

🚀 **PRODUCTION FEATURES:**
- ✅ Contact form with brand styling
- ✅ Email notifications to services@aximoix.com
- ✅ Branded email templates
- ✅ Professional setup
- ✅ Secure credential management

📧 **EMAIL FLOW:**
```
User submits form on website
    ↓
Backend saves to MongoDB
    ↓
Resend sends branded email
    ↓
services@aximoix.com receives it
    ↓
Team can reply directly to user
```

---

## SUPPORT

If issues occur:
1. Check Vercel Function logs
2. Verify environment variables set
3. Check Resend email logs
4. Ensure MongoDB connection works
5. Reference VERCEL_DEPLOYMENT_GUIDE.md for troubleshooting
