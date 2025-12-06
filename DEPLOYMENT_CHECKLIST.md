# Deployment Checklist

Use this checklist to ensure a smooth deployment of your Vault application.

## Pre-Deployment

- [ ] All code is committed and pushed to GitHub/GitLab
- [ ] `.env` files are in `.gitignore` (never commit secrets!)
- [ ] Application runs successfully locally
- [ ] All tests pass (if you have tests)
- [ ] Dependencies are up to date

## Database Setup

- [ ] MongoDB Atlas account created
- [ ] Database cluster created (M0 free tier is fine)
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0 for cloud deployments)
- [ ] Connection string copied and saved securely

## Backend Deployment

- [ ] Platform chosen (Render/Railway/Vercel/etc.)
- [ ] Repository connected to deployment platform
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables added:
  - [ ] `PORT=5000`
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=<your_connection_string>`
  - [ ] `JWT_SECRET=<strong_random_string>`
  - [ ] `FRONTEND_URL=<will_add_after_frontend_deploy>`
- [ ] Backend deployed successfully
- [ ] Backend URL copied (e.g., https://vault-backend.onrender.com)
- [ ] Health check endpoint tested: `https://your-backend-url/health`

## Frontend Deployment

- [ ] Platform chosen (Vercel/Netlify/Railway/etc.)
- [ ] Repository connected to deployment platform
- [ ] Root directory set to `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added:
  - [ ] `VITE_API_URL=<your_backend_url>`
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied (e.g., https://vault.vercel.app)

## Post-Deployment Configuration

- [ ] Update backend `FRONTEND_URL` environment variable with frontend URL
- [ ] Redeploy backend to apply CORS changes
- [ ] Test frontend can connect to backend
- [ ] Seed database with category rules:
  ```bash
  # In backend deployment shell/terminal
  npm run seed
  ```
- [ ] (Optional) Create demo user:
  ```bash
  npm run seed:demo
  ```

## Testing

- [ ] Visit frontend URL
- [ ] Register a new user account
- [ ] Login with new account
- [ ] Navigate through all pages
- [ ] Upload a sample transaction file
- [ ] Create a budget
- [ ] Add a subscription
- [ ] Add a portfolio investment
- [ ] Check dashboard displays data correctly
- [ ] Test logout and login again

## Optional Enhancements

- [ ] Set up custom domain for frontend
- [ ] Set up custom domain for backend
- [ ] Configure automatic deployments on git push
- [ ] Set up monitoring/logging
- [ ] Enable analytics (if desired)
- [ ] Set up backup strategy for database
- [ ] Configure rate limiting
- [ ] Add error tracking (e.g., Sentry)

## Security Checklist

- [ ] JWT_SECRET is a strong random string (not the default)
- [ ] HTTPS is enabled on both frontend and backend
- [ ] CORS is configured with specific origin (not `*`)
- [ ] MongoDB authentication is enabled
- [ ] Database user has minimal required permissions
- [ ] No sensitive data in git repository
- [ ] Environment variables are properly secured

## Troubleshooting

If something doesn't work:

1. **Check logs** on your deployment platform
2. **Verify environment variables** are set correctly
3. **Test backend health endpoint** directly
4. **Check CORS settings** match your frontend URL exactly
5. **Verify MongoDB connection** string is correct
6. **Test locally** to isolate deployment-specific issues

## Maintenance

- [ ] Set up calendar reminder to check for dependency updates
- [ ] Monitor database usage (MongoDB Atlas free tier has limits)
- [ ] Monitor deployment platform usage/costs
- [ ] Keep documentation updated

---

## Quick Reference

### Backend Health Check
```bash
curl https://your-backend-url/health
```

### Test Backend API
```bash
curl -X POST https://your-backend-url/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

### View Backend Logs
- **Render**: Dashboard → Logs tab
- **Railway**: Project → Deployments → View Logs
- **Vercel**: Project → Deployments → Function Logs

### Redeploy
- **Render**: Manual Deploy → Deploy latest commit
- **Railway**: Automatic on git push
- **Vercel**: Automatic on git push

---

**Congratulations!** 🎉 Your Vault application is now live!
