'use client';
import { RiBuildingLine, RiMapPinLine, RiTimeLine, RiMoneyDollarCircleLine, RiCalendarLine } from 'react-icons/ri';

export default function InternshipDetails({ internship }) {
  if (!internship) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatStipend = (stipend) => {
    if (!stipend) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(stipend);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {internship.title}
        </h1>
        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <RiBuildingLine className="mr-1.5 h-5 w-5 flex-shrink-0" />
          {internship.company.name}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <RiMapPinLine className="mr-1.5 h-5 w-5 flex-shrink-0" />
            Location
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {internship.location || 'Remote'}
          </p>
        </div>
        <div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <RiTimeLine className="mr-1.5 h-5 w-5 flex-shrink-0" />
            Duration
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {internship.duration} {internship.duration === 1 ? 'month' : 'months'}
          </p>
        </div>
        <div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <RiMoneyDollarCircleLine className="mr-1.5 h-5 w-5 flex-shrink-0" />
            Stipend
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {formatStipend(internship.stipend)}
          </p>
        </div>
        <div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <RiCalendarLine className="mr-1.5 h-5 w-5 flex-shrink-0" />
            Apply by
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(internship.deadline)}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About the Internship
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {internship.description}
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Requirements
        </h2>
        <ul className="space-y-4">
          {internship.requirements?.map((requirement, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-green-500">•</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                {requirement}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 