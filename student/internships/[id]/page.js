'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import InternshipDetails from '@/components/InternshipDetails';
import ApplicationForm from '@/components/ApplicationForm';
import ApplicationTimeline from '@/components/ApplicationTimeline';
import Loading from '@/components/Loading';
import { useToast } from '@/contexts/ToastContext';
import { RiErrorWarningLine } from 'react-icons/ri';

export default function InternshipDetailPage() {
  const params = useParams();
  const [internship, setInternship] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch internship details
        const internshipRes = await fetch(`/api/internships/${params.id}`);
        if (!internshipRes.ok) {
          throw new Error(`Failed to fetch internship: ${internshipRes.statusText}`);
        }

        const internshipData = await internshipRes.json();
        if (!internshipData.data) {
          throw new Error('Failed to fetch internship details');
        }

        setInternship(internshipData.data);

        // Check if user has already applied
        const checkRes = await fetch(`/api/applications/check/${params.id}`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (checkData.hasApplied) {
            // If user has applied, fetch the application details
            const applicationRes = await fetch(`/api/applications/internship/${params.id}`);
            if (applicationRes.ok) {
              const applicationData = await applicationRes.json();
              if (applicationData.data && applicationData.data.length > 0) {
                setApplication(applicationData.data[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id, showToast]);

  const handleApply = async (formData) => {
    try {
      const response = await fetch('/api/applications/create', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setApplication(data.application);
      showToast('Application submitted successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !internship) {
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
                {error || 'Failed to load internship details'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = new Date(internship.deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InternshipDetails internship={internship} />

      {application ? (
        <div className="mt-8">
          <ApplicationTimeline application={application} />
        </div>
      ) : !isDeadlinePassed ? (
        <div className="mt-8">
          <ApplicationForm
            internshipId={internship._id}
            onSuccess={(newApplication) => setApplication(newApplication)}
          />
        </div>
      ) : (
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <RiErrorWarningLine className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Application Closed
              </h3>
              <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                The application deadline for this internship has passed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 