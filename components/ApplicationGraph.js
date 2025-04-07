'use client';
import { useEffect, useState } from 'react';

export default function ApplicationGraph({ applications }) {
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    // Group applications by date
    const stats = applications.reduce((acc, app) => {
      const date = new Date(app.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort by date
    const sortedStats = Object.entries(stats)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Get last 7 days

    setDailyStats(sortedStats);
  }, [applications]);

  const maxCount = Math.max(...dailyStats.map(stat => stat.count), 1);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Application Trends (Last 7 Days)
      </h2>
      <div className="h-64">
        <div className="flex items-end h-48 gap-4">
          {dailyStats.map((stat, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t"
                style={{ 
                  height: `${(stat.count / maxCount) * 100}%`,
                  minHeight: '1px'
                }}
              />
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {new Date(stat.date).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {stat.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 