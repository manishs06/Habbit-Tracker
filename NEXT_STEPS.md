# 🚀 Next Steps - Deployment Checklist

## ✅ What You've Completed:
- [x] MongoDB Atlas cluster created (Free tier)
- [x] Database user created (`excelmanager`)
- [x] Connection string ready
- [x] IP whitelist configured

## 📋 What's Next:

### Step 2: Deploy Backend to Railway (10 minutes)

**Your MongoDB Connection String:**
```
mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
```

#### Action Items:

1. **Go to Railway:**
   - Visit: https://railway.app
   - Sign up/Login with GitHub (use same GitHub account as your repo)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select repository: `manishs06/Habbit-Tracker`

3. **Configure Service:**
   - Railway will detect it's a Node.js app
   - Click on the service → Settings
   - Set **Root Directory**: `server`
   - Build Command: `npm install` (usually auto-detected)
   - Start Command: `npm start` (usually auto-detected)

4. **Add Environment Variables:**
   - Click on your service → Variables tab
   - Click "New Variable" and add each one:

   **Variable 1:**
   - Name: `PORT`
   - Value: `5000`

   **Variable 2:**
   - Name: `NODE_ENV`
   - Value: `production`

   **Variable 3:**
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority`

   **Variable 4:**
   - Name: `JWT_SECRET`
   - Value: (Generate one - see below)

   **Variable 5:**
   - Name: `JWT_EXPIRE`
   - Value: `7d`

   **Variable 6:**
   - Name: `MAX_FILE_SIZE`
   - Value: `10485760`

   **Variable 7:**
   - Name: `CLIENT_URL`
   - Value: `https://placeholder.vercel.app` (we'll update this after frontend deployment)

5. **Generate JWT Secret:**
   - Open terminal/command prompt
   - Run this command:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Copy the output (long random string)
   - Use it as `JWT_SECRET` value

6. **Deploy:**
   - Railway will automatically start deploying
   - Wait 2-3 minutes for deployment to complete
   - Check the "Deployments" tab to see progress

7. **Get Backend URL:**
   - Click on your service → Settings
   - Scroll to "Networking" section
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://excel-manager-production.up.railway.app`)
   - **Save this URL!** You'll need it for Vercel

---

### Step 3: Deploy Frontend to Vercel (5 minutes)

**After Railway deployment is complete:**

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Import Git Repository
   - Select: `manishs06/Habbit-Tracker`

3. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: `client`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

4. **Add Environment Variable:**
   - Variable Name: `VITE_API_URL`
   - Value: Your Railway URL + `/api`
     - Example: `https://excel-manager-production.up.railway.app/api`

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes

6. **Get Frontend URL:**
   - Vercel will show your deployment URL
   - Copy it (e.g., `https://habbit-tracker.vercel.app`)

---

### Step 4: Update Backend CORS (2 minutes)

1. Go back to Railway
2. Edit `CLIENT_URL` variable:
   - Change from `https://placeholder.vercel.app`
   - To your actual Vercel URL (e.g., `https://habbit-tracker.vercel.app`)
3. Railway will auto-redeploy

---

### Step 5: Test Everything! 🎉

1. Visit your Vercel frontend URL
2. Try registering a new user
3. Try logging in
4. Try uploading an Excel file
5. Check if data visualization works

---

## 🆘 Troubleshooting

### Railway deployment fails:
- Check if Root Directory is set to `server`
- Verify all environment variables are set
- Check Railway logs for errors

### Frontend can't connect to backend:
- Verify `VITE_API_URL` in Vercel matches Railway URL + `/api`
- Check `CLIENT_URL` in Railway matches Vercel URL
- Wait a few minutes for changes to propagate

### MongoDB connection error:
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify database user password is correct

---

## 📝 Quick Reference

**Your MongoDB Connection String:**
```
mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
```

**Railway Environment Variables Needed:**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
JWT_SECRET=<generate_random_32_char_hex>
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
CLIENT_URL=<update_after_vercel_deployment>
```

**Vercel Environment Variable Needed:**
```
VITE_API_URL=https://your-railway-url.railway.app/api
```

---

## ✅ Ready to Start?

**Next Action:** Go to https://railway.app and start Step 2!

Good luck! 🚀

