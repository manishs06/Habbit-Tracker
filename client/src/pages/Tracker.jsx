import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, TrendingDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHabits } from '../store/slices/habitSlice'
import HabitGrid from '../components/habits/HabitGrid'

const Tracker = () => {
    const dispatch = useDispatch()
    const { items: habits, loading } = useSelector((state) => state.habits)

    useEffect(() => {
        dispatch(fetchHabits())
    }, [dispatch])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    // If user has habits, show the Excel-style Grid Tracker
    if (habits.length > 0) {
        return <HabitGrid />
    }

    // Otherwise, show the Welcome / Empty State
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8 max-w-2xl mx-auto px-4"
            >
                {/* Decorative Icons */}
                <div className="flex justify-center space-x-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-5xl"
                    >
                        🌱
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-5xl"
                    >
                        🏃
                    </motion.div>
                </div>

                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome to Journal
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Journal makes your habit progress visible day by day. It's empty now, but your journey can start with a single habit.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Link
                        to="/habits"
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-[200px]"
                    >
                        <Plus className="w-5 h-5" />
                        Build new Habit
                    </Link>

                    <Link
                        to="/habits"
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[200px]"
                    >
                        <TrendingDown className="w-5 h-5" />
                        Break a Habit
                    </Link>
                </motion.div>

                {/* Bottom Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-sm text-gray-500 dark:text-gray-500 pt-8"
                >
                    Nothing selected
                </motion.p>
            </motion.div>
        </div>
    )
}

export default Tracker
