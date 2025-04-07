'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import ApplicationHistory from '@/components/ApplicationHistory';

export default function InternshipDetails({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await fetch(`/api/internships/${params.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setInternship(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load internship details');
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [params.id]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleApply = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!resume) {
      showToast('Please upload your resume', 'error');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('internshipId', params.id);

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Application submitted successfully', 'success');
        router.refresh();
      } else {
        showToast(data.message || 'Failed to submit application', 'error');
      }
    } catch (err) {
      showToast('Failed to submit application', 'error');
    } finally {
      setApplying(false);
      setResume(null);
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

  const deadline = new Date(internship.deadline);
  const now = new Date();
  const isDeadlinePassed = now > deadline;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {internship.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {internship.company}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Internship Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Location:</span> {internship.location}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Duration:</span> {internship.duration}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Stipend:</span> {internship.stipend}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Deadline:</span>{' '}
                <span className={isDeadlinePassed ? 'text-red-500' : 'text-green-500'}>
                  {deadline.toLocaleDateString()}
                  {isDeadlinePassed ? ' (Passed)' : ''}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Requirements
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {internship.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Description
          </h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {internship.description}
          </p>
        </div>

        {session?.user?.role === 'student' && (
          <>
            {!isDeadlinePassed ? (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Apply for this Internship
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Resume
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        dark:file:bg-blue-900 dark:file:text-blue-100"
                    />
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={applying || !resume}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 dark:text-red-300">
                  The application deadline for this internship has passed.
                </p>
              </div>
            )}
          </>
        )}

        {session?.user?.role === 'student' && (
          <ApplicationHistory internshipId={params.id} />
        )}
      </div>
    </div>
  );
} 