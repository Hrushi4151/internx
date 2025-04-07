'use client';
import { useState } from 'react';
import ApplicationBadge from './ApplicationBadge';
import FileViewer from './FileViewer';
import ApplicationTimeline from './ApplicationTimeline';
import { useToast } from '@/contexts/ToastContext';

export default function ApplicationList({ applications }) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { showToast } = useToast();

  const filteredApplications = selectedStatus === 'all'
    ? applications
    : applications.filter(app => app.status === selectedStatus);

  const updateApplicationStatus = async (applicationId, newStatus, feedback = '', round = null) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          feedback,
          round: round || undefined
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      showToast('Application status updated successfully', 'success');
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating application status:', error);
      showToast('Failed to update application status', 'error');
    }
  };

  const handleStatusUpdate = async (application, newStatus) => {
    const feedback = prompt('Enter feedback for the candidate (optional):');
    let round = application.currentRound;
    
    if (newStatus === 'screening' || newStatus === 'interview') {
      round = application.currentRound + 1;
    }
    
    await updateApplicationStatus(application._id, newStatus, feedback, round);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedStatus === 'all'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {['pending', 'screening', 'interview', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedStatus === status
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredApplications.map((application) => (
          <div key={application._id} className="py-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {application.student.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {application.student.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on: {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ApplicationBadge status={application.status} />
            </div>

            <ApplicationTimeline timeline={application.timeline} />

            <div className="flex items-center space-x-4">
              <FileViewer fileData={application.resume} fileName="Resume" />
              
              {application.status !== 'accepted' && application.status !== 'rejected' && (
                <div className="flex space-x-2">
                  {application.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(application, 'screening')}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Move to Screening
                    </button>
                  )}
                  {application.status === 'screening' && (
                    <button
                      onClick={() => handleStatusUpdate(application, 'interview')}
                      className="px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
                    >
                      Move to Interview
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusUpdate(application, 'accepted')}
                    className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(application, 'rejected')}
                    className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            No applications found
          </div>
        )}
      </div>
    </div>
  );
} 