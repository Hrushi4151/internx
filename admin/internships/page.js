'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageInternships() {
  const router = useRouter();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch('/api/internships');
        const jsonData = await res.json();
        
        if (res.ok && jsonData.data) {
          setInternships(jsonData.data);
        } else {
          setError(jsonData.message || 'Failed to load internships');
        }
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to load internships');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: 'DELETE',
      });
      const jsonData = await res.json();

      if (res.ok) {
        setInternships(internships.filter(internship => internship._id !== id));
      } else {
        setError(jsonData.message || 'Failed to delete internship');
      }
    } catch (err) {
      console.error('Error deleting internship:', err);
      setError('Failed to delete internship');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Internships
        </h1>
        <button
          onClick={() => router.push('/admin/internships/new')}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Post New Internship
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        ) : internships.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {internships.map((internship) => (
                <tr key={internship._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {internship.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {internship.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {internship.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(internship.deadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {internship.applicationCount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link
                      href={`/admin/internships/${internship._id}`}
                      className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/admin/internships/${internship._id}/edit`}
                      className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(internship._id)}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
            No internships posted yet.
          </div>
        )}
      </div>
    </div>
  );
} 