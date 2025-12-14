# 🔧 Railway MongoDB Connection Fix

## ❌ Current Error:
```
MongoDB connection error: connect ECONNREFUSED ::1:27017
```

This means Railway is trying to connect to localhost MongoDB instead of MongoDB Atlas.

## ✅ Solution: Add Environment Variables in Railway

### Step-by-Step Fix:

1. **Go to Railway Dashboard:**
   - Open your Railway project: https://railway.app
   - Click on your service (the one that's failing)

2. **Open Variables Tab:**
   - Click on **"Variables"** tab (top menu)
   - You should see an empty list or existing variables

3. **Add MONGODB_URI Variable:**
   - Click **"New Variable"** button
   - **Name**: `MONGODB_URI`
   - **Value**: 
     ```
     mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority
     ```
   - Click **"Add"** or **"Save"**

4. **Add Other Required Variables:**

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
   - Value: `https://placeholder.vercel.app` (we'll update this after Vercel deployment)

5. **Railway will Auto-Redeploy:**
   - After adding variables, Railway automatically redeploys
   - Watch the "Deployments" tab to see the progress
   - The deployment should succeed now!

6. **Verify Connection:**
   - Check the logs in Railway
   - You should see: `✅ MongoDB connected successfully`
   - Then: `🚀 Server running on port 5000`

---

## 📋 Complete Environment Variables List

Copy and paste these into Railway Variables:

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

## 🎯 Quick Visual Guide

**Railway Dashboard → Your Service → Variables Tab:**

1. Click **"+ New Variable"**
2. Enter Name: `MONGODB_URI`
3. Enter Value: `mongodb+srv://excelmanager:Manishdb1@cluster0.mspp0ju.mongodb.net/excel-manager?retryWrites=true&w=majority`
4. Click **"Add"**
5. Repeat for all 7 variables above

---

## ✅ After Adding Variables

1. Railway will automatically redeploy
2. Check the "Deployments" tab
3. Click on the latest deployment to see logs
4. You should see:
   - `✅ MongoDB connected successfully`
   - `🚀 Server running on port 5000`

If you still see errors, check:
- MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Connection string is correct (no extra spaces)
- All environment variables are saved

---

## 🆘 Still Having Issues?

1. **Check Railway Logs:**
   - Go to Deployments → Latest deployment → View logs
   - Look for any error messages

2. **Verify MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Check Network Access → IP whitelist includes 0.0.0.0/0
   - Check Database Access → User `excelmanager` exists

3. **Test Connection String:**
   - Make sure there are no spaces in the connection string
   - Verify password is correct: `Manishdb1`
   - Check database name: `excel-manager`

---

**Once this is fixed, proceed to Step 3: Deploy Frontend to Vercel!** 🚀

