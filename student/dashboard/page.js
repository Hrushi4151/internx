'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/Loading';
import InternshipCard from '@/components/InternshipCard';
import ApplicationStatus from '@/components/ApplicationStatus';
import ApplicationSearchFilters from '@/components/ApplicationSearchFilters';

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    screening: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications/student');
        const jsonData = await res.json();

        if (res.ok && jsonData.data) {
          setApplications(jsonData.data);
          setFilteredApplications(jsonData.data);
          
          // Calculate stats
          const newStats = jsonData.data.reduce((acc, app) => {
            acc.total++;
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
          }, {
            total: 0,
            pending: 0,
            screening: 0,
            interview: 0,
            accepted: 0,
            rejected: 0
          });

          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Show success message when redirected from application submission
    if (searchParams.get('applied') === 'true') {
      showToast('Application submitted successfully', 'success');
    }
  }, [showToast, searchParams]);

  const handleFiltersChange = (filters) => {
    let filtered = [...applications];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.internship.title.toLowerCase().includes(searchLower) ||
        app.internship.company.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'company':
          return a.internship.company.localeCompare(b.internship.company);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredApplications(filtered);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-100">Pending</h3>
            <p className="mt-2 text-3xl font-semibold text-yellow-800 dark:text-yellow-100">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-100">Screening</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-800 dark:text-blue-100">{stats.screening}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-purple-800 dark:text-purple-100">Interview</h3>
            <p className="mt-2 text-3xl font-semibold text-purple-800 dark:text-purple-100">{stats.interview}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-100">Accepted</h3>
            <p className="mt-2 text-3xl font-semibold text-green-800 dark:text-green-100">{stats.accepted}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-100">Rejected</h3>
            <p className="mt-2 text-3xl font-semibold text-red-800 dark:text-red-100">{stats.rejected}</p>
          </div>
        </div>

        {/* Search Filters */}
        <ApplicationSearchFilters onFiltersChange={handleFiltersChange} />

        {/* Applications List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              My Applications
            </h2>
            {filteredApplications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                {applications.length === 0 ? 'No applications yet' : 'No applications match your filters'}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application._id}
                    onClick={() => router.push(`/student/applications/${application._id}`)}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {application.internship.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {application.internship.company} • {application.internship.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ApplicationStatus status={application.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 