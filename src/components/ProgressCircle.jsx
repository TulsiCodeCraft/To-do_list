import React from 'react';

const ProgressCircle = ({ tasks = [], isDarkMode }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  
    const getStrokeColor = () => {
        if (completionPercentage === 100) return isDarkMode ? '#1706a1' : '#065F46'; // Dark blue for dark mode, dark green for light mode
        return isDarkMode ? '#1706a1' : '#065F46'; // Light blue for dark mode, light green for light mode
    };


    return (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Today Tasks</div>
                    <div className="text-2xl font-bold">{totalTasks}</div>
                </div>
            </div>

            <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={isDarkMode ? "#3B82F6" : "#3e9c60"} // Dark blue for dark mode, green for light mode
                        strokeWidth="16"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={getStrokeColor()}
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - completionPercentage / 100)}
                        className="transition-all duration-500"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round(completionPercentage)}%
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Completed
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-between text-sm">
                <div className="space-y-2">
                    {/* Completed Task Indicator */}
                    <div className="flex items-center">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: isDarkMode ? '#1706a1' : '#065F46' }} // Dark blue for dark mode, dark green for light mode
                        ></div>
                        <div style={{ color: isDarkMode ? '#1706a1' : '#065F46' }}>
                            Completed: {completedTasks}
                        </div>
                    </div>
                    {/* Pending Task Indicator */}
                    <div className="flex items-center">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: isDarkMode ? '#3B82F6' : '#3e9c60' }} // Light blue for dark mode, light green for light mode
                        ></div>
                        <div style={{ color: isDarkMode ? '#3B82F6' : '#3e9c60' }}>
                            Pending: {pendingTasks}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressCircle;