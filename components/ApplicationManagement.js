'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import ApplicationBadge from './ApplicationBadge';
import ApplicationStats from './ApplicationStats';
import FileViewer from './FileViewer';

export default function ApplicationManagement({ internshipId }) {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/applications/internship/${internshipId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to load applications');
        }

        const applicationsData = data.data || [];
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
        showToast(error.message || 'Failed to load applications', 'error');
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (internshipId) {
      fetchApplications();
    }
  }, [internshipId, showToast]);

  const handleStatusUpdate = async (applicationId, newStatus, round) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, round }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      const updatedApplications = applications.map(app => 
        app._id === applicationId 
          ? { ...app, status: newStatus, currentRound: round }
          : app
      );
      setApplications(updatedApplications);
      filterApplications(selectedStatus, updatedApplications);
      showToast('Application status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  const filterApplications = (status, apps = applications) => {
    setSelectedStatus(status);
    if (!Array.isArray(apps)) {
      setFilteredApplications([]);
      return;
    }
    if (status === 'all') {
      setFilteredApplications(apps);
    } else {
      setFilteredApplications(apps.filter(app => app.status === status));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApplicationStats 
        applications={applications} 
        onFilterChange={filterApplications}
      />
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {selectedStatus === 'all' 
              ? 'All Applications' 
              : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Applications`}
          </h3>
          {selectedStatus !== 'all' && (
            <button
              onClick={() => filterApplications('all')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear Filter
            </button>
          )}
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Applied On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Current Round
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Resume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {!Array.isArray(filteredApplications) || filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => (
                <tr key={application._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {application.student?.name || 'Unknown Student'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {application.student?.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Round {application.currentRound || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ApplicationBadge status={application.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.resume ? (
                      <FileViewer 
                        fileData={application.resume}
                        fileName={`${application.student?.name || 'Student'}'s Resume`}
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        No resume
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={`${application.currentRound || 1}-${application.status}`}
                      onChange={(e) => {
                        const [round, status] = e.target.value.split('-');
                        handleStatusUpdate(application._id, status, parseInt(round));
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value="1-pending">Round 1 - Pending</option>
                      <option value="1-screening">Round 1 - Screening</option>
                      <option value="2-interview">Round 2 - Interview</option>
                      <option value="2-accepted">Round 2 - Accepted</option>
                      <option value="2-rejected">Round 2 - Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 