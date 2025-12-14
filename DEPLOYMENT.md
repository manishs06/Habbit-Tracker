# Deployment Guide

This guide will help you deploy the Excel Manager MERN application to production.

## Prerequisites

- MongoDB Atlas account (or MongoDB instance)
- Vercel/Netlify account (for frontend)
- Render/Railway/AWS account (for backend)
- Git repository

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Test the build locally:
   ```bash
   npm run preview
   ```

### Step 2: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd client
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-api.railway.app/api`)

### Alternative: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   cd client
   npm run build
   netlify deploy --prod
   ```

3. Set environment variables in Netlify dashboard

## Backend Deployment (Railway)

### Step 1: Prepare Backend

1. Ensure all dependencies are in `package.json`
2. Create `railway.json` (optional):
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

### Step 2: Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Connect your Git repository
4. Add MongoDB service (or use MongoDB Atlas)
5. Set environment variables:
   - `PORT`: 5000 (or Railway will assign)
   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Strong random secret
   - `JWT_EXPIRE`: 7d
   - `MAX_FILE_SIZE`: 10485760
   - `CLIENT_URL`: Your frontend URL (e.g., `https://your-app.vercel.app`)

6. Deploy

### Alternative: Deploy to Render

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
5. Set environment variables (same as Railway)
6. Deploy

### Alternative: Deploy to AWS EC2

1. Launch EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies:
   ```bash
   cd server
   npm install --production
   ```
5. Set up PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```
6. Configure environment variables
7. Set up Nginx reverse proxy (optional)

## MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update `MONGODB_URI` in backend environment variables

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/excel-manager
JWT_SECRET=your_very_strong_secret_key_here
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app/api
```

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is connected to backend API
- [ ] MongoDB connection is working
- [ ] File uploads are working
- [ ] Authentication is working
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] SSL/HTTPS is enabled
- [ ] Error logging is set up
- [ ] File storage is configured (local or S3)

## Monitoring

### Backend Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Set up uptime monitoring
- Log file uploads and errors

### Frontend Monitoring

- Set up analytics (Google Analytics, Plausible)
- Monitor page load times
- Track user interactions
- Set up error boundaries

## Scaling Considerations

1. **File Storage**: Consider AWS S3 for file storage
2. **Database**: Use MongoDB Atlas for managed database
3. **Caching**: Implement Redis for session management
4. **CDN**: Use CloudFront or Cloudflare for static assets
5. **Load Balancing**: Use multiple backend instances

## Security Checklist

- [ ] JWT secret is strong and unique
- [ ] MongoDB connection uses authentication
- [ ] CORS is configured for specific domains
- [ ] File upload size limits are enforced
- [ ] Input validation is in place
- [ ] HTTPS is enabled
- [ ] Environment variables are secure
- [ ] Rate limiting is configured
- [ ] Error messages don't expose sensitive info

## Troubleshooting

### Backend not starting
- Check environment variables
- Verify MongoDB connection
- Check logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS configuration
- Verify backend is running

### File uploads failing
- Check file size limits
- Verify upload directory permissions
- Check disk space

## Support

For deployment issues, check:
- Platform-specific documentation
- Application logs
- Network connectivity
- Environment variable configuration

