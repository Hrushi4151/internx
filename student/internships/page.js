'use client';
import { useState, useEffect } from 'react';
import InternshipCard from '@/components/InternshipCard';
import SearchFilters from '@/components/SearchFilters';
import Loading from '@/components/Loading';
import { useToast } from '@/contexts/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';
import { RiFilter2Line, RiSortDesc, RiErrorWarningLine } from 'react-icons/ri';

export default function BrowseInternships() {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    duration: '',
    hideExpired: false,
    sortBy: 'newest'
  });

  const { showToast } = useToast();
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedLocation = useDebounce(filters.location, 500);

  // Fetch applications only once when component mounts
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsRes = await fetch('/api/applications/student');
        
        if (!applicationsRes.ok) {
          throw new Error(`Failed to fetch applications: ${applicationsRes.statusText}`);
        }

        const applicationsData = await applicationsRes.json();
        
        if (!applicationsData.data) {
          throw new Error('Failed to fetch applications');
        }

        // Create a map of internship ID to application
        const appMap = {};
        if (Array.isArray(applicationsData.data)) {
          applicationsData.data.forEach(app => {
            if (app && app.internship && app.internship._id) {
              appMap[app.internship._id] = app;
            }
          });
        }
        setApplications(appMap);
      } catch (error) {
        console.error('Error fetching applications:', error);
        showToast('Failed to fetch applications', 'error');
      }
    };

    fetchApplications();
  }, [showToast]);

  // Fetch internships when debounced filters change
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          search: debouncedSearch,
          location: debouncedLocation,
          duration: filters.duration,
          sortBy: filters.sortBy
        });

        const internshipsRes = await fetch('/api/internships/search?' + params);

        if (!internshipsRes.ok) {
          throw new Error(`Failed to fetch internships: ${internshipsRes.statusText}`);
        }

        const internshipsData = await internshipsRes.json();
        
        if (!internshipsData.data) {
          throw new Error('Failed to fetch internships');
        }

        let filteredInternships = internshipsData.data.internships || [];
        
        // Filter out expired internships if hideExpired is true
        if (filters.hideExpired) {
          filteredInternships = filteredInternships.filter(
            internship => new Date(internship.deadline) > new Date()
          );
        }

        setInternships(filteredInternships);
      } catch (error) {
        console.error('Error fetching internships:', error);
        setError(error.message);
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [debouncedSearch, debouncedLocation, filters.duration, filters.sortBy, filters.hideExpired, showToast]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading && internships.length === 0) {
    return <Loading />;
  }

  // Rest of the component remains the same
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Browse Internships
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleFilterChange({ hideExpired: !filters.hideExpired })}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.hideExpired
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <RiFilter2Line className="w-4 h-4 mr-2" />
                {filters.hideExpired ? 'Showing Active' : 'Show All'}
              </button>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline</option>
                <option value="stipend-high">Highest Stipend</option>
                <option value="stipend-low">Lowest Stipend</option>
              </select>
            </div>
          </div>
          <SearchFilters filters={filters} onChange={handleFilterChange} />
        </div>

        {error ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block p-4 bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <RiErrorWarningLine className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Error Loading Internships
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Internships</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{internships.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Applied To</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(applications).length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Internships</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {internships.filter(i => new Date(i.deadline) > new Date()).length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Under Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Object.values(applications).filter(a => ['pending', 'screening', 'interview'].includes(a.status)).length}
                </p>
              </div>
            </div>

            {/* Internships Grid */}
            {internships.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <RiFilter2Line className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No internships found
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search filters or check back later for new opportunities
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {internships.map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    application={applications[internship._id]}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 