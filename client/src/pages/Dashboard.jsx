import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHabits, toggleHabitCompletion } from '../store/slices/habitSlice'
import { motion } from 'framer-motion'
import api from '../store/api'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import MonthlyHabitGrid from '../components/dashboard/MonthlyHabitGrid'
import DashboardBottom from '../components/dashboard/DashboardBottom'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { items: habits } = useSelector((state) => state.habits)
  const [monthLogs, setMonthLogs] = useState({}) // format: { "habitId_YYYY-MM-DD": status }
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    dispatch(fetchHabits())
  }, [dispatch])

  useEffect(() => {
    fetchLogsForMonth()
  }, [currentDate, habits]) // Refetch when month changes

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  const fetchLogsForMonth = async () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const start = new Date(year, month, 1)
      const end = new Date(year, month + 1, 0, 23, 59, 59) // End of month

      const response = await api.get(`/habits/logs?start=${start.toISOString()}&end=${end.toISOString()}`)

      if (response.data.success) {
        // Transform to map
        const map = {}
        response.data.data.forEach(log => {
          const d = new Date(log.date)
          const dateStr = d.toISOString().split('T')[0] // YYYY-MM-DD
          const key = `${log.habitId}_${dateStr}`
          map[key] = log.status
        })
        setMonthLogs(map)
      }
    } catch (error) {
      console.error("Failed to fetch logs", error)
    }
  }

  const handleToggle = async (habitId, dateStr) => {
    // Optimistic update
    const key = `${habitId}_${dateStr}`
    const currentStatus = monthLogs[key]

    let nextStatus = null
    if (!currentStatus) nextStatus = 'completed'
    else if (currentStatus === 'completed') nextStatus = 'missed'
    else if (currentStatus === 'missed') nextStatus = null

    setMonthLogs(prev => {
      const next = { ...prev }
      if (nextStatus) next[key] = nextStatus
      else delete next[key]
      return next
    })

    try {
      await dispatch(toggleHabitCompletion({ id: habitId, date: dateStr })).unwrap()
    } catch (error) {
      console.error("Toggle failed", error)
      // Revert could happen here, simpler to just refetch or ignore for now
      fetchLogsForMonth()
    }
  }

  // Stats Calculations
  const stats = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate)
    const daysPassed = Math.min(daysInMonth, new Date().getDate()) // Don't count future days for success rate? Or do we?
    // Actually, "Success Rate" usually implies "of attempts made" or "of total possible up to now".
    // Let's use "Up to today" for calculation.

    let totalCompletions = 0
    const activityMap = new Array(daysInMonth).fill(0)

    // Iterate logs to count
    Object.entries(monthLogs).forEach(([key, status]) => {
      if (status === 'completed') {
        totalCompletions++
        const datePart = key.split('_')[1]
        const dayIndex = new Date(datePart).getDate() - 1
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          activityMap[dayIndex]++
        }
      }
    })

    // Prepare line chart data
    const activityData = activityMap.map((count, i) => ({
      day: i + 1,
      count
    }))

    // Total possible completions (Habits * Days Passed)
    const totalPossible = habits.length * daysPassed
    const successRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0

    // Momentum: Last 3 days
    let last3DaysCompleted = 0
    let last3DaysPossible = habits.length * 3
    const today = new Date()
    for (let i = 0; i < 3; i++) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      habits.forEach(h => {
        if (monthLogs[`${h._id}_${dateStr}`] === 'completed') last3DaysCompleted++
      })
    }
    const momentum = last3DaysPossible > 0 ? Math.round((last3DaysCompleted / last3DaysPossible) * 100) : 0

    return {
      successRate,
      activityData,
      totalCompletions,
      momentum,
      totalGoal: habits.length * daysInMonth // For bottom "Completed" text
    }

  }, [monthLogs, habits, currentDate])

  return (
    <div className="bg-[#1A1A1A] min-h-screen p-4 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1400px] mx-auto space-y-0 shadow-2xl"
      >
        {/* 1. Header */}
        <DashboardHeader
          year={currentDate.getFullYear()}
          month={currentDate.toLocaleString('default', { month: 'long' })}
          startDate={`${currentDate.toLocaleString('default', { month: 'long' })} 1, ${currentDate.getFullYear()}`}
          endDate={`${currentDate.toLocaleString('default', { month: 'long' })} ${getDaysInMonth(currentDate)}, ${currentDate.getFullYear()}`}
          totalDays={getDaysInMonth(currentDate)}
          successRate={stats.successRate}
          activityData={stats.activityData}
        />

        {/* 2. Grid */}
        <MonthlyHabitGrid
          habits={habits}
          currentDate={currentDate}
          logs={monthLogs}
        // onToggle={handleToggle} // Disabled as per user request (Read-only)
        />

        {/* 3. Bottom */}
        <DashboardBottom
          monthlyProgress={stats.successRate}
          normalizedProgress={stats.successRate + 5} // Mock difference for visual var
          momentum={stats.momentum}
          totalCompleted={stats.totalCompletions}
          totalGoal={stats.totalGoal}
        />
      </motion.div>
    </div>
  )
}

export default Dashboard
