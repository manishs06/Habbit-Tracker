# HabitFlow - MERN Stack Habit Tracker

A modern, full-stack habit tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Track your daily habits, visualize your streaks, and build a better you.

## Features

- **Authentication**: Secure JWT-based registration and login.
- **Habit Management**: Create daily/weekly habits with custom colors and icons.
- **Tracking**: Mark habits as completed and track your daily progress.
- **Analytics**: Visualize your success with GitHub-style contribution graphs and stats.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.

## Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB.

## Getting Started

1.  **Clone the repository.**
2.  **Install dependencies**:
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```
3.  **Environment Variables**:
    - `server/.env`: Set `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`.
    - `client/.env`: Set `VITE_API_URL`.
4.  **Run Locally**:
    - Server: `cd server && npm start`
    - Client: `cd client && npm run dev`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.
