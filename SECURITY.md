# 🔒 Security & Deployment Guide

## Current Security Status

✅ **HTTPS Enabled** - All connections encrypted
✅ **Security Headers** - HSTS, CSP, XSS Protection
✅ **Input Validation** - Email, password, tokens verified
✅ **Password Hashing** - bcryptjs with 12 rounds
✅ **Rate Limiting** - API endpoints protected
✅ **CORS Configured** - Only allowed origins can access
✅ **JWT Authentication** - Secure token-based auth
✅ **Helmet.js** - Express security middleware

---

## Critical Configuration

### `.env` Variables (NEVER COMMIT)

```env
# MUST CHANGE BEFORE PRODUCTION
JWT_SECRET=YOUR_SUPER_SECRET_KEY_32_CHARACTERS_MINIMUM

# API Keys
GEMINI_API_KEY=your_actual_api_key

# CORS Origins (comma-separated)
CORS_ORIGIN=https://your-frontend.com,https://your-domain.com
```

### Important Settings

```env
NODE_ENV=production          # MUST be "production"
JWT_EXPIRES_IN=7d           # Token expiration
SESSION_TIMEOUT=1800000     # 30 minutes
RATE_LIMIT_MAX_REQUESTS=100 # Per minute
```

---

## 🔐 Production Deployment Checklist

### Frontend (Vercel)

- ✅ Custom domain added (https://learning-tutor.ml)
- ✅ Environment variables configured
- ✅ HTTPS enforced
- ✅ All API calls use HTTPS

### Backend (Render)

- ✅ Custom domain added
- ✅ Environment variables set
- ✅ HTTPS SSL certificate (auto)
- ✅ CORS_ORIGIN updated with all domains
- ⚠️ JWT_SECRET changed from default
- ⚠️ NODE_ENV = production

### Database (Render PostgreSQL)

- ✅ Password-protected
- ✅ Automatic backups
- ✅ Restricted access

---

## 🚨 Security Best Practices

### 1. Never Commit `.env` Files

✅ `.env` is in `.gitignore`
✅ Only set variables in Render/Vercel dashboards

### 2. Change Default JWT Secret

**Before deploying to production:**

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to Render Environment: `JWT_SECRET=<your-generated-key>`

### 3. Use Custom Domains

✅ Chrome trusts custom domains
✅ SSL certificates auto-issued
✅ Professional appearance

**Add domains in Render/Vercel settings**

### 4. Monitor Logs

Render Dashboard → Logs tab:

- Check for unauthorized access attempts
- Monitor error rates
- Review rate-limit hits

### 5. Keep Dependencies Updated

```bash
cd backend
npm audit
npm update
```

---

## 🛡️ Authentication Flow

```
User Login
    ↓
POST /api/auth/login (username, password)
    ↓
Verify password (bcryptjs)
    ↓
Generate JWT token (7 days expiry)
    ↓
Return token + user data
    ↓
Client stores in localStorage
    ↓
All API calls include Authorization header
    ↓
Server validates JWT before processing
```

---

## 🚨 Blocking Suspicious Activity

### Rate Limiting

- **API Endpoints:** 100 requests/minute
- **Chat Endpoint:** 15 requests/minute
- Auto-blocks IP if exceeded

### Input Validation

- Email regex validation
- Password length minimum (6 chars)
- Name required (non-empty)
- Special characters sanitized

### Token Validation

- JWT signature verified
- Expiration checked
- User permissions verified

---

## 📊 Security Headers Enabled

| Header                     | Purpose                |
| -------------------------- | ---------------------- |
| **HSTS**                   | Force HTTPS for 1 year |
| **X-Content-Type-Options** | Prevent MIME sniffing  |
| **X-Frame-Options**        | Prevent clickjacking   |
| **X-XSS-Protection**       | Stop XSS attacks       |
| **Referrer-Policy**        | Restrict referrer info |

---

## 🔑 First-Time Setup

### 1. Update JWT Secret

```
Render Dashboard
→ learning-tutor-api service
→ Environment tab
→ JWT_SECRET = <your-new-key>
→ Save (auto-redeploy)
```

### 2. Add Custom Domain

```
Render Dashboard
→ learning-tutor-api service
→ Settings tab
→ Custom Domain: learning-tutor.ml
→ Add DNS records from Freenom
```

### 3. Update CORS Origins

```
CORS_ORIGIN=https://learning-tutor.ml,https://learning-tutor-dusky.vercel.app
```

### 4. Test Everything

- ✅ Login works
- ✅ Video call works
- ✅ Chat works
- ✅ No HTTPS warnings
- ✅ No CORS errors

---

## 📝 Production URLs

| Service         | URL                           |
| --------------- | ----------------------------- |
| **Frontend**    | https://learning-tutor.ml     |
| **Backend API** | https://api.learning-tutor.ml |
| **Socket.io**   | https://api.learning-tutor.ml |

---

## 🐛 Troubleshooting

### Chrome "Dangerous Site" Warning

**Solution:** Use custom domain instead of Render's default

- Domains like `.onrender.com` are flagged
- Custom domains have proper SSL

### CORS Errors in Console

**Solution:** Update `CORS_ORIGIN` in Render .env

```
CORS_ORIGIN=https://your-frontend-domain,https://your-api-domain
```

### "Invalid Token" Errors

**Solution:** Check JWT_SECRET matches in all places

- `.env` local file
- Render environment variables
- Code is using process.env.JWT_SECRET

### Rate Limited (429 Errors)

**Solution:** Normal behavior - app is blocking spam

- Wait 1 minute
- Check if legitimate traffic pattern
- Adjust RATE_LIMIT_MAX_REQUESTS if needed

---

## 📞 Support

For security issues:

1. Check logs in Render dashboard
2. Verify environment variables
3. Clear browser cache and retry
4. Check browser console (F12) for errors

---

**Last Updated:** April 18, 2026
**Status:** ✅ Production Ready
