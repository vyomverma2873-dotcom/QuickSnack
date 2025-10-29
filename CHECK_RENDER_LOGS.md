# 🔍 Check Render Logs for Email Errors

## 🚨 Issues Found in Your Render Config

Looking at your screenshots, I see:

1. ✅ EMAIL_USER: `vyomverma2873@gmail.com` - Correct
2. ✅ EMAIL_PASS: `qwlkaatwfvwfipxq` - Looks correct
3. ✅ SMTP_HOST: `smtp.gmail.com` - Correct
4. ✅ SMTP_PORT: `587` - Correct
5. ⚠️ NODE_ENV: `development` - **Should be `production`!**

---

## 🔧 Fix NODE_ENV

### Update in Render Dashboard:

1. Find `NODE_ENV` variable
2. Change from: `development`
3. Change to: `production`
4. Click "Save Changes"

---

## 🔍 Check Render Logs

### Step 1: Go to Logs Tab

1. In Render Dashboard
2. Click on "Logs" in the left sidebar
3. Look for recent logs

### Step 2: Look for These Messages

**Success messages (what you WANT to see):**
```
✅ Email server is ready to send messages
✅ Connected to MongoDB Atlas
✅ QuickSnack server running on 0.0.0.0:10000
```

**When someone tries to login/signup:**
```
📧 Attempting to send email to: user@example.com
   Subject: Your QuickSnack OTP
   From: vyomverma2873@gmail.com
✅ Email sent successfully via Nodemailer!
   Message ID: <xxxxx@gmail.com>
   Response: 250 2.0.0 OK
```

**Error messages (what might be happening):**
```
❌ Email transporter verification failed
❌ Nodemailer email sending failed
❌ Invalid login: 535-5.7.8 Username and Password not accepted
❌ Authentication failed
```

---

## 🧪 Test Production Backend Directly

### Test the email endpoint:

```bash
curl -X POST https://quicksnack-final-backend.onrender.com/api/debug/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"vyomverma2873@gmail.com"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Email test completed",
  "emailResult": {
    "success": true,
    "messageId": "<xxxxx@gmail.com>"
  }
}
```

**If it fails:**
```json
{
  "success": false,
  "error": "Authentication failed"
}
```

---

## 🔍 Common Issues

### Issue 1: Authentication Failed

**Logs show:**
```
❌ Invalid login: 535-5.7.8 Username and Password not accepted
```

**Possible causes:**
1. App password is incorrect
2. Spaces in the password
3. 2FA not enabled on Gmail
4. IMAP not enabled

**Solution:**
1. Generate a NEW app password from Google
2. Update EMAIL_PASS in Render
3. Make sure no spaces in the password

### Issue 2: Email Server Not Ready

**Logs show:**
```
❌ Email transporter verification failed
```

**Possible causes:**
1. SMTP_HOST or SMTP_PORT incorrect
2. EMAIL_USER or EMAIL_PASS missing
3. Network/firewall issues

**Solution:**
1. Verify all SMTP settings
2. Check all environment variables are set
3. Redeploy

### Issue 3: Emails Sent But Not Received

**Logs show:**
```
✅ Email sent successfully
```

**But you don't receive emails**

**Possible causes:**
1. Emails going to spam
2. Gmail blocking/filtering
3. Email address typo

**Solution:**
1. Check spam folder thoroughly
2. Check "All Mail" in Gmail
3. Try different email addresses
4. Check Gmail "Sent" folder of vyomverma2873@gmail.com

---

## 📋 Verification Checklist

### Environment Variables:
- [ ] EMAIL_USER = `vyomverma2873@gmail.com`
- [ ] EMAIL_PASS = `qwlkaatwfvwfipxq` (no spaces)
- [ ] SMTP_HOST = `smtp.gmail.com`
- [ ] SMTP_PORT = `587`
- [ ] NODE_ENV = `production` ⚠️ **Fix this!**

### Gmail Account (vyomverma2873@gmail.com):
- [ ] 2FA is enabled
- [ ] App password is active and correct
- [ ] IMAP is enabled
- [ ] No security blocks

### Render Service:
- [ ] Status shows "Live" (green)
- [ ] No errors in logs
- [ ] "Email server is ready" message appears
- [ ] Recent deployment successful

---

## 🔧 Quick Fix Steps

### 1. Update NODE_ENV
```
NODE_ENV=production
```

### 2. Verify Email Password

The password should be exactly:
```
qwlkaatwfvwfipxq
```

No spaces, no special characters, just those 16 characters.

### 3. Check Logs After Save

After saving changes:
1. Wait for redeploy (2-3 minutes)
2. Check logs for "Email server is ready"
3. Test login on Vercel app
4. Check logs for "Email sent successfully"

---

## 🆘 If Still Not Working

### Generate a NEW App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: vyomverma2873@gmail.com
3. Create new app password for "QuickSnack"
4. Copy the 16-character password
5. Update EMAIL_PASS in Render
6. Remove all spaces from password
7. Save and redeploy

---

## 📞 Debug Commands

### Check if backend is responding:
```bash
curl https://quicksnack-final-backend.onrender.com/api/health
```

### Test email directly:
```bash
curl -X POST https://quicksnack-final-backend.onrender.com/api/debug/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"vyomverma2873@gmail.com"}'
```

### Check login endpoint:
```bash
curl -X POST https://quicksnack-final-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## ✅ What to Do Now

1. **Fix NODE_ENV to `production`**
2. **Check Render logs** for specific errors
3. **Test the debug endpoint** to see if emails work
4. **If authentication fails**, generate new app password
5. **Check spam folder** of the email you're testing with

---

**Go check the Render logs NOW - they will tell you exactly what's wrong!** 🔍
