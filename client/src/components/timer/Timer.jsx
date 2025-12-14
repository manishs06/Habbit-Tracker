import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Clock, Timer as TimerIcon, Maximize2, Minimize2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Timer = ({ habitId = null, habitTitle = '' }) => {
    const [mode, setMode] = useState('pomodoro') // pomodoro, shortBreak, longBreak, stopwatch
    const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
    const [isRunning, setIsRunning] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const intervalRef = useRef(null)

    const presets = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
        stopwatch: 0
    }

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (mode === 'stopwatch') {
                        return prev + 1
                    } else {
                        if (prev <= 1) {
                            handleTimerComplete()
                            return 0
                        }
                        return prev - 1
                    }
                })
            }, 1000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isRunning, mode])

    const handleTimerComplete = () => {
        setIsRunning(false)
        toast.success('Timer completed! 🎉')
        // Play notification sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe67OmfTRALUKfj8LZjHAU5k9fyz3ksBS')
        audio.play().catch(() => { }) // Ignore errors if audio fails
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(Math.abs(seconds) / 60)
        const secs = Math.abs(seconds) % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleModeChange = (newMode) => {
        setMode(newMode)
        setTimeLeft(presets[newMode])
        setIsRunning(false)
    }

    const handleReset = () => {
        setIsRunning(false)
        setTimeLeft(presets[mode])
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const progress = mode !== 'stopwatch' ? ((presets[mode] - timeLeft) / presets[mode]) * 100 : 0

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''} flex items-center justify-center`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${isFullscreen ? 'w-full h-full' : 'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'} p-8`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Focus Timer</h2>
                        {habitTitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Working on: {habitTitle}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="flex justify-center space-x-2 mb-8">
                    {['pomodoro', 'shortBreak', 'longBreak', 'stopwatch'].map((m) => (
                        <button
                            key={m}
                            onClick={() => handleModeChange(m)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {m === 'pomodoro' && 'Pomodoro'}
                            {m === 'shortBreak' && 'Short Break'}
                            {m === 'longBreak' && 'Long Break'}
                            {m === 'stopwatch' && 'Stopwatch'}
                        </button>
                    ))}
                </div>

                {/* Timer Display */}
                <div className="relative mb-8">
                    {/* Progress Ring */}
                    {mode !== 'stopwatch' && (
                        <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="8"
                                className="dark:stroke-gray-700"
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 90}`}
                                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                                strokeLinecap="round"
                                transform="rotate(-90 100 100)"
                                className="transition-all duration-1000"
                            />
                        </svg>
                    )}

                    {/* Time Display */}
                    <div className="relative flex items-center justify-center" style={{ height: '200px' }}>
                        <div className="text-center">
                            <div className="text-6xl font-bold text-gray-900 dark:text-white tabular-nums">
                                {formatTime(timeLeft)}
                            </div>
                            {mode !== 'stopwatch' && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {Math.round(progress)}% complete
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="flex items-center space-x-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    >
                        {isRunning ? (
                            <>
                                <Pause className="w-5 h-5" />
                                <span>Pause</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                <span>Start</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center space-x-2 px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Reset</span>
                    </button>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Space</kbd> to start/pause
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

// Keyboard shortcut handler
if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault()
            // This would need to be connected to the timer state
        }
    })
}

export default Timer
