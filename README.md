# Excel Manager - MERN Stack Application

A modern, full-featured web application for uploading, managing, analyzing, and visualizing Excel files. Built with the MERN stack (MongoDB, Express, React, Node.js) with a beautiful, responsive UI.

## 🚀 Features

### Authentication & User Management
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing
- Profile management

### Excel File Management
- Upload Excel files (.xls, .xlsx, .csv)
- Drag-and-drop file upload
- Excel structure validation
- Preview data before saving
- File versioning
- File metadata storage

### Data Processing & Visualization
- Dynamic Excel sheet parsing
- Interactive data tables with:
  - Sorting
  - Filtering
  - Pagination
  - Search functionality
  - Inline cell editing
- Export updated data back to Excel
- Multiple chart types:
  - Line charts
  - Bar charts
  - Pie charts
  - Dynamic chart selection

### Dashboard
- Overview statistics (total files, rows, charts)
- Recently uploaded files
- Most used datasets
- Activity timeline
- Performance insights

### Advanced Features
- Auto-detect column types
- Data validation
- History & audit logs
- Dark mode support
- Responsive design (desktop, tablet, mobile)
- Smooth animations with Framer Motion

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose)
- **JWT** - Authentication
- **Multer** - File uploads
- **xlsx** - Excel parsing
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Routing
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
Habitify/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── file.controller.js
│   │   ├── data.controller.js
│   │   └── analytics.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── File.model.js
│   │   ├── ExcelData.model.js
│   │   └── AuditLog.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── file.routes.js
│   │   ├── data.routes.js
│   │   └── analytics.routes.js
│   ├── services/
│   │   └── excel.service.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── files/
    │   │   ├── data/
    │   │   ├── charts/
    │   │   └── layout/
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── Dashboard.jsx
    │   │   ├── Files.jsx
    │   │   ├── FileView.jsx
    │   │   └── Profile.jsx
    │   ├── store/
    │   │   ├── slices/
    │   │   ├── api.js
    │   │   └── store.js
    │   ├── hooks/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Habitify
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/excel-manager
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   CLIENT_URL=http://localhost:5173
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Create uploads directory**
   ```bash
   cd server
   mkdir uploads
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### File Endpoints

- `POST /api/files/upload` - Upload Excel file (Protected)
- `GET /api/files` - Get all files (Protected)
- `GET /api/files/:id` - Get file details (Protected)
- `DELETE /api/files/:id` - Delete file (Protected)

### Data Endpoints

- `GET /api/data/file/:fileId` - Get all sheets for a file (Protected)
- `GET /api/data/file/:fileId/sheet/:sheetName` - Get sheet data (Protected)
- `PUT /api/data/file/:fileId/sheet/:sheetName` - Update cell data (Protected)
- `POST /api/data/file/:fileId/sheet/:sheetName/export` - Export sheet to Excel (Protected)

### Analytics Endpoints

- `GET /api/analytics/dashboard` - Get dashboard statistics (Protected)
- `GET /api/analytics/charts/:fileId/:sheetName` - Get chart data (Protected)

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File type and size validation
- Protected API routes
- CORS configuration
- Helmet.js for security headers
- Environment variable protection

## 🎨 UI/UX Features

- Modern, clean SaaS-style design
- Fully responsive (mobile, tablet, desktop)
- Dark mode support
- Smooth animations with Framer Motion
- Toast notifications
- Skeleton loaders
- Interactive data tables
- Beautiful chart visualizations

## 📦 Deployment

For detailed deployment instructions, see **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)**.

**Quick Overview:**
- **Frontend:** Deploy to Vercel (free tier available)
- **Backend:** Deploy to Railway (free $5 credit/month)
- **Database:** Use MongoDB Atlas (free 512MB tier)

The deployment guide includes step-by-step instructions for setting up MongoDB Atlas, deploying to Railway, and deploying to Vercel.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB connection error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`

2. **File upload fails**
   - Check file size (max 10MB)
   - Ensure `uploads` directory exists
   - Check file permissions

3. **CORS errors**
   - Verify `CLIENT_URL` in server `.env`
   - Check CORS configuration in `server.js`

4. **JWT token errors**
   - Ensure `JWT_SECRET` is set
   - Check token expiration settings

## ⚙️ Environment Variables

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port number |
| `NODE_ENV` | No | `development` | Environment mode |
| `MONGODB_URI` | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT (min 32 chars) |
| `JWT_EXPIRE` | No | `7d` | JWT token expiration |
| `MAX_FILE_SIZE` | No | `10485760` | Max file size in bytes (10MB) |
| `CLIENT_URL` | **Yes** | - | Frontend URL for CORS |

### Frontend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | **Yes** | - | Backend API base URL |

**Setup:**
- Copy `server/env.example` to `server/.env` and fill in values
- Copy `client/env.example` to `client/.env` and fill in values
- Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 📄 Excel File Format

### Supported Formats
- **.xlsx** - Excel 2007+ (Recommended)
- **.xls** - Excel 97-2003
- **.csv** - Comma-separated values

### Requirements
- **Max file size:** 10MB
- **Headers:** First row must contain column headers
- **Data types:** Auto-detected (number, date, string)
- **Multiple sheets:** Supported (each processed independently)

### Best Practices
- Use consistent data formats within columns
- Format dates as dates (not text)
- Use clear, descriptive header names
- Avoid special characters in headers

### Chart Requirements
- **Line/Bar charts:** Need one categorical column (X-axis) and one numeric column (Y-axis)
- **Pie charts:** Need one categorical column

## 📚 Documentation

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Complete step-by-step deployment guide (MongoDB Atlas, Railway, Vercel)

## 📞 Support

For support, please open an issue in the repository.

---

**Note**: This is a production-ready application with best practices, error handling, and security measures. Make sure to change the JWT secret and other sensitive values before deploying to production.

