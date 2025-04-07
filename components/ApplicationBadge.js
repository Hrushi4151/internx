'use client';

import { 
  RiCheckLine, 
  RiCloseLine, 
  RiTimeLine 
} from 'react-icons/ri';

export default function ApplicationBadge({ status }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'accepted':
        return <RiCheckLine className="w-4 h-4 mr-1" />;
      case 'rejected':
        return <RiCloseLine className="w-4 h-4 mr-1" />;
      default:
        return <RiTimeLine className="w-4 h-4 mr-1" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      {getStatusText()}
    </span>
  );
} 