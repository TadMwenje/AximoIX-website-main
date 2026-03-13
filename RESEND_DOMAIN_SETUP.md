# Resend Email Setup: Industry-Standard Single Domain Approach

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR WEBSITE (React)                         │
│              Contact Form → services@aximoix.com                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND (FastAPI)                               │
│  POST /api/contact → Save to MongoDB + Send Notification      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   RESEND (Sending Service)           │
        │   FROM: noreply@aximoix.com          │
        │   TO: services@aximoix.com           │
        │   (Notify your team)                 │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   services@aximoix.com MAILBOX       │
        │   (Gmail, Outlook, or Mail Server)   │
        │                                      │
        │   Your team receives:                │
        │   1. Resend notification             │
        │   2. Can reply directly to client    │
        └──────────────────────────────────────┘
```

## Why This Architecture?

**Resend's Role**: Sending only (transactional emails)
- ✅ Sends contact form notifications to your team
- ✅ Professional sender domain (aximoix.com)
- ✅ Reliable delivery, spam filtering, tracking

**Your Email Provider's Role**: Receiving only
- ✅ services@aximoix.com receives Resend notifications
- ✅ Your team can reply directly to customers
- ✅ Backup inbox for customer archives

**NO conflicts** - Single domain, dual purpose!

---

## Step-by-Step Implementation

### Phase 1: Verify Domain in Resend (5-10 minutes)

**1. Add domain to Resend:**
- Go to https://resend.com/domains
- Click "Add Domain"
- Enter: `aximoix.com`

**2. Copy DNS records provided by Resend** (typically 3 records):
```
MX Record:      aximoix.com → feedback-smtp.aximoix.com
TXT Record:     default._domainkey.aximoix.com → [DKIM key]
CNAME Record:   bounce.aximoix.com → bounce.aximoix.com.resend.dev
```

**3. Add records to Cloudflare:**
- Go to https://dash.cloudflare.com
- Select aximoix.com domain
- DNS section
- Add each record exactly as shown

**4. Verify in Resend:**
- Click "Verify" button
- Wait 5-10 minutes (DNS propagation)
- Should show ✅ Verified

### Phase 2: Configure Backend (.env)

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_FROM=noreply@aximoix.com
CONTACT_EMAIL_TO=services@aximoix.com
MONGODB_URL=mongodb://localhost:27017/aximoix
DB_NAME=aximoix
VERCEL_ENV=development
```

### Phase 3: Set Up services@aximoix.com Mailbox

**Option A: Gmail (Simplest)**
1. Create Gmail account or add alias
2. Set up Gmail to receive mail at this address
3. Your team accesses it via Gmail inbox

**Option B: Outlook/Microsoft 365**
1. Add custom domain
2. Create services@aximoix.com mailbox
3. Access via Outlook

**Option C: Cloudflare Email Routing (Free)**
1. Go to Cloudflare Dashboard
2. Email section → Email Routing
3. Create rule: `services@aximoix.com` → your existing email
4. All emails forwarded automatically

**Recommended: Option C (Cloudflare Email Routing)**
- ✅ Free
- ✅ Integrates with Cloudflare (you already use it)
- ✅ No new account needed
- ✅ Forwards to your existing email

---

## How the Flow Works

### When Client Submits Contact Form:

1. **Frontend sends**: Name, Email, Message to Backend
2. **Backend saves** to MongoDB
3. **Backend sends via Resend**:
   ```
   From: noreply@aximoix.com ← Verified domain in Resend
   To: services@aximoix.com ← Your mailbox (Gmail/Outlook/Cloudflare)
   Subject: New Contact Form Submission from [Client Name]
   Body: Formatted HTML with client details
   Reply-To: [client_email] ← Your team can reply directly
   ```
4. **Email delivered** to services@aximoix.com inbox
5. **Your team replies** using Reply button → Goes directly to client ✅

### Email Content Example:

```
From: noreply@aximoix.com (AximoIX)
To: services@aximoix.com
Subject: New Contact Form Submission from John Doe
Date: March 13, 2026 2:30 PM

---

Name: John Doe
Email: john@client.com ← Click reply to respond directly!
Service Interest: Cloud Solutions
Message: I'm interested in your AI solutions...

---
Submitted: 2026-03-13 14:30:00 UTC
```

---

## Production Checklist

- [ ] Domain `aximoix.com` added to Resend
- [ ] DNS records added to Cloudflare
- [ ] Domain verified in Resend (✅ status)
- [ ] Backend .env updated: `CONTACT_EMAIL_FROM=noreply@aximoix.com`
- [ ] services@aximoix.com mailbox set up (Gmail/Outlook/Email Routing)
- [ ] Test contact form submission
- [ ] Verify email arrives at services@aximoix.com
- [ ] Test reply from services@aximoix.com → Client receives it

---

## Industry Standards Being Followed

✅ **Separate sending domain** - professional best practice
- Sending: `noreply@aximoix.com` (transactional)
- Team email: `services@aximoix.com` (general communication)

✅ **Reply-To header** - allows direct replies to customers
- Customers don't reply to noreply address
- Instead reply directly to submitter

✅ **SPF/DKIM/DMARC** - email authentication
- Managed by Resend automatically
- Improves deliverability

✅ **Single domain** - consistent branding
- Everything uses aximoix.com
- Professional appearance

---

## Troubleshooting

**Email not showing in services@aximoix.com inbox?**
- Wait 10-15 minutes for DNS propagation
- Check Resend dashboard for delivery logs
- Verify domain shows ✅ status in Resend

**Emails going to spam?**
- Wait 24 hours (new domains have lower reputation)
- Check Resend's "Email Log" for bounce reasons
- Verify SPF/DKIM records in Cloudflare

**Client can't reply directly?**
- Ensure `reply_to` header is set in backend
- Currently set to customer's email ✅

---

## Next Steps

1. **Follow Phase 1** to verify aximoix.com in Resend (takes 10 min)
2. **Follow Phase 3** to set up services@aximoix.com mailbox (takes 5 min)
3. **Update .env** with new CONTACT_EMAIL_FROM (takes 1 min)
4. **Test** with contact form submission

Ready? Let me know when you've added the domain to Resend, and I'll help with the Cloudflare setup!
