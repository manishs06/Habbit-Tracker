# Environment Variables Reference

Complete guide to all environment variables used in the Excel Manager application.

## 📋 Quick Reference

### Backend (Server) Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port number |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`) |
| `MONGODB_URI` | **Yes** | `mongodb://localhost:27017/excel-manager` | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT token signing (min 32 chars) |
| `JWT_EXPIRE` | No | `7d` | JWT token expiration time |
| `MAX_FILE_SIZE` | No | `10485760` | Maximum file upload size in bytes (10MB) |
| `UPLOAD_PATH` | No | `./uploads` | Local directory for file uploads |
| `CLIENT_URL` | **Yes** | `http://localhost:5173` | Frontend URL for CORS configuration |

### Frontend (Client) Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | Backend API base URL |

---

## 🔧 Setup Instructions

### Local Development

1. **Backend Setup:**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your local values
   ```

2. **Frontend Setup:**
   ```bash
   cd client
   cp env.example .env
   # Edit .env with your local values
   ```

### Production Deployment

#### Railway (Backend)

Add these environment variables in Railway dashboard:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/excel-manager?retryWrites=true&w=majority
JWT_SECRET=your_strong_random_secret_key_here_min_32_characters
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
CLIENT_URL=https://your-frontend.vercel.app
```

#### Vercel (Frontend)

Add this environment variable in Vercel dashboard:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🔐 Security Notes

### JWT_SECRET

**IMPORTANT:** Use a strong, random secret key in production!

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Never:**
- ❌ Commit `.env` files to version control
- ❌ Use default/example secrets in production
- ❌ Share secrets publicly
- ❌ Use short or predictable secrets

### MONGODB_URI

**For Production:**
- Use MongoDB Atlas connection string
- Include database name: `/excel-manager`
- Include connection options: `?retryWrites=true&w=majority`
- Keep credentials secure

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/excel-manager?retryWrites=true&w=majority
```

---

## 📝 Variable Descriptions

### PORT
- **Type:** Number
- **Default:** `5000`
- **Description:** Port where the Express server listens
- **Production:** Railway/Render will auto-assign, but you can set it

### NODE_ENV
- **Type:** String
- **Options:** `development` | `production`
- **Description:** Sets environment mode
- **Effects:**
  - `development`: Detailed error messages, dev tools
  - `production`: Optimized, minimal error details

### MONGODB_URI
- **Type:** String (URL)
- **Required:** Yes
- **Description:** MongoDB connection string
- **Local:** `mongodb://localhost:27017/excel-manager`
- **Atlas:** `mongodb+srv://user:pass@cluster.mongodb.net/excel-manager?retryWrites=true&w=majority`

### JWT_SECRET
- **Type:** String
- **Required:** Yes
- **Min Length:** 32 characters recommended
- **Description:** Secret key for signing JWT tokens
- **Generate:** Use crypto.randomBytes(32).toString('hex')

### JWT_EXPIRE
- **Type:** String
- **Default:** `7d`
- **Format:** Number + unit (e.g., `7d`, `24h`, `1h`, `30m`)
- **Description:** JWT token expiration time

### MAX_FILE_SIZE
- **Type:** Number (bytes)
- **Default:** `10485760` (10MB)
- **Description:** Maximum size for uploaded Excel files
- **Note:** Also check server limits

### UPLOAD_PATH
- **Type:** String (path)
- **Default:** `./uploads`
- **Description:** Local directory for storing uploaded files
- **Note:** Create directory if it doesn't exist

### CLIENT_URL
- **Type:** String (URL)
- **Required:** Yes (for CORS)
- **Description:** Frontend URL for CORS configuration
- **Local:** `http://localhost:5173`
- **Production:** Your Vercel/Netlify URL

### VITE_API_URL
- **Type:** String (URL)
- **Required:** Yes
- **Description:** Backend API base URL
- **Local:** `http://localhost:5000/api`
- **Production:** Your Railway/Render backend URL + `/api`

---

## 🚀 Production Deployment Checklist

### Backend (Railway)
- [ ] `MONGODB_URI` set with MongoDB Atlas connection string
- [ ] `JWT_SECRET` set with strong random key
- [ ] `NODE_ENV` set to `production`
- [ ] `CLIENT_URL` set to frontend production URL
- [ ] `PORT` set (or let Railway assign)
- [ ] `MAX_FILE_SIZE` configured appropriately

### Frontend (Vercel)
- [ ] `VITE_API_URL` set to backend production URL + `/api`
- [ ] Build succeeds with environment variable

### Verification
- [ ] Backend connects to MongoDB
- [ ] Frontend can reach backend API
- [ ] CORS allows frontend requests
- [ ] Authentication works
- [ ] File uploads work

---

## 🆘 Troubleshooting

### Backend can't connect to MongoDB
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check database user credentials

### Frontend can't reach backend
- Verify `VITE_API_URL` matches backend URL
- Check backend is running
- Verify CORS `CLIENT_URL` matches frontend URL

### JWT authentication fails
- Verify `JWT_SECRET` is set and consistent
- Check token expiration settings
- Ensure secret is strong enough

### File upload fails
- Check `MAX_FILE_SIZE` limit
- Verify `UPLOAD_PATH` directory exists
- Check file permissions

---

## 📚 Additional Resources

- [MongoDB Atlas Connection Strings](https://docs.atlas.mongodb.com/getting-started/)
- [JWT Best Practices](https://jwt.io/introduction)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

