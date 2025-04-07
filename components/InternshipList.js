'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import InternshipFilters from './InternshipFilters';
import Pagination from './Pagination';
import Loading from './Loading';

export default function InternshipList() {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    duration: '',
    sortBy: 'newest',
  });

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      const res = await fetch(`/api/internships/search?${params}`);
      const data = await res.json();

      if (res.ok) {
        setInternships(data.internships);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages,
        }));
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [pagination.page, filters]);

  const handleFilter = (newFilters) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <InternshipFilters onFilter={handleFilter} />

      {internships.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No internships found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {internship.title}
                </h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>{internship.company}</p>
                  <p>{internship.location}</p>
                  <p>Duration: {internship.duration} months</p>
                  <p>Stipend: {internship.stipend}</p>
                  <p>
                    Deadline:{' '}
                    {new Date(internship.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/student/internships/${internship._id}`}
                    className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
} 