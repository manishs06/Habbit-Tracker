import { motion } from 'framer-motion';

const MonthlyHabitGrid = ({
    habits = [],
    currentDate = new Date(),
    logs = {},
    onToggle
}) => {
    // Helper to get days in current month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return days;
    };

    const daysCount = getDaysInMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Generate array of day objects { number: 1, letter: 'S' }
    const days = Array.from({ length: daysCount }, (_, i) => {
        const d = new Date(year, month, i + 1);
        // Manually construct local YYYY-MM-DD to avoid UTC shift
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const fullDate = `${y}-${m}-${dayNum}`;

        return {
            date: d,
            number: i + 1,
            letter: d.toLocaleDateString('en-US', { weekday: 'narrow' }), // S, M, T...
            fullDate // YYYY-MM-DD
        };
    });

    // Helper to get status
    const getStatus = (habitId, dateStr) => {
        const key = `${habitId}_${dateStr}`;
        const status = logs[key];
        if (status) return status;

        // Check if date is in the past and after creation
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const todayStr = `${y}-${m}-${d}`;

        if (dateStr < todayStr) {
            // Also check creator date to avoid marking days before habit existed as missed
            const habit = habits.find(h => h._id === habitId);
            if (habit) {
                const created = new Date(habit.createdAt);
                const cy = created.getFullYear();
                const cm = String(created.getMonth() + 1).padStart(2, '0');
                const cd = String(created.getDate()).padStart(2, '0');
                const createdStr = `${cy}-${cm}-${cd}`;

                if (dateStr >= createdStr) return 'missed';
            }
        }
        return null; // 'completed', 'missed', or null
    };

    // Calculate daily totals for bottom row
    const dailyTotals = days.map(day => {
        let count = 0;
        habits.forEach(habit => {
            // For totals, do we count 'missed'? No, usually just 'completed'.
            // getStatus might return 'missed' now for past days.
            // We only care about explicit 'completed' for the count.
            // Access logs directly to be safe, or check result.
            // Re-using getStatus is fine if we check === 'completed'.
            const status = getStatus(habit._id, day.fullDate);
            if (status === 'completed') count++;
        });
        return count;
    });

    return (
        <div className="bg-[#E5E5E5] p-6 rounded-none overflow-x-auto">
            <div className="min-w-[1000px] bg-white border-2 border-black">
                {/* Header Row */}
                <div className="grid grid-cols-[250px_60px_1fr_100px] border-b-2 border-black">
                    <div className="p-3 font-bold text-sm tracking-wider border-r border-black/20 flex items-center bg-[#E5E5E5]">HABIT</div>
                    <div className="p-3 font-bold text-sm tracking-wider border-r border-black/20 text-center flex items-center justify-center bg-[#E5E5E5]">GOAL</div>

                    {/* Days Header */}
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${daysCount}, minmax(30px, 1fr))` }}>
                        {days.map((day) => (
                            <div key={day.number} className="flex flex-col items-center justify-center border-r border-black/10 last:border-r-0 py-2">
                                <span className="text-xs font-bold text-gray-500 mb-1">{day.number}</span>
                                <span className="text-xs font-bold text-black">{day.letter}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 font-bold text-sm tracking-wider border-l border-black/20 flex items-center justify-center bg-[#E5E5E5]">PROGRESS</div>
                </div>

                {/* Habit Rows */}
                {habits.map((habit, idx) => {
                    // Calculate habit progress
                    let completedCount = 0;
                    days.forEach(day => {
                        if (getStatus(habit._id, day.fullDate) === 'completed') completedCount++;
                    });
                    // Avoid division by zero, default to 1 if goal is missing or 0
                    const goal = habit.goal || 1;
                    // Progress is completions / (goal * daysInMonth)? No, usually goal is "times per month" or per day?
                    // Design shows "GOAL" column with small numbers (5, 7, 15). 
                    // Assuming 'goal' in prop is 'monthly goal target'.
                    // If habit.goal is small (e.g. 1), maybe it means 1/day?
                    // Let's interpret 'habit.goal' as 'Target Completions Per Month' for this view, OR 
                    // simple count if specific logic isn't clear.
                    // The image shows Goal 5, 7, 15... seems like monthly target.

                    // If existing backend has `goal` as "1 (times per day)", we might need to adjust interpretation.
                    // Let's assume for now we calculate % based on (completed / (daysInMonth * dailyGoal))? 
                    // OR just completed / 30 for daily habits?
                    // For simplicity: Percentage = (completed / daysPassed or TotalDays) * 100?
                    // Image shows "80%", "86%".
                    // Let's use (completed / daysInMonth) * 100 for daily habits.

                    const percentage = Math.round((completedCount / daysCount) * 100);

                    return (
                        <motion.div
                            key={habit._id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="grid grid-cols-[250px_60px_1fr_100px] border-b border-black/10 last:border-b-0 hover:bg-gray-50"
                        >
                            {/* Habit Name */}
                            <div className="p-3 border-r border-black/10 flex items-center font-bold text-sm text-gray-800">
                                {habit.title}
                            </div>

                            {/* Goal Number */}
                            <div className="p-3 border-r border-black/10 flex items-center justify-center font-bold text-sm text-gray-800">
                                {habit.goal || '-'}
                            </div>

                            {/* Days Grid */}
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${daysCount}, minmax(30px, 1fr))` }}>
                                {days.map((day) => {
                                    const status = getStatus(habit._id, day.fullDate);
                                    const isFuture = day.date > new Date(); // Simple future check

                                    return (
                                        <div
                                            key={day.number}
                                            className={`border-r border-black/5 last:border-r-0 flex items-center justify-center relative group
                                                ${status === 'completed' ? 'bg-transparent' : ''}
                                                ${status === 'missed' ? 'bg-transparent' : ''}
                                                ${onToggle && !isFuture ? 'cursor-pointer' : 'cursor-default'}
                                            `}
                                            onClick={() => onToggle && !isFuture && onToggle(habit._id, day.fullDate)}
                                        >
                                            {/* We mimic the design: Filled squares for done? Or X/Check? */}
                                            {/* Design shows colored squares with X or Check or just color. */}
                                            {/* Design: 
                                                'Stretch': Green square with 'X'?
                                                'Walk': Blue square with 'X'.
                                                Some are blank. Some have 'X' in color.
                                                Let's use a nice colored block with an Icon.
                                            */}

                                            {status === 'completed' && (
                                                <div className="w-6 h-6 rounded-sm bg-[#4FD1C5] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    ✓
                                                </div>
                                            )}

                                            {status === 'missed' && (
                                                <div className="w-6 h-6 rounded-sm bg-[#F56565] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    ✕
                                                </div>
                                            )}

                                            {/* Hover effect for empty cells */}
                                            {!status && !isFuture && (
                                                <div className="w-6 h-6 rounded-sm bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Progress */}
                            <div className="p-2 border-l border-black/10 flex flex-col justify-center gap-1">
                                <div className="flex justify-between items-center text-xs font-bold w-full">
                                    <span>{percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-black/10">
                                    <div
                                        className="h-full bg-[#4FD1C5]"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Description / Summary Row (merged first 3 cols) + Totals */}
                <div className="grid grid-cols-[310px_1fr_100px] border-t-2 border-black bg-white">
                    <div className="p-4 text-[10px] leading-tight text-gray-500 font-mono border-r border-black/10">
                        In the lines above, in a short but sufficiently descriptive way, write the habits you want to follow. Also input what are your monthly goals for repeating these habits.
                    </div>

                    {/* Daily Totals - need to align with grid columns exactly */}
                    <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${daysCount}, minmax(30px, 1fr))` }}>
                        {dailyTotals.map((count, i) => (
                            <div key={i} className="flex items-end justify-center pb-2 border-r border-black/5 last:border-r-0">
                                <span className="text-xs font-bold text-gray-400">{count > 0 ? count : ''}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-2 flex flex-col items-center justify-center border-l border-black/10">
                        <div className="text-2xl font-bold text-gray-800">
                            {dailyTotals.reduce((a, b) => a + b, 0)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">Completed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyHabitGrid;
