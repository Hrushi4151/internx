'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

export default function InternshipForm({ internship, mode = 'create' }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: internship?.title || '',
    company: internship?.company || '',
    location: internship?.location || '',
    description: internship?.description || '',
    requirements: internship?.requirements?.join('\n') || '',
    duration: internship?.duration || '',
    stipend: internship?.stipend || '',
    deadline: internship?.deadline ? new Date(internship.deadline).toISOString().split('T')[0] : '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = mode === 'edit' 
        ? `/api/internships/${internship._id}`
        : '/api/internships';

      const method = mode === 'edit' ? 'PUT' : 'POST';

      const requirements = formData.requirements
        .split('\n')
        .map(req => req.trim())
        .filter(Boolean);

      if (requirements.length === 0) {
        showToast('Please add at least one requirement', 'error');
        return;
      }

      const internshipData = {
        ...formData,
        duration: String(formData.duration),
        deadline: new Date(formData.deadline).toISOString(),
        requirements,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(internshipData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          mode === 'edit' 
            ? 'Internship updated successfully'
            : 'Internship created successfully',
          'success'
        );
        router.push('/admin/dashboard');
      } else {
        showToast(data.message || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showToast('Failed to submit form', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {mode === 'edit' ? 'Edit Internship' : 'Create New Internship'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Title', name: 'title', type: 'text' },
          { label: 'Company', name: 'company', type: 'text' },
          { label: 'Location', name: 'location', type: 'text' },
          { label: 'Duration (months)', name: 'duration', type: 'number', min: '1' },
          { label: 'Stipend', name: 'stipend', type: 'text' },
          { label: 'Application Deadline', name: 'deadline', type: 'date' },
        ].map(({ label, name, type, min }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <input
              type={type}
              min={min}
              required
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {[
          { label: 'Description', name: 'description', rows: 4 },
          { label: 'Requirements (one per line)', name: 'requirements', rows: 4 },
        ].map(({ label, name, rows }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <textarea
              required
              rows={rows}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Saving...' : mode === 'edit' ? 'Update Internship' : 'Create Internship'}
        </button>
      </div>
    </form>
  );
}
