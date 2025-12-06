# Vault - Deployment URLs & Configuration

## 🌐 Deployed URLs

### Backend
**URL:** https://vault-finance-backend.vercel.app

**Health Check:** https://vault-finance-backend.vercel.app/health

### Frontend
**URL:** (To be deployed)

---

## 🔧 Environment Variables Configuration

### Backend Environment Variables (Vercel)

Set these in your Vercel backend project settings:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://mvhatkar:Coke05float@cluster0.4cenanj.mongodb.net/vault?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=jx7GOkjDeLGELeBnEMw028Z8mlLqxPFQTtXz6rNxX5C
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**⚠️ IMPORTANT:** Update `FRONTEND_URL` after deploying your frontend!

### Frontend Environment Variables (Vercel)

Set these in your Vercel frontend project settings:

```env
VITE_API_URL=https://vault-finance-backend.vercel.app
```

---

## 📋 Deployment Checklist

### ✅ Backend (Completed)
- [x] Deployed to Vercel
- [x] MongoDB Atlas connected
- [x] Database seeded with category rules
- [x] Demo user created
- [x] Health endpoint working
- [ ] FRONTEND_URL environment variable (update after frontend deploy)

### 🔄 Frontend (Next Steps)
- [ ] Deploy to Vercel
- [ ] Add VITE_API_URL environment variable
- [ ] Test registration/login
- [ ] Update backend FRONTEND_URL with frontend URL
- [ ] Test all features

---

## 🧪 Testing Your Backend

### Test Health Endpoint
```bash
curl https://vault-finance-backend.vercel.app/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test Registration
```bash
curl -X POST https://vault-finance-backend.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Login with Demo User
```bash
curl -X POST https://vault-finance-backend.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vault.com","password":"demo123"}'
```

---

## 🔐 Demo User Credentials

```
Email: demo@vault.com
Password: demo123
```

This account has:
- 39 sample transactions
- 1 budget for current month
- 4 subscriptions
- 4 portfolio investments

---

## 📊 Database Information

**Database Name:** vault

**Collections:**
- `vaultusers` - User accounts
- `transactions` - Financial transactions
- `budgets` - Monthly budgets
- `subscriptions` - Recurring subscriptions
- `portfolios` - Investment portfolio
- `categoryrules` - Auto-categorization rules (113 rules)

---

## 🚀 Next Steps

1. **Deploy Frontend to Vercel:**
   - Go to Vercel dashboard
   - Import your GitHub repository
   - Set Root Directory: `frontend`
   - Framework: Vite
   - Add environment variable: `VITE_API_URL=https://vault-finance-backend.vercel.app`
   - Deploy

2. **Update Backend CORS:**
   - Go to Vercel backend project
   - Settings → Environment Variables
   - Update `FRONTEND_URL` with your frontend URL
   - Redeploy backend

3. **Test Your App:**
   - Visit your frontend URL
   - Try logging in with demo credentials
   - Test all features

---

## 🆘 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- No trailing slash in URLs
- Redeploy backend after changing environment variables

### API Connection Issues
- Check `VITE_API_URL` is set correctly in frontend
- Test backend health endpoint
- Check browser console for errors

### Database Issues
- Verify MongoDB Atlas connection string
- Check Network Access allows connections from anywhere (0.0.0.0/0)
- Ensure database user has read/write permissions

---

## 📝 Important Notes

- Backend URL: `https://vault-finance-backend.vercel.app` (no trailing slash)
- Always use HTTPS in production
- Keep JWT_SECRET secure and never commit to git
- MongoDB Atlas free tier has 512MB storage limit
- Vercel free tier may have cold starts (first request slower)

---

**Last Updated:** December 2024
