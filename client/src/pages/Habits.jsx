import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHabits, createHabit, deleteHabit } from '../store/slices/habitSlice'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// Color palette for habits
const COLOR_PALETTE = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#06B6D4', // Cyan
]

const getRandomColor = () => {
    return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
}

const Habits = () => {
    const dispatch = useDispatch()
    const { items: habits, loading } = useSelector((state) => state.habits)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        frequency: 'Daily',
        goal: 1,
        reminderTime: '',
        color: getRandomColor(),
        icon: ''
    })

    useEffect(() => {
        dispatch(fetchHabits())
    }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim()) return

        const result = await dispatch(createHabit(formData))
        if (!result.error) {
            toast.success('Habit created!')
            setFormData({
                title: '',
                frequency: 'Daily',
                goal: 1,
                reminderTime: '',
                color: getRandomColor(), // Assign new random color for next habit
                icon: ''
            })
            setShowForm(false)
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this habit?')) {
            const result = await dispatch(deleteHabit(id))
            if (!result.error) toast.success('Habit deleted')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Habits</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Habit</span>
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Habit Title</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g., Read 30 mins"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Daily Goal (Times)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input-field"
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Frequency</label>
                                    <select
                                        className="input-field"
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Reminder (Optional)</label>
                                    <input
                                        type="time"
                                        className="input-field"
                                        value={formData.reminderTime}
                                        onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Color</label>
                                    <div className="space-y-3">
                                        {/* Preset Color Swatches */}
                                        <div className="flex flex-wrap gap-2">
                                            {COLOR_PALETTE.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, color })}
                                                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${formData.color === color
                                                            ? 'border-gray-900 dark:border-white scale-110'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                        {/* Custom Color Picker */}
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                                                value={formData.color || '#4F46E5'}
                                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            />
                                            <span className="text-sm text-gray-500">Custom: {formData.color}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Icon (Emoji or Text)</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g. 📚"
                                        maxLength="2"
                                        value={formData.icon || ''}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Create Habit
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                    <motion.div
                        key={habit._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: habit.color || '#4F46E5' }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
                                    <span className="mr-2 text-2xl" role="img" aria-label="icon">{habit.icon || '📝'}</span>
                                    {habit.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" /> {habit.frequency}
                                    </span>
                                    <span>Goal: {habit.goal}/day</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(habit._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex flex-col">
                                <span className="text-gray-500">Current Streak</span>
                                <span className="text-2xl font-bold text-primary-600">🔥 {habit.currentStreak}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-gray-500">Completions</span>
                                <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{habit.totalCompletions}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {habits.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        You haven&apos;t created any habits yet. Start by clicking &quot;New Habit&quot;!
                    </div>
                )}
            </div>
        </div>
    )
}

export default Habits
