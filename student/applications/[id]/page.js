'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/Loading';
import ApplicationTimeline from '@/components/ApplicationTimeline';
import { RiErrorWarningLine } from 'react-icons/ri';

export default function ApplicationDetailPage() {
  const params = useParams();
  const { showToast } = useToast();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/applications/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch application details');
        }

        setApplication(data.data);
      } catch (error) {
        console.error('Error fetching application:', error);
        setError(error.message);
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params?.id, showToast]);

  if (loading) {
    return <Loading />;
  }

  if (error || !application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <RiErrorWarningLine className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error || 'Failed to load application details'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Application Details
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {application.internship.title} - {application.internship.company}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Internship Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Company:</span> {application.internship.company}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Location:</span> {application.internship.location}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Duration:</span> {application.internship.duration} months
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Stipend:</span> ₹{application.internship.stipend}/month
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
                <span className="font-medium">Status:</span>{' '}
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
          <ApplicationTimeline application={application} />
        </div>

        {application.resume && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Uploaded Resume
            </h2>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {application.resume.filename}
              </p>
              <a
                href={`data:${application.resume.contentType};base64,${application.resume.data}`}
                download={application.resume.filename}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download Resume
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 