import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHabits, toggleHabitCompletion } from '../../store/slices/habitSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../store/api'
import confetti from 'canvas-confetti'

const HabitGrid = () => {
    const dispatch = useDispatch()
    const { items: habits } = useSelector((state) => state.habits)
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
    const [completionData, setCompletionData] = useState({})

    useEffect(() => {
        fetchCompletionData()
    }, [currentWeekStart])

    // Helper to get consistent YYYY-MM-DD key from a date object (using Local Time)
    const getDateKey = (date) => {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const fetchCompletionData = async () => {
        try {
            // Fetch habit logs for the current week
            const startDate = new Date(currentWeekStart)
            startDate.setHours(0, 0, 0, 0)
            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 7)

            const response = await api.get(`/habits/logs?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)

            // Transform logs into a lookup map: habitId_date -> status
            const dataMap = {}
            if (response.data.data) {
                response.data.data.forEach(log => {
                    // Only add to map if status is not 'unmarked'
                    if (log.status !== 'unmarked') {
                        // Create date object from stored UTC date, but expect consistent local day viewing
                        const dateKey = getDateKey(log.date)
                        const key = `${log.habitId}_${dateKey}`
                        dataMap[key] = log.status
                    }
                })
            }
            setCompletionData(dataMap)
        } catch (error) {
            console.error('Error fetching completion data:', error)
        }
    }

    // Generate 7 days starting from currentWeekStart
    const getDaysOfWeek = () => {
        const days = []
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart)
            date.setDate(date.getDate() + i)
            days.push(date)
        }
        return days
    }

    const days = getDaysOfWeek()

    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }

    const handleCellClick = async (habitId, date) => {
        // Prevent marking future dates
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const checkDate = new Date(date)
        checkDate.setHours(0, 0, 0, 0)

        // Triple check restriction: Only today allowed
        if (checkDate.getTime() !== today.getTime()) {
            return
        }

        const dateStr = date.toISOString()
        const dateKey = getDateKey(date)
        const key = `${habitId}_${dateKey}`

        // Optimistic Update
        const currentStatus = completionData[key]
        let nextStatus = null
        if (!currentStatus) nextStatus = 'completed'
        else if (currentStatus === 'completed') nextStatus = 'missed'
        else if (currentStatus === 'missed') nextStatus = null // unmarked

        // Create a temporary map to reflect the optimistic update for the confetti check
        const tempCompletionData = { ...completionData };
        if (nextStatus) {
            tempCompletionData[key] = nextStatus;
        } else {
            delete tempCompletionData[key];
        }

        // Update local state immediately
        setCompletionData(prev => {
            const newMap = { ...prev }
            if (nextStatus) {
                newMap[key] = nextStatus
            } else {
                delete newMap[key]
            }
            return newMap
        })

        // Trigger confetti if marking complete
        if (nextStatus === 'completed') {
            // Check if ALL daily habits are now done?
            // We need to check the updated state. 
            // We know 'habits' list. We know today's key.
            let allDone = true;
            habits.forEach(h => {
                const k = `${h._id}_${dateKey}`;
                // Check if this habit is the one we just marked, or if it was already completed in the temp state
                if (h._id === habitId) {
                    if (nextStatus !== 'completed') allDone = false;
                } else {
                    if (tempCompletionData[k] !== 'completed') allDone = false;
                }
            });

            if (allDone) {
                triggerConfetti();
            }
        }

        try {
            await dispatch(toggleHabitCompletion({ id: habitId, date: dateStr })).unwrap()
            // We can optionally refetch here to be sure, but optimistic update makes it snappy
            // await fetchCompletionData() 
        } catch (error) {
            // Revert on error
            console.error("Failed to toggle, reverting", error)
            await fetchCompletionData()
        }
    }

    const getStatus = (habitId, date) => {
        const dateKey = getDateKey(date)
        const key = `${habitId}_${dateKey}`
        const status = completionData[key]
        if (status) return status

        // Check past
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const checkDate = new Date(date)
        checkDate.setHours(0, 0, 0, 0)

        if (checkDate < today) {
            // Check created at
            const habit = habits.find(h => h._id === habitId)
            if (habit) {
                const created = new Date(habit.createdAt)
                created.setHours(0, 0, 0, 0)
                if (checkDate >= created) return 'missed'
            }
        }

        return null // Returns 'completed', 'missed', or null
    }

    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeekStart)
        newDate.setDate(newDate.getDate() - 7)
        setCurrentWeekStart(newDate)
    }

    const goToNextWeek = () => {
        const newDate = new Date(currentWeekStart)
        newDate.setDate(newDate.getDate() + 7)
        setCurrentWeekStart(newDate)
    }

    const goToToday = () => {
        const today = new Date()
        today.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
        setCurrentWeekStart(today)
    }

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-3xl">📅</span> Weekly Tracker
                </h2>
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={goToPreviousWeek}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Previous Week"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border-x border-gray-100 dark:border-gray-700 mx-1"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNextWeek}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Next Week"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Excel-style Grid */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                            <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-900 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[220px] border-b border-r border-gray-200 dark:border-gray-700">
                                Habit
                            </th>
                            {days.map((date, idx) => {
                                const isToday = new Date().toDateString() === date.toDateString();
                                return (
                                    <th
                                        key={idx}
                                        className={`px-4 py-3 text-center min-w-[80px] border-b border-gray-200 dark:border-gray-700 ${isToday ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                                            }`}
                                    >
                                        <div className={`text-xs uppercase tracking-wider mb-1 ${isToday ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-500'
                                            }`}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <div className={`text-lg font-semibold ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {date.getDate()}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {habits.map((habit, habitIdx) => (
                            <motion.tr
                                key={habit._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: habitIdx * 0.05 }}
                                className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                                <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 border-r border-gray-100 dark:border-gray-700 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl bg-gray-100 dark:bg-gray-700 p-2 rounded-lg" role="img" aria-label="icon">
                                            {habit.icon || '📝'}
                                        </span>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {habit.title}
                                            </div>
                                            {habit.description && (
                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                                    {habit.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                {days.map((date, dayIdx) => {
                                    const status = getStatus(habit._id, date)
                                    const isFuture = date > new Date().setHours(23, 59, 59, 999);

                                    return (
                                        <td
                                            key={dayIdx}
                                            className={`px-2 py-2 text-center border-l border-gray-50 dark:border-gray-800 ${!isFuture && new Date().toDateString() === date.toDateString() ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50' : 'opacity-30 cursor-not-allowed bg-gray-50/50 dark:bg-gray-900/50'
                                                } transition-colors duration-150`}
                                            onClick={() => !isFuture && new Date().toDateString() === date.toDateString() && handleCellClick(habit._id, date)}
                                        >
                                            <div className="flex items-center justify-center h-full w-full relative">
                                                <AnimatePresence mode="wait">
                                                    {status === 'completed' && (
                                                        <motion.div
                                                            key="completed"
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: 45 }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                            className="w-10 h-10 rounded-full bg-green-500 shadow-lg shadow-green-500/30 text-white flex items-center justify-center"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                    {status === 'missed' && (
                                                        <motion.div
                                                            key="missed"
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: 45 }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                            className="w-10 h-10 rounded-full bg-red-500 shadow-lg shadow-red-500/30 text-white flex items-center justify-center"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                    {!status && !isFuture && (
                                                        <motion.div
                                                            key="empty"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                    )
                                })}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {habits.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 mb-4">No habits yet.</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xs font-bold">✓</div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-xs font-bold">✕</div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Missed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Marked</span>
                </div>
            </div>
        </div>
    )
}

export default HabitGrid
