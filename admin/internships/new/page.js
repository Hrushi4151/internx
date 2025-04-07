'use client';
import InternshipForm from '@/components/InternshipForm';
import { RiBriefcaseLine } from 'react-icons/ri';

export default function NewInternship() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <RiBriefcaseLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Post New Internship
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-11">
          Create a new internship opportunity and find the perfect candidate for your organization.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <InternshipForm />
          </div>
        </div>
      </div>
    </div>
  );
} 