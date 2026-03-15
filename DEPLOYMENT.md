# Deployment Guide

## 📋 Pre-deployment Checklist

### 1. Environment Setup
- [ ] MongoDB Atlas cluster created and configured
- [ ] Cloudinary account set up
- [ ] Razorpay account configured
- [ ] GitHub repository created

### 2. Code Preparation
- [ ] All environment variables configured
- [ ] CORS origins updated for production
- [ ] Build scripts tested locally
- [ ] .gitignore properly configured

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Add remote repository
git remote add origin https://github.com/yourusername/vastra-ecommerce.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. **Create Render Account**: Go to [render.com](https://render.com)

2. **Connect GitHub**: Link your GitHub account

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure settings:
     - **Name**: `vastra-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET_KEY=your_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_password
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**: Click "Create Web Service"

### Step 3: Deploy Frontend on Vercel

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.render.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   VITE_FIREBASE_APIKEY=your_firebase_key
   ```

5. **Deploy**: Click "Deploy"

### Step 4: Deploy Admin Panel on Vercel

1. **Create New Project** in Vercel

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.render.com
   ```

4. **Deploy**: Click "Deploy"

## 🔧 Post-Deployment Configuration

### Update CORS Origins
After getting your Vercel URLs, update backend CORS configuration:

```javascript
// In backend/index.js
app.use(cors({
  origin: [
    "https://your-frontend.vercel.app",
    "https://your-admin.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}))
```

### Test Deployment
1. **Backend Health Check**: Visit `https://your-backend.render.com/api/product/list`
2. **Frontend**: Visit your Vercel frontend URL
3. **Admin Panel**: Visit your Vercel admin URL
4. **Test Features**:
   - User registration/login
   - Product browsing
   - Cart functionality
   - Admin login and product management

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure frontend URLs are added to backend CORS configuration
   - Check environment variables are set correctly

2. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

3. **Database Connection**:
   - Verify MongoDB Atlas IP whitelist (use 0.0.0.0/0 for all IPs)
   - Check MongoDB URI format and credentials

4. **Environment Variables**:
   - Ensure all required variables are set in deployment platforms
   - Check variable names match exactly (case-sensitive)

### Logs and Debugging
- **Render**: Check logs in Render dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **MongoDB**: Check Atlas logs for connection issues

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:
- **Render**: Auto-deploys on push to main branch
- **Vercel**: Auto-deploys on push to main branch

To disable auto-deployment, configure branch settings in respective dashboards.

## 📊 Monitoring

### Performance Monitoring
- Use Vercel Analytics for frontend performance
- Monitor Render metrics for backend performance
- Set up MongoDB Atlas monitoring

### Error Tracking
- Implement error logging in production
- Set up alerts for critical errors
- Monitor API response times

## 🔐 Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS properly configured
- [ ] JWT secrets are strong and unique
- [ ] Database access restricted
- [ ] API rate limiting implemented (if needed)

## 📈 Scaling Considerations

### Backend Scaling (Render)
- Monitor CPU and memory usage
- Consider upgrading to paid plans for better performance
- Implement caching strategies

### Frontend Scaling (Vercel)
- Vercel automatically handles CDN and scaling
- Optimize images and assets
- Implement code splitting

### Database Scaling (MongoDB Atlas)
- Monitor database performance
- Consider upgrading cluster tier
- Implement database indexing