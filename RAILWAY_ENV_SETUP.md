# 🚨 URGENT: Fix Railway MongoDB Connection

## The Problem
Your Railway deployment is failing because the `MONGODB_URI` environment variable is not set.

**Error:** `MongoDB connection error: connect ECONNREFUSED ::1:27017`

This means Railway is trying to connect to localhost MongoDB instead of MongoDB Atlas.

---

## ✅ Quick Fix (2 minutes)

### Step 1: Go to Railway Dashboard
1. Open https://railway.app
2. Login to your account
3. Click on your project
4. Click on your service (the one showing the error)

### Step 2: Open Variables Tab
1. Click on **"Variables"** tab at the top
2. You should see a list of environment variables (might be empty)

### Step 3: Add MONGODB_URI (MOST IMPORTANT!)
1. Click **"+ New Variable"** or **"Add Variable"** button
2. **Variable Name:** `MONGODB_URI`
3. **Variable Value:** 
   ```
   mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
   ```
4. Click **"Add"** or **"Save"**

### Step 4: Add Other Required Variables

Add these one by one:

**Variable 2:**
- Name: `PORT`
- Value: `5000`

**Variable 3:**
- Name: `NODE_ENV`
- Value: `production`

**Variable 4:**
- Name: `JWT_SECRET`
- Value: `070dfea6ad85a959edc99079d10b919728ab3c38554150c3f2dcbe326471e0b9`

**Variable 5:**
- Name: `JWT_EXPIRE`
- Value: `7d`

**Variable 6:**
- Name: `MAX_FILE_SIZE`
- Value: `10485760`

**Variable 7:**
- Name: `CLIENT_URL`
- Value: `https://placeholder.vercel.app` (we'll update this later)

### Step 5: Wait for Auto-Redeploy
- Railway will automatically redeploy after you add variables
- Go to **"Deployments"** tab to watch the progress
- Wait 1-2 minutes for deployment to complete

### Step 6: Check Logs
- Click on the latest deployment
- View the logs
- You should see: `✅ MongoDB connected successfully`
- Then: `🚀 Server running on port 5000`

---

## 📋 Copy-Paste All Variables

If Railway allows bulk import, use this format:

```
MONGODB_URI=mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
JWT_SECRET=070dfea6ad85a959edc99079d10b919728ab3c38554150c3f2dcbe326471e0b9
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
CLIENT_URL=https://placeholder.vercel.app
```

---

## 🎯 Visual Guide

**Railway Dashboard Path:**
```
Railway.app → Your Project → Your Service → Variables Tab → + New Variable
```

**What you'll see:**
- Left side: Variable Name input
- Right side: Variable Value input
- Button: "Add" or "Save"

---

## ✅ Verification Checklist

After adding variables, check:

- [ ] `MONGODB_URI` is set (most important!)
- [ ] All 7 variables are added
- [ ] No typos in variable names
- [ ] No extra spaces in values
- [ ] Railway is redeploying
- [ ] Logs show "MongoDB connected successfully"

---

## 🆘 Still Not Working?

1. **Double-check MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Network Access → IP whitelist should include `0.0.0.0/0`
   - Database Access → User `excelmanager` should exist

2. **Verify Connection String:**
   - Make sure there are NO spaces in the connection string
   - Password is correct: `Manishdb1`
   - Database name is: `excel-manager`

3. **Check Railway Logs:**
   - Look for any other error messages
   - Check if variables are actually saved (refresh the Variables tab)

---

**Once this works, proceed to deploy the frontend to Vercel!** 🚀

