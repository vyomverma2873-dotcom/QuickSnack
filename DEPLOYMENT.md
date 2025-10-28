# QuickSnack Deployment Guide

This guide covers deploying QuickSnack to Render, a modern cloud platform for hosting web applications.

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account with QuickSnack repository
- Render account (free tier available)
- MongoDB Atlas cluster (already configured)

### Option 1: One-Click Deploy (Recommended)

1. **Fork/Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd QuickSnack
   git push origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the `render.yaml` file
   - Click "Apply"

### Option 2: Manual Service Creation

#### Backend Service
1. **Create Web Service**
   - Name: `quicksnack-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=auto-assigned
   MONGO_URI=mongodb+srv://QuickSnack:QuickSnack%4037@quicksnack.wmea4h4.mongodb.net/?retryWrites=true&w=majority&appName=QuickSnack
   JWT_SECRET=your-secure-random-string-here
   JWT_EXPIRES_IN=7d
   EMAIL_USER=vyomverma2873@gmail.com
   RESEND_API_KEY=your_resend_api_key_here
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

#### Frontend Service
1. **Create Web Service**
   - Name: `quicksnack-frontend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: `frontend`

2. **Environment Variables**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
   ```

## 🔧 Configuration Details

### Backend Configuration

**Package.json Scripts**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Server.js Port Configuration**:
```javascript
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`QuickSnack server running on port ${PORT}`);
});
```

### Frontend Configuration

**Package.json Scripts**:
```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000"
  }
}
```

**Next.js Configuration**:
```javascript
// next.config.js
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  }
}
```

## 🗄️ Database Setup

### MongoDB Atlas Configuration
1. **Whitelist Render IPs**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allow all)
   - Or add specific Render IP ranges

2. **Connection String**
   ```
   mongodb+srv://QuickSnack:QuickSnack%4037@quicksnack.wmea4h4.mongodb.net/?retryWrites=true&w=majority&appName=QuickSnack
   ```

### Database Collections
The app will automatically create these collections:
- `users` - User accounts and addresses
- `orders` - Order history and details
- `otps` - Temporary OTP storage (auto-expires)

## 📧 Email Configuration

### Resend API Setup
1. **Sign up for Resend**: https://resend.com
2. **Generate API Key**:
   - Go to API Keys section
   - Create new API key
3. **Use API Key** in RESEND_API_KEY environment variable

### Email Settings
```env
EMAIL_USER=vyomverma2873@gmail.com
RESEND_API_KEY=your_resend_api_key_here
```

## 🔐 Security Considerations

### Environment Variables
- **Never commit** `.env` files to version control
- **Use strong JWT secrets** (minimum 32 characters)
- **Rotate secrets** regularly in production
- **Limit CORS origins** to your frontend domain

### Production Security Checklist
- [ ] Strong JWT secret configured
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Gmail app password (not regular password)
- [ ] HTTPS enforced (automatic on Render)
- [ ] Rate limiting enabled
- [ ] Input validation implemented

## 🚀 Deployment Steps

### 1. Prepare Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy Backend First
1. Create backend service on Render
2. Add all environment variables
3. Wait for successful deployment
4. Note the backend URL

### 3. Deploy Frontend
1. Create frontend service on Render
2. Add NEXT_PUBLIC_API_BASE_URL with backend URL
3. Wait for successful deployment
4. Update backend FRONTEND_URL with frontend URL

### 4. Test Deployment
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Email OTP delivery works
- [ ] Login functionality works
- [ ] Cart operations work
- [ ] Order placement works
- [ ] Email confirmations sent

## 🐛 Troubleshooting

### Common Issues

**Backend Won't Start**:
- Check environment variables are set
- Verify MongoDB connection string
- Check server logs for specific errors

**Frontend Build Fails**:
- Ensure all dependencies are in package.json
- Check for TypeScript errors
- Verify API URL is correctly set

**Email Not Sending**:
- Verify Resend API key is correct
- Check Resend dashboard for delivery status
- Ensure API key has proper permissions

**Database Connection Issues**:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has proper permissions

### Render-Specific Issues

**Service Won't Deploy**:
- Check build logs in Render dashboard
- Verify package.json scripts
- Ensure correct Node.js version

**Environment Variables Not Working**:
- Check variable names match exactly
- Restart service after adding variables
- Verify no extra spaces in values

## 📊 Monitoring & Logs

### Render Dashboard
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and request metrics
- **Events**: Deployment and service events

### Application Monitoring
- **Health Check**: `/api/health` endpoint
- **Error Tracking**: Console logs in Render
- **Performance**: Built-in Render metrics

## 🔄 Updates & Maintenance

### Deploying Updates
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

2. **Auto-Deploy**: Render automatically deploys from main branch

### Manual Redeploy
- Go to Render Dashboard
- Select service
- Click "Manual Deploy" → "Deploy latest commit"

### Database Maintenance
- **Backups**: MongoDB Atlas automatic backups
- **Monitoring**: Atlas monitoring dashboard
- **Scaling**: Upgrade Atlas cluster as needed

## 💰 Cost Optimization

### Render Free Tier
- **Web Services**: 750 hours/month free
- **Databases**: PostgreSQL free tier (not used)
- **Bandwidth**: 100GB/month free

### MongoDB Atlas Free Tier
- **Storage**: 512MB free
- **Connections**: Shared cluster
- **Bandwidth**: Limited but sufficient for development

### Production Scaling
- **Render**: Upgrade to paid plans for production
- **MongoDB**: Upgrade to dedicated clusters
- **CDN**: Consider Cloudflare for static assets

## 📞 Support

### QuickSnack Support
- **Developer**: Vyom Verma
- **Email**: vyomverma2873@gmail.com
- **Phone**: 8766355495

### Platform Support
- **Render**: [Render Documentation](https://render.com/docs)
- **MongoDB Atlas**: [Atlas Documentation](https://docs.atlas.mongodb.com/)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)

---

**Happy Deploying!** 🚀

Your QuickSnack application will be live and ready to serve customers with fast grocery and snack delivery!
