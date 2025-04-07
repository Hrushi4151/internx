'use client';
import Link from 'next/link';
import { useState } from 'react';
import ApplicationBadge from './ApplicationBadge';
import { 
  RiBuilding2Line, 
  RiMapPinLine, 
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiArrowRightLine,
  RiHistoryLine
} from 'react-icons/ri';

export default function InternshipCard({ internship, application }) {
  const [showTimeline, setShowTimeline] = useState(false);
  const isDeadlinePassed = new Date(internship.deadline) < new Date();

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'screening': return '📝';
      case 'interview': return '👥';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '•';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {internship.title}
        </h3>
        {application && (
          <ApplicationBadge status={application.status} />
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <p className="flex items-center">
          <RiBuilding2Line className="w-4 h-4 mr-2" />
          {internship.company}
        </p>
        <p className="flex items-center">
          <RiMapPinLine className="w-4 h-4 mr-2" />
          {internship.location}
        </p>
        <p className="flex items-center">
          <RiTimeLine className="w-4 h-4 mr-2" />
          Duration: {internship.duration} months
        </p>
        <p className="flex items-center">
          <RiMoneyDollarCircleLine className="w-4 h-4 mr-2" />
          Stipend: {internship.stipend}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <RiCalendarLine className="w-4 h-4 mr-2" />
            Deadline: {new Date(internship.deadline).toLocaleDateString()}
            {isDeadlinePassed && (
              <span className="ml-2 text-red-600 dark:text-red-400">
                (Closed)
              </span>
            )}
          </div>
          {application ? (
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              <RiHistoryLine className="w-4 h-4 mr-1" />
              Timeline
            </button>
          ) : (
            <Link
              href={`/student/internships/${internship._id}`}
              className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              View Details
              <RiArrowRightLine className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

        {/* Application Timeline */}
        {showTimeline && application && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Application Timeline
            </h4>
            <div className="space-y-3">
              {application.timeline.map((event, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-sm">
                    {getTimelineIcon(event.status)}
                  </span>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      {event.round && ` - Round ${event.round}`}
                    </p>
                    {event.feedback && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {event.feedback}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(event.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 