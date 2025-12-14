import Timer from '../components/timer/Timer'

const FocusTimer = () => {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Focus Timer</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Use the Pomodoro technique to stay focused on your habits
                </p>
            </div>

            <Timer />
        </div>
    )
}

export default FocusTimer
