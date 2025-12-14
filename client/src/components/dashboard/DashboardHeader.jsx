import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Heart } from 'lucide-react';

const DashboardHeader = ({
    year = new Date().getFullYear(),
    month = new Date().toLocaleString('default', { month: 'long' }),
    startDate,
    endDate,
    totalDays,
    successRate = 0,
    activityData = []
}) => {
    return (
        <div className="bg-[#2C2C2C] text-gray-300 p-6 rounded-none flex flex-col md:flex-row gap-8 items-start justify-between font-mono text-sm">
            {/* Left Info */}
            <div className="space-y-4 min-w-[200px]">
                <div className="grid grid-cols-[80px_1fr] gap-y-2">
                    <span className="text-gray-500">Year:</span>
                    <span className="text-white font-bold">{year}</span>

                    <span className="text-gray-500">Month:</span>
                    <span className="text-white font-bold">{month}</span>
                </div>

                <div className="h-4"></div>

                <div className="grid grid-cols-[80px_1fr] gap-y-2">
                    <span className="text-gray-500">Start Date:</span>
                    <span className="text-white">{startDate}</span>

                    <span className="text-gray-500">End Date:</span>
                    <span className="text-white">{endDate}</span>

                    <span className="text-gray-500">Total Days:</span>
                    <span className="text-white">{totalDays}</span>
                </div>
            </div>

            {/* Center Chart */}
            <div className="flex-1 w-full h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#4fd1c5"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#2C2C2C', stroke: '#4fd1c5', strokeWidth: 2 }}
                            activeDot={{ r: 5 }}
                        />
                        {/* Hidden YAxis to scale consistently but not show labels if per design */}
                        <YAxis hide domain={[0, 'dataMax + 2']} />
                    </LineChart>
                </ResponsiveContainer>
                {/* Data point labels could be customized but basic dots are good for now */}
            </div>

            {/* Right Stats */}
            <div className="min-w-[150px] flex flex-col items-center justify-center text-center space-y-2">
                <h3 className="text-red-400 font-bold tracking-wider text-xs">SUCCES RATE</h3>
                <div className="text-5xl font-bold text-white tracking-tight">
                    {successRate}%
                </div>
                <div className="flex gap-2 text-red-500 mt-2">
                    <Heart className="fill-current w-5 h-5" />
                    <Heart className="fill-current w-5 h-5" />
                </div>
                <span className="text-red-400 font-bold text-xs tracking-wider">GOOD JOB</span>
            </div>
        </div>
    );
};

export default DashboardHeader;
