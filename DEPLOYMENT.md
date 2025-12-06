# Vault - Deployment Guide

This guide covers multiple deployment options for your Vault personal finance tracker application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
   - [Option 1: Vercel (Frontend) + Render (Backend)](#option-1-vercel--render-recommended)
   - [Option 2: Railway (Full Stack)](#option-2-railway-full-stack)
   - [Option 3: DigitalOcean/AWS/Azure](#option-3-digitaloceanawsazure)
4. [Database Setup](#database-setup)
5. [Post-Deployment](#post-deployment)

---

## Prerequisites

- Git installed and repository pushed to GitHub/GitLab
- MongoDB Atlas account (free tier available)
- Node.js 18+ installed locally for testing

---

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` folder with:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# CORS (your frontend URL)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` folder with:

```env
VITE_API_URL=https://your-backend-domain.com
```

---

## Deployment Options

### Option 1: Vercel + Render (Recommended)

This is the easiest and most cost-effective option for getting started.

#### Step 1: Deploy Backend to Render

1. **Sign up at [Render.com](https://render.com)**

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `vault-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all variables from your backend `.env` file
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://vault-backend.onrender.com`)

#### Step 2: Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-render-backend-url.onrender.com`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

5. **Update Backend CORS**
   - Go back to Render
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend

---

### Option 2: Railway (Full Stack)

Railway allows you to deploy both frontend and backend in one place.

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Deploy Backend**
   - Railway will auto-detect your backend
   - Add environment variables in the "Variables" tab
   - Set root directory to `backend` if needed
   - Deploy

4. **Deploy Frontend**
   - Click "New" → "GitHub Repo" (same repo)
   - Set root directory to `frontend`
   - Add `VITE_API_URL` environment variable
   - Deploy

5. **Generate Domains**
   - Click "Settings" → "Generate Domain" for both services
   - Update CORS settings accordingly

---

### Option 3: DigitalOcean/AWS/Azure

For production-grade deployment with more control.

#### Using DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean → Apps → Create App
   - Connect GitHub repository

2. **Configure Backend**
   - Type: Web Service
   - Source Directory: `backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 5000

3. **Configure Frontend**
   - Type: Static Site
   - Source Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables** for both services

5. **Deploy**

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**

2. **Create a Cluster**
   - Choose Free Tier (M0)
   - Select a region close to your backend server
   - Create cluster (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Add new user with password
   - Save credentials securely

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add your deployment platform's IP addresses

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add to your backend environment variables as `MONGODB_URI`

6. **Seed Initial Data**
   - After first deployment, run seed scripts:
   ```bash
   # SSH into your backend server or use Railway/Render shell
   npm run seed
   npm run seed:demo  # Optional: creates demo user
   ```

---

## Post-Deployment

### 1. Update API Configuration

Update `frontend/src/services/api.js` to use environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 2. Test Your Deployment

- Visit your frontend URL
- Try registering a new user
- Test login functionality
- Upload a transaction file
- Check all features work

### 3. Set Up Custom Domain (Optional)

#### Vercel
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

#### Render
- Go to Settings → Custom Domain
- Add your domain
- Update DNS records

### 4. Enable HTTPS

Both Vercel and Render provide automatic HTTPS certificates. Ensure:
- Your backend URL uses `https://`
- Update CORS settings to allow your HTTPS frontend

### 5. Monitor Your Application

- **Vercel**: Built-in analytics and logs
- **Render**: Check logs in the dashboard
- **MongoDB Atlas**: Monitor database performance

### 6. Set Up Continuous Deployment

Both platforms support automatic deployments:
- Push to `main` branch → Auto-deploy
- Configure branch-specific deployments if needed

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend domain exactly
- Check backend CORS configuration in `server.js`

### Database Connection Issues
- Verify MongoDB connection string is correct
- Check Network Access settings in MongoDB Atlas
- Ensure IP whitelist includes `0.0.0.0/0` or your server IPs

### Build Failures
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Not Responding
- Check backend logs for errors
- Verify environment variables are set correctly
- Test backend health endpoint: `https://your-backend-url/health`

---

## Cost Estimates

### Free Tier (Recommended for Starting)
- **Vercel**: Free (hobby plan)
- **Render**: Free (with sleep after inactivity)
- **MongoDB Atlas**: Free (M0 cluster, 512MB)
- **Total**: $0/month

### Paid Tier (For Production)
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **MongoDB Atlas M10**: $0.08/hour (~$57/month)
- **Total**: ~$84/month

---

## Security Checklist

- [ ] Change default JWT_SECRET to a strong random string
- [ ] Enable HTTPS on all endpoints
- [ ] Set up proper CORS origins (not `*`)
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting (optional)
- [ ] Regular security updates for dependencies

---

## Quick Start Commands

```bash
# Build frontend locally
cd frontend
npm run build

# Test backend locally
cd backend
npm start

# Run both locally
# Terminal 1:
cd backend && npm start

# Terminal 2:
cd frontend && npm run dev
```

---

## Support

For issues or questions:
1. Check deployment platform documentation
2. Review application logs
3. Test locally first to isolate issues
4. Check MongoDB Atlas connection

Good luck with your deployment! 🚀
