# Quick Deployment Guide

## 🚀 Recommended Stack (Easiest & Free Tier Available)

### 1. **Frontend → Vercel** (Free)
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Easy Git integration
- ✅ Fast CDN

### 2. **Backend → Railway** (Free $5 credit/month)
- ✅ Simple deployment
- ✅ Auto-detects Node.js
- ✅ Free tier available
- ✅ Easy environment variables

### 3. **Database → MongoDB Atlas** (Free 512MB)
- ✅ Free tier available
- ✅ Fully managed
- ✅ Easy setup

---

## 📋 Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account (or log in if you have one)
3. Click "Create" or "Build a Database"

4. **Select Cluster Tier:**
   - ✅ **Choose "Free" tier** (Free forever, 512 MB storage)
   - This is perfect for development and testing
   - You can upgrade later if needed

5. **Configure Your Cluster:**
   - **Name**: Keep `Cluster0` (or change if you prefer)
   - **Provider**: AWS (default is fine)
   - **Region**: 
     - Choose closest to you (e.g., Mumbai `ap-south-1` if you're in India)
     - Or select "Recommended" option
   - **Tag**: (Optional - skip for now)

6. **Quick Setup Options:**
   - ✅ **Enable "Automate security setup"** (Recommended)
     - This will help set up database user and IP whitelist automatically
   - ⬜ **Preload sample dataset**: Leave unchecked (not needed)

7. Click **"Create Cluster"**
   - Wait 3-5 minutes for cluster to be created

8. **Set Up Database Access** (if not automated):
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `excelmanager` (or your choice)
   - Password: Click "Autogenerate Secure Password" (save it!) or create your own
   - Database User Privileges: "Atlas admin" (default)
   - Click "Add User"

9. **Whitelist IP Address:**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" button (adds 0.0.0.0/0)
   - Or manually add: `0.0.0.0/0`
   - Click "Confirm"

10. **Get Connection String:**
    - Go back to "Database" (or click "Connect" on your cluster)
    - You'll see "Connect to Cluster0" screen
    - **Step 1**: Set up connection security (usually done automatically if you enabled "Automate security setup")
    - **Step 2**: Choose a connection method - You'll see these options:
      
      **✅ SELECT: "Connect your application" (Drivers icon)**
      - This is the option with the "Drivers" icon
      - Used for: Access your Atlas data using MongoDB's native drivers (e.g. Node.js, Go, etc.)
      
      ⬜ Other options (skip these):
      - Compass (GUI tool - not needed)
      - Shell (command line - not needed)
      - MongoDB for VS Code (optional, not needed)
      - Atlas SQL (not needed)
    
    - Click on **"Connect your application"** (Drivers option)
    - **Step 3**: You'll see connection details:
      - Choose **"Node.js"** as the driver
      - Choose version **"5.5 or later"** (or latest available)
      - You'll see a connection string like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
    
    - **Important Steps:**
      1. **Copy the connection string** (you'll see something like this):
         ```
         mongodb+srv://excelmanager:<db_password>@cluster0.mspp0ju.mongodb.net/?appName=Cluster0
         ```
      
      2. **Replace `<db_password>`** with your actual database password
         - This is the password you created when setting up the database user
         - Make sure there are no spaces or special characters that need encoding
      
      3. **Add database name** before the `?`:
         - Change: `cluster0.mspp0ju.mongodb.net/?appName=Cluster0`
         - To: `cluster0.mspp0ju.mongodb.net/excel-manager?appName=Cluster0`
         - Or use standard parameters: `cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority`
    
    - **Final format should be:**
      ```
      mongodb+srv://excelmanager:YOUR_ACTUAL_PASSWORD@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
      ```

**Example with your cluster:**
If your password is `MySecurePass123`, your connection string would be:
```
mongodb+srv://excelmanager:MySecurePass123@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
```

**⚠️ Important Notes:**
- Replace `YOUR_ACTUAL_PASSWORD` with the password you set for the `excelmanager` user
- The database name `/excel-manager` must be added before the `?`
- Keep `?retryWrites=true&w=majority` for best compatibility (or use `?appName=Cluster0` if you prefer)

**⚠️ Save this connection string securely! You'll need it for Railway deployment.**

#### 📸 Visual Guide - What You'll See:

**When creating cluster:**
- **M10** ($0.08/hour) - Skip this (paid tier)
- **Flex** (From $0.011/hour) - Skip this (paid tier)
- **Free** ✅ - **SELECT THIS ONE!**
  - Storage: 512 MB
  - RAM: Shared
  - vCPU: Shared
  - **Free forever!**

After selecting Free tier:
- Name: `Cluster0` (default, or change if you want)
- Provider: AWS (default)
- Region: Mumbai (ap-south-1) or your closest region
- ✅ Enable "Automate security setup"
- ⬜ Leave "Preload sample dataset" unchecked
- Click "Create Cluster"

**When connecting to cluster (Step 2 - Choose connection method):**
You'll see these 5 options:

1. **✅ Connect your application** (Drivers icon) 
   - Text: "Access your Atlas data using MongoDB's native drivers (e.g. Node.js, Go, etc.)"
   - **SELECT THIS ONE!**

2. ⬜ Compass (GUI tool)
   - Text: "Explore, modify, and visualize your data with MongoDB's GUI"
   - Skip this

3. ⬜ Shell (Command line)
   - Text: "Quickly add & update data using MongoDB's Javascript command-line interface"
   - Skip this

4. ⬜ MongoDB for VS Code
   - Text: "Work with your data in MongoDB directly from your VS Code environment"
   - Skip this

5. ⬜ Atlas SQL
   - Text: "Easily connect SQL tools to Atlas for data analysis and visualization"
   - Skip this

**Click on "Connect your application" (the first option with Drivers icon)**

---

### Step 2: Deploy Backend to Railway (10 minutes)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository: `manishs06/Habbit-Tracker`
6. Railway will auto-detect it's a Node.js app
7. **Configure the service:**
   - Root Directory: Set to `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

8. **Add Environment Variables:**
   Click on your service → Variables tab → Add these:

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   JWT_SECRET=generate_a_random_secret_key_here_min_32_chars
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=10485760
   CLIENT_URL=https://your-app-name.vercel.app
   ```

   **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

9. Railway will auto-deploy. Wait for it to finish.
10. **Get your backend URL:**
    - Click on your service → Settings → Generate Domain
    - Copy the URL (e.g., `https://excel-manager-production.up.railway.app`)
    - This is your backend URL

---

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository: `manishs06/Habbit-Tracker`
5. **Configure Project:**
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variable:**
   - Variable Name: `VITE_API_URL`
   - Value: Your Railway backend URL + `/api`
     - Example: `https://excel-manager-production.up.railway.app/api`

7. Click "Deploy"
8. Wait for deployment to complete
9. **Get your frontend URL:**
    - Vercel will give you a URL like: `https://habbit-tracker.vercel.app`
    - Copy this URL

---

### Step 4: Update Backend CORS (2 minutes)

1. Go back to Railway
2. Update the `CLIENT_URL` environment variable:
   - Change to your Vercel frontend URL
   - Example: `https://habbit-tracker.vercel.app`
3. Railway will auto-redeploy

---

### Step 5: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try registering a new user
3. Try uploading an Excel file
4. Check if everything works!

---

## 🎯 Alternative Options

### Frontend Alternatives:
- **Netlify**: Similar to Vercel, also free
- **GitHub Pages**: Free but requires build setup

### Backend Alternatives:
- **Render**: [render.com](https://render.com) - Free tier available
- **Fly.io**: [fly.io](https://fly.io) - Free tier available
- **Heroku**: Paid now, but still popular
- **AWS EC2**: More complex, but full control

### Database Alternatives:
- **MongoDB Atlas**: Recommended (what we used)
- **Railway MongoDB**: Can add MongoDB service in Railway
- **Self-hosted MongoDB**: More complex

---

## 💰 Cost Breakdown

### Free Tier:
- **Vercel**: Free (generous limits)
- **Railway**: $5 free credit/month (usually enough for small apps)
- **MongoDB Atlas**: Free 512MB (perfect for development)

### If you exceed free tier:
- Railway: ~$5-10/month
- Vercel: Still free for most use cases
- MongoDB Atlas: $9/month for next tier

**Total estimated cost: $0-15/month**

---

## 🔧 Troubleshooting

### Backend not connecting to MongoDB:
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify connection string has correct password
- Check database user permissions

### Frontend can't reach backend:
- Verify `VITE_API_URL` in Vercel matches Railway URL
- Check Railway `CLIENT_URL` matches Vercel URL
- Check CORS settings in backend

### File uploads not working:
- Check Railway disk space
- Verify `MAX_FILE_SIZE` environment variable
- Check uploads directory permissions

---

## 📝 Quick Reference

### Backend Environment Variables (Railway):
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/excel-manager
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend Environment Variables (Vercel):
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Backend deployed to Railway
- [ ] Environment variables set in Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] CORS updated with frontend URL
- [ ] Tested registration
- [ ] Tested file upload
- [ ] Tested data visualization

---

## 🎉 You're Done!

Your app should now be live and accessible from anywhere!

**Frontend URL**: `https://your-app.vercel.app`  
**Backend URL**: `https://your-app.railway.app`

Need help? Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

