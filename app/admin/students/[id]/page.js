'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/Loading';
import ApplicationBadge from '@/components/ApplicationBadge';
import FileViewer from '@/components/FileViewer';
import { use } from 'react';

export default function StudentDetail({ params }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const studentId = use(params).id;

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [studentRes, applicationsRes] = await Promise.all([
          fetch(`/api/admin/students/${studentId}`),
          fetch(`/api/admin/students/${studentId}/applications`),
        ]);

        const [studentData, applicationsData] = await Promise.all([
          studentRes.json(),
          applicationsRes.json(),
        ]);

        if (studentRes.ok) {
          setStudent(studentData.data || null);
        } else {
          throw new Error(studentData.message || 'Failed to fetch student data');
        }
        
        if (applicationsRes.ok) {
          setApplications(applicationsData.data || []);
        } else {
          throw new Error(applicationsData.message || 'Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        showToast(error.message || 'Failed to load student data', 'error');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, showToast]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications(prev =>
          prev.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        showToast('Application status updated', 'success');
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student not found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Student Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Student Profile
          </h1>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {student.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {student.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Joined On
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Application Statistics
              </h3>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Applications
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.length}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pending
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.filter(app => app.status === 'pending').length}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Accepted
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.filter(app => app.status === 'accepted').length}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Rejected
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.filter(app => app.status === 'rejected').length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Applications
          </h2>
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {application.internship.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {application.internship.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ApplicationBadge status={application.status} />
                </div>
                <div className="flex items-center space-x-4">
                  <FileViewer fileData={application.resume} fileName="Resume" />
                  {application.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'accepted')}
                        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No applications found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 