# HabitFlow - MERN Stack Habit Tracker

A modern, full-stack habit tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Build better habits, track your progress, and visualize your journey to self-improvement with beautiful dashboards and analytics.

![Habit Tracker Dashboard](https://placehold.co/800x400?text=Habit+Tracker+Dashboard)
*Beautiful dashboard showing habit tracking and analytics*

## 🌟 Key Features

### 🔐 User Authentication
- Secure JWT-based user registration and login
- Password encryption for data protection
- Protected routes for authenticated users only

### 📋 Habit Management
- Create, edit, and delete personalized habits
- Set frequency (daily/weekly) for each habit
- Customize habits with colors and icons for better organization
- Categorize habits for easier tracking

### ⏰ Focus Timer
- Built-in Pomodoro timer for focused work sessions
- Customizable timer durations
- Track productivity sessions alongside habit tracking

### 📊 Advanced Analytics
- GitHub-style contribution graph to visualize your consistency
- Streak tracking to maintain momentum
- Progress statistics and insights
- Monthly habit completion rates

### 🎨 Beautiful UI/UX
- Dark/light mode toggle for comfortable viewing
- Responsive design that works on all devices
- Smooth animations and transitions
- Intuitive dashboard layout

### 📱 Mobile Responsive
- Fully responsive design for all screen sizes
- Touch-friendly interface for mobile devices
- Optimized performance on all platforms

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) - Fast and modern frontend framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication

### Database
- **MongoDB** - NoSQL database for flexible data storage

### DevOps
- **Railway** - Cloud deployment platform
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manishs06/Habbit-Tracker.git
   cd Habbit-Tracker
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   
   Create `server/.env` with:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```
   
   Create `client/.env` with:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

5. **Run the Application**
   
   Start the server:
   ```bash
   cd server
   npm start
   ```
   
   Start the client (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```
   
   Visit `http://localhost:5173` in your browser.

## ☁️ Deployment

Deploy your Habit Tracker to the cloud with Railway:

1. Push your code to a GitHub repository
2. Connect your repository to Railway
3. Set up environment variables in Railway
4. Deploy!

For detailed deployment instructions, see our [Deployment Guide](./DEPLOYMENT.md).

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by various habit tracking methodologies
- Built with ❤️ using the amazing MERN stack
