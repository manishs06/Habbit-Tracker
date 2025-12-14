import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CircularProgress = ({ percentage, color, label, subLabel }) => {
    const data = [
        { name: 'Completed', value: percentage },
        { name: 'Remaining', value: 100 - percentage },
    ];

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={40}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="cell-0" fill={color} />
                            <Cell key="cell-1" fill="#333" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white/50">{percentage}%</span>
                </div>
            </div>
            <div className="flex flex-col">
                {subLabel && <span className="text-xs text-gray-500 uppercase tracking-wider">{subLabel}</span>}
                <span className="text-lg font-bold text-gray-400 leading-tight block max-w-[100px] uppercase">
                    {label}
                </span>
            </div>
        </div>
    );
};

const DashboardBottom = ({
    monthlyProgress = 0,
    normalizedProgress = 0,
    momentum = 0,
    totalCompleted = 0,
    totalGoal = 0
}) => {
    return (
        <div className="bg-[#2C2C2C] p-6 flex flex-col md:flex-row items-center justify-between gap-8 rounded-b-xl border-t border-gray-800">
            {/* Chart 1: Monthly Progress */}
            <CircularProgress
                percentage={monthlyProgress}
                color="#EF4444" // Red
                label="MONTHLY PROGRESS"
            />

            {/* Chart 2: Normalized */}
            <CircularProgress
                percentage={normalizedProgress}
                color="#06B6D4" // Cyan
                label="PROGRESS NORMALIZED"
                subLabel="22 DAYS"
            />

            {/* Chart 3: Momentum */}
            <CircularProgress
                percentage={momentum}
                color="#F59E0B" // Amber
                label="PROGRESS MOMENTUM"
                subLabel="LAST 3 DAYS"
            />

            {/* Total Count Text */}
            <div className="text-center md:text-right">
                <div className="text-4xl font-bold text-white">
                    {totalCompleted}<span className="text-gray-500">/</span>{totalGoal}
                </div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                    Completed
                </div>
            </div>

            <div className="text-right">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    MONTHLY
                </div>
                <div className="text-xl font-bold text-white uppercase tracking-wider">
                    HABIT
                </div>
                <div className="text-xl font-bold text-white uppercase tracking-wider">
                    TRACKER
                </div>
            </div>
        </div>
    );
};

export default DashboardBottom;
