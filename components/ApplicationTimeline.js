'use client';
import { RiCheckLine, RiCloseLine, RiTimeLine, RiUserLine, RiFileTextLine, RiUserVoiceLine, RiFileSearchLine } from 'react-icons/ri';

export default function ApplicationTimeline({ application }) {
  if (!application) return null;

  const getStatusIcon = (status) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'accepted':
        return <RiCheckLine className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <RiCloseLine className="h-5 w-5 text-red-500" />;
      case 'interview':
        return <RiUserVoiceLine className="h-5 w-5 text-purple-500" />;
      case 'screening':
        return <RiFileSearchLine className="h-5 w-5 text-blue-500" />;
      default:
        return <RiTimeLine className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div className="flow-root">
      <div className="relative">
        {/* Current Status */}
        <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(application.status)}
              <span className={`font-medium ${getStatusColor(application.status)}`}>
                {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'No Status'}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Current Round: {application.currentRound}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <ul className="-mb-8">
          {application.timeline?.map((event, eventIdx) => (
            <li key={event.timestamp}>
              <div className="relative pb-8">
                {eventIdx !== application.timeline.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                      {event.type === 'status_change' ? (
                        getStatusIcon(event.status)
                      ) : event.type === 'feedback' ? (
                        <RiFileTextLine className="h-5 w-5 text-blue-500" />
                      ) : (
                        <RiUserLine className="h-5 w-5 text-gray-500" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {event.type === 'status_change' ? (
                          <>
                            Status changed to{' '}
                            <span className={getStatusColor(event.status)}>
                              {event.status}
                            </span>
                          </>
                        ) : event.type === 'feedback' ? (
                          <>Received feedback: {event.message}</>
                        ) : (
                          event.message
                        )}
                      </p>
                      {event.round && (
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          Round {event.round}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(event.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 