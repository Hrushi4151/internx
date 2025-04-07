'use client';
import Link from 'next/link';

export default function AdminInternshipCard({ internship }) {
  const isDeadlinePassed = new Date(internship.deadline) < new Date();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {internship.title}
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          {internship.applicationCount} Applications
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <p>{internship.company}</p>
        <p>{internship.location}</p>
        <p>Duration: {internship.duration} months</p>
        <p>Stipend: {internship.stipend}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Deadline: {new Date(internship.deadline).toLocaleDateString()}
          {isDeadlinePassed && (
            <span className="ml-2 text-red-600 dark:text-red-400">
              (Closed)
            </span>
          )}
        </div>
        <Link
          href={`/admin/internships/${internship._id}`}
          className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 