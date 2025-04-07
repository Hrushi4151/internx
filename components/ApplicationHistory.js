'use client';
import { useState, useEffect } from 'react';
import ApplicationBadge from './ApplicationBadge';
import FileViewer from './FileViewer';
import ApplicationTimeline from './ApplicationTimeline';
import { RiTimeLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';

export default function ApplicationHistory({ internshipId }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(`/api/applications/check/${internshipId}`);
        const data = await res.json();
        if (res.ok) {
          setApplication(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [internshipId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <RiCheckLine className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <RiCloseLine className="h-5 w-5 text-red-500" />;
      default:
        return <RiTimeLine className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 mt-6">
        <p className="text-red-600 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Your Application
      </h3>
      <div className="space-y-6">
        {/* Application Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {application.internship.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {application.internship.company}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Applied on: {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
          <ApplicationBadge status={application.status} />
        </div>

        {/* Current Round */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(application.status)}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Current Round: {application.currentRound}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {application.timeline && application.timeline.length > 0 && (
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Round-wise Status History
            </h4>
            <div className="space-y-4">
              {application.timeline.map((event, index) => (
                <div key={event.updatedAt} className="relative">
                  {index !== application.timeline.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600" />
                  )}
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800 ${
                        event.status === 'accepted'
                          ? 'bg-green-100 dark:bg-green-900'
                          : event.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-900'
                          : event.status === 'interview'
                          ? 'bg-purple-100 dark:bg-purple-900'
                          : event.status === 'screening'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-yellow-100 dark:bg-yellow-900'
                      }`}>
                        {getStatusIcon(event.status)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Round {event.round}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </p>
                      {event.feedback && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-600 p-2 rounded">
                          Feedback: {event.feedback}
                        </p>
                      )}
                      {event.updatedBy && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Updated by: {event.updatedBy.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume */}
        {application.resume && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Submitted Resume
            </h4>
            <FileViewer fileData={application.resume} fileName="Your Resume" />
          </div>
        )}
      </div>
    </div>
  );
} 