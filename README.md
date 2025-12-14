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

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `dist` folder to Vercel or Netlify

3. Update `VITE_API_URL` in production environment

### Backend (Render/Railway/AWS)

1. Set environment variables on your hosting platform

2. Deploy the server folder

3. Ensure MongoDB Atlas connection string is set

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in server `.env`

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

## 📞 Support

For support, please open an issue in the repository.

---

**Note**: This is a production-ready application with best practices, error handling, and security measures. Make sure to change the JWT secret and other sensitive values before deploying to production.

