# 🔧 Fix Gmail Authentication Error

## ❌ Current Error
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

This means Gmail is rejecting the credentials.

---

## ✅ Solution Steps

### Step 1: Verify 2-Factor Authentication is Enabled

1. Go to: https://myaccount.google.com/security
2. Sign in with: **officialvyom@gmail.com**
3. Look for "2-Step Verification"
4. **It MUST be turned ON** to generate app passwords

If it's OFF:
- Click "2-Step Verification"
- Follow the setup process
- Add your phone number
- Complete verification

---

### Step 2: Generate a NEW App Password

**IMPORTANT:** You must generate a fresh app password!

1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords

2. Sign in with: **officialvyom@gmail.com**

3. Click "Select app" → Choose "Mail" or "Other (Custom name)"
   - If choosing "Other", type: **QuickSnack**

4. Click "Select device" → Choose "Other (Custom name)"
   - Type: **QuickSnack Backend**

5. Click "Generate"

6. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   - **IMPORTANT:** Copy it EXACTLY as shown (with or without spaces)

7. **DO NOT close the window** until you've saved it!

---

### Step 3: Update .env File

Open: `/Users/prakritiverma/Desktop/QuickSnack/backend/.env`

Update the EMAIL_PASS line with the NEW password (remove all spaces):

```env
EMAIL_PASS=abcdefghijklmnop
```

**Example:**
- If Google shows: `abcd efgh ijkl mnop`
- You should write: `EMAIL_PASS=abcdefghijklmnop`

---

### Step 4: Test Again

```bash
cd backend
node test-nodemailer.js
```

**Expected output:**
```
✅ Email sent successfully!
   Message ID: <xxxxx@gmail.com>
```

---

## 🔍 Alternative: Check Gmail Settings

### Option 1: Enable IMAP (Required for SMTP)

1. Go to: https://mail.google.com/mail/u/0/#settings/fwdandpop
2. Sign in with: **officialvyom@gmail.com**
3. Click "Forwarding and POP/IMAP" tab
4. Under "IMAP access", select **"Enable IMAP"**
5. Click "Save Changes"

### Option 2: Check "Less secure app access" (Usually not needed)

**Note:** This is deprecated by Google, but check just in case:

1. Go to: https://myaccount.google.com/lesssecureapps
2. If it shows a toggle, turn it ON
3. **However**, with 2FA + App Password, this should NOT be needed

---

## 🔐 Security Checklist

For officialvyom@gmail.com:

- [ ] 2-Factor Authentication is **ENABLED**
- [ ] App Password is **GENERATED** (fresh one)
- [ ] IMAP is **ENABLED** in Gmail settings
- [ ] App Password is **16 characters** (no spaces in .env)
- [ ] No typos in EMAIL_USER or EMAIL_PASS

---

## 📝 Quick Reference

**Current Settings:**
```env
EMAIL_USER=officialvyom@gmail.com
EMAIL_PASS=elqfbdpgobggfhrz  ← This might be wrong!
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**What to do:**
1. Generate NEW app password from Google
2. Replace `elqfbdpgobggfhrz` with the new password
3. Remove ALL spaces from the password
4. Test again

---

## 🆘 Still Not Working?

### Try These:

1. **Use a different Gmail account**
   - Create a new Gmail account specifically for QuickSnack
   - Enable 2FA immediately
   - Generate app password
   - Update .env with new credentials

2. **Check Google Account Activity**
   - Go to: https://myaccount.google.com/notifications
   - Look for "Suspicious activity" or "Sign-in blocked"
   - If found, approve the activity

3. **Wait 10-15 minutes**
   - Sometimes Google takes time to activate new app passwords
   - Try again after waiting

4. **Revoke and regenerate**
   - Go to: https://myaccount.google.com/apppasswords
   - Revoke the old QuickSnack password
   - Generate a completely new one
   - Update .env

---

## ✅ Once Fixed

After you get it working:

1. **Update render.yaml:**
   ```yaml
   - key: EMAIL_PASS
     value: your-new-app-password-here
   ```

2. **Update Render Dashboard:**
   - Go to Render → quicksnack-backend → Environment
   - Update EMAIL_PASS with the new password
   - Save and redeploy

3. **Test in production:**
   - Deploy to Render
   - Test signup, orders, admin updates

---

## 📞 Need Help?

**Common Issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Username and Password not accepted" | Wrong password or 2FA not enabled | Generate new app password |
| "Less secure app" | Old Gmail security | Enable 2FA + use app password |
| "IMAP disabled" | IMAP not enabled | Enable IMAP in Gmail settings |
| "Connection timeout" | Firewall/network | Check SMTP_HOST and SMTP_PORT |

---

**Let me know the new app password once you generate it, and I'll update the .env file!** 🔑
