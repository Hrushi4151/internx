'use client';

export default function ApplicationStats({ applications = [], onFilterChange }) {
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    screening: applications.filter(app => app.status === 'screening').length,
    interview: applications.filter(app => app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const statCards = [
    { 
      label: 'Total Applications', 
      value: stats.total, 
      status: 'all',
      color: 'bg-gray-900 text-white dark:bg-gray-700',
      icon: (
        <svg className="w-6 h-6 mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      label: 'Pending', 
      value: stats.pending,
      status: 'pending',
      color: 'bg-yellow-500 text-white dark:bg-yellow-600',
      icon: (
        <svg className="w-6 h-6 mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'In Screening', 
      value: stats.screening,
      status: 'screening',
      color: 'bg-blue-500 text-white dark:bg-blue-600',
      icon: (
        <svg className="w-6 h-6 mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    { 
      label: 'In Interview', 
      value: stats.interview,
      status: 'interview',
      color: 'bg-purple-500 text-white dark:bg-purple-600',
      icon: (
        <svg className="w-6 h-6 mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      label: 'Accepted', 
      value: stats.accepted,
      status: 'accepted',
      color: 'bg-green-500 text-white dark:bg-green-600',
      icon: (
        <svg className="w-6 h-6 mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Rejected', 
      value: stats.rejected,
      status: 'rejected',
      color: 'bg-red-500 text-white dark:bg-red-600',
      icon: (
        <svg className="w-6 h-6 mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <button
          key={index}
          onClick={() => onFilterChange(stat.status)}
          className={`${stat.color} rounded-lg p-6 text-center transform transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer w-full`}
        >
          <div className="flex flex-col items-center">
            {stat.icon}
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-medium opacity-90">{stat.label}</div>
          </div>
        </button>
      ))}
    </div>
  );
} 