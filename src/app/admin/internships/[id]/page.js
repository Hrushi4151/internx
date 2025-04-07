'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/Loading';
import InternshipDetails from '@/components/InternshipDetails';
import ApplicationManagement from '@/components/ApplicationManagement';

export default function AdminInternshipDetail() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch internship details
        const internshipRes = await fetch(`/api/internships/${params.id}`);
        const internshipData = await internshipRes.json();

        if (!internshipRes.ok) {
          throw new Error(internshipData.message || 'Failed to fetch internship');
        }

        if (!internshipData.data) {
          throw new Error('No internship data received');
        }

        setInternship(internshipData.data);
      } catch (error) {
        console.error('Error fetching internship:', error);
        setError(error.message);
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchData();
    }
  }, [params?.id, showToast]);

  if (loading) {
    return <Loading />;
  }

  if (error || !internship) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || 'Internship Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error ? 'An error occurred while fetching the internship.' : 'The internship you\'re looking for could not be found.'}
          </p>
          <button
            onClick={() => router.push('/admin/internships')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {internship.title}
            </h1>
            <button
              onClick={() => router.push(`/admin/internships/${params.id}/edit`)}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Edit Internship
            </button>
          </div>
          <InternshipDetails internship={internship} />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Applications Management
          </h2>
          <ApplicationManagement internshipId={params.id} />
        </div>
      </div>
    </div>
  );
} 