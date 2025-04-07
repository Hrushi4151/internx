'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationTimeline from '@/components/ApplicationTimeline';
import { useToast } from '@/contexts/ToastContext';

export default function ReviewApplication({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(`/api/applications/${params.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setApplication(data);
          // Fetch all applications for this internship
          const studentsRes = await fetch(`/api/applications/internship/${data.internship._id}`);
          const studentsData = await studentsRes.json();
          if (studentsRes.ok) {
            setStudents(studentsData);
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          feedback,
          round: application.currentRound + (status === 'screening' || status === 'interview' ? 1 : 0)
        }),
      });

      if (res.ok) {
        showToast('Application status updated successfully', 'success');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update application status');
    } finally {
      setUpdating(false);
      setFeedback('');
    }
  };

  const handleBulkStatusUpdate = async (studentIds, status) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/bulk-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          studentIds,
          status,
          feedback,
          internshipId: application.internship._id
        }),
      });

      if (res.ok) {
        showToast('Applications status updated successfully', 'success');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update applications status');
    } finally {
      setUpdating(false);
      setFeedback('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Application Review
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {application.internship.title} - {application.internship.company}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Student Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Name:</span> {application.student.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Email:</span> {application.student.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Department:</span> {application.student.department}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Year:</span> {application.student.year}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Application Status
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Applied on:</span>{' '}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Current Round:</span>{' '}
                {application.currentRound}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Current Status:</span>{' '}
                <span className={`px-2 py-1 rounded text-sm ${
                  application.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : application.status === 'screening'
                    ? 'bg-blue-100 text-blue-800'
                    : application.status === 'interview'
                    ? 'bg-purple-100 text-purple-800'
                    : application.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Application Timeline
          </h2>
          <ApplicationTimeline 
            timeline={application.timeline} 
            students={students}
            onBulkStatusUpdate={handleBulkStatusUpdate}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resume
          </h2>
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-white hover:underline flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Resume
            </a>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Feedback
          </h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback for the candidate..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back
          </button>
          {application.status !== 'accepted' && application.status !== 'rejected' && (
            <>
              {application.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('screening')}
                  disabled={updating}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900 disabled:opacity-50"
                >
                  Move to Screening
                </button>
              )}
              {application.status === 'screening' && (
                <button
                  onClick={() => handleStatusUpdate('interview')}
                  disabled={updating}
                  className="px-4 py-2 border border-purple-500 text-purple-500 rounded-md text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900 disabled:opacity-50"
                >
                  Move to Interview
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updating}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={updating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50"
              >
                Accept
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 