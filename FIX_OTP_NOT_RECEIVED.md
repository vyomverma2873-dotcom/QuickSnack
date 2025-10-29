# 🔧 Fix: OTP Not Received Issue

## 🔍 Problem Identified

Your console shows "OTP sent to your email" but you're not receiving it because:

1. ✅ **Backend is working** - Emails ARE being sent successfully
2. ✅ **Nodemailer is configured** - Gmail is accepting the emails
3. ❌ **Frontend is using PRODUCTION backend** - Not your local backend
4. ❌ **Production (Render) might not have updated environment variables**

---

## ✅ Solution: Test Locally First

### Step 1: Use Local Backend for Testing

I've created `.env.local` in your frontend folder:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Step 2: Restart Frontend

```bash
# Stop frontend if running (Ctrl+C)
cd frontend
npm run dev
```

### Step 3: Test Login/Signup

1. Go to: http://localhost:3000
2. Try to login or signup with **ANY email address**
3. Check that email's inbox (and spam folder!)
4. You should receive the OTP

---

## 🔍 Why It Wasn't Working

### Your Setup:
- **Frontend:** Using production backend (quicksnack-final-backend.onrender.com)
- **Production Backend:** Might not have updated EMAIL_PASS yet
- **Local Backend:** ✅ Working perfectly (as we tested)

### The Fix:
- **Test locally first** with `.env.local` pointing to localhost:4000
- **Then update Render** and test production

---

## 🚀 Update Production (Render)

### Go to Render Dashboard

1. **Open:** https://dashboard.render.com
2. **Select:** `quicksnack-backend`
3. **Click:** Environment tab

### Update These Variables:

```env
EMAIL_USER=vyomverma2873@gmail.com
EMAIL_PASS=qwlkaatwfvwfipxq
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Important Notes:
- ⚠️ **Remove all spaces** from EMAIL_PASS
- ⚠️ Make sure EMAIL_USER is exactly: `vyomverma2873@gmail.com`
- ⚠️ Delete `RESEND_API_KEY` if it exists

### Click "Save Changes"
- Render will redeploy (takes 2-5 minutes)
- Wait for "Live" status

---

## 🧪 Test Production After Render Update

### Step 1: Update Frontend to Use Production

```bash
# In frontend folder
rm .env.local  # Remove local config
# Now it will use .env.production (Render backend)
```

### Step 2: Restart Frontend

```bash
npm run dev
```

### Step 3: Test

1. Go to: http://localhost:3000
2. Try login/signup
3. Check email inbox

---

## 📧 Email Troubleshooting

### Check These Inboxes:

1. **The email you're trying to login with** (e.g., officialvyom@gmail.com)
2. **Check SPAM/JUNK folder** - Very important!
3. **Wait 1-2 minutes** - Sometimes Gmail delays emails

### Gmail Folders to Check:
- ✅ Inbox
- ✅ Spam/Junk
- ✅ All Mail
- ✅ Promotions (if using Gmail categories)

### Email Subject Lines to Look For:
- "Your QuickSnack OTP"
- "Reset Your QuickSnack Password"
- "Welcome to QuickSnack"

---

## 🔍 Verify Email is Being Sent

### Check Backend Logs

**Local Backend:**
```bash
# In backend terminal, you should see:
✅ Email sent successfully via Nodemailer!
   Message ID: <xxxxx@gmail.com>
   To: your-email@example.com
   Response: 250 2.0.0 OK
```

**Production (Render):**
1. Go to Render Dashboard
2. Click on `quicksnack-backend`
3. Click "Logs" tab
4. Look for the same success messages

---

## 📋 Quick Checklist

### Local Testing (Do This First!)
- [x] Backend running on localhost:4000
- [x] Frontend `.env.local` created (points to localhost:4000)
- [ ] Frontend restarted
- [ ] Test signup/login
- [ ] Check email inbox (and spam!)

### Production Testing (After Render Update)
- [ ] Render environment variables updated
- [ ] Render shows "Live" status
- [ ] Render logs show "Email server is ready"
- [ ] Frontend using production backend
- [ ] Test signup/login
- [ ] Check email inbox (and spam!)

---

## 🆘 Still Not Working?

### Debug Steps:

1. **Check which backend you're using:**
   ```bash
   # In frontend folder
   cat .env.local 2>/dev/null || cat .env.production
   ```

2. **Check backend logs:**
   - Local: Look at terminal where `npm run dev` is running
   - Production: Render Dashboard → Logs

3. **Test email directly:**
   ```bash
   curl -X POST http://localhost:4000/api/debug/test-email \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com"}'
   ```

4. **Check Gmail settings:**
   - Go to: https://mail.google.com/mail/u/0/#settings/fwdandpop
   - Verify IMAP is enabled
   - Check if emails are being filtered

---

## ✅ Expected Behavior

### When Everything Works:

1. **You enter email on login/signup**
2. **Backend sends OTP email** (logs show success)
3. **You receive email within 10-30 seconds**
4. **Email appears in inbox or spam**
5. **You enter OTP and verify**

### Email Content:
```
Subject: Your QuickSnack OTP

Your OTP is: 123456

This OTP is valid for 10 minutes.

Contact: vyomverma2873@gmail.com
```

---

## 🎯 Summary

**Problem:** Frontend using production backend, which might not have updated credentials  
**Solution:** Test locally first, then update production  

**Steps:**
1. ✅ Test with local backend (already set up)
2. ⏳ Update Render environment variables
3. ⏳ Test with production backend

---

**Start by testing locally - your local backend is working perfectly!** 🚀
