'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { RiUploadCloud2Line, RiCloseLine, RiCheckLine, RiFileUploadLine } from 'react-icons/ri';

export default function ApplicationForm({ internshipId, onSuccess, onCancel }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.includes('pdf')) {
      showToast('Please upload a PDF file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    setResume(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      showToast('Please upload your resume', 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('internshipId', internshipId);
      formData.append('resume', resume);

      const response = await fetch('/api/applications/create', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      showToast('Application submitted successfully', 'success');
      if (onSuccess) {
        onSuccess(data.application);
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Apply for this Internship
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />

          <div className="space-y-2">
            <div className="flex justify-center">
              {resume ? (
                <RiCheckLine className="h-12 w-12 text-green-500" />
              ) : (
                <RiUploadCloud2Line className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {resume ? (
                <>
                  <p className="font-medium text-indigo-600 dark:text-indigo-400">
                    {resume.name}
                  </p>
                  <p className="text-xs">
                    Click or drag another file to replace
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">
                    Drag and drop your resume, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                    >
                      browse
                    </button>
                  </p>
                  <p>PDF up to 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!resume || loading}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <RiFileUploadLine className="-ml-1 mr-2 h-4 w-4" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 