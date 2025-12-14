import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { checkAuth } from './store/slices/authSlice'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Tracker from './pages/Tracker'
import FocusTimer from './pages/FocusTimer'
import Profile from './pages/Profile'
import { getDailyInspiration } from './utils/inspiration'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(checkAuth())
    }
  }, [dispatch])

  // Inspiration
  const { quote, backgroundImage } = getDailyInspiration();

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Dynamic Background Image */}
      <div
        className="fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.6)' // Darken for readability
        }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Navbar />

        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
          {/* Motivational Quote Banner - Only show on Dashboard or everywhere? 
                Let's show it nicely at the top or maybe fixed at bottom?
                User said "Motivational thoughts image in background".
                Let's put the quote in a nice visible spot on the Dashboard page specifically, 
                or just floating at the bottom right.
                For now, let's keep it clean. I'll add the background to APP. 
                I will pass the quote to Dashboard? Or just display it here at the bottom of the screen?
                Let's display it at the bottom of the screen as a footer.
            */}

          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard quote={quote} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <Habits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracker"
              element={
                <ProtectedRoute>
                  <Tracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timer"
              element={
                <ProtectedRoute>
                  <FocusTimer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>

          {/* Motivational Footer */}
          <div className="mt-auto py-6 text-center text-white/90 drop-shadow-md">
            <p className="text-lg font-serif italic">"{quote.text}"</p>
            <p className="text-sm mt-1 opacity-75">— {quote.author}</p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

