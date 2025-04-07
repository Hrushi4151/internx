'use client';
import { useState, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { RiUpload2Line, RiFileUploadLine } from 'react-icons/ri';

export default function FileUpload({ onFileSelect, accept = '.pdf', maxSize = 5 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    // Check file type
    if (!file.type.includes('pdf')) {
      showToast('Please upload a PDF file', 'error');
      return false;
    }

    // Check file size (in MB)
    if (file.size > maxSize * 1024 * 1024) {
      showToast(`File size must be less than ${maxSize}MB`, 'error');
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10'
          : 'border-gray-300 dark:border-gray-600'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileInput}
      />

      <div className="space-y-2">
        {selectedFile ? (
          <RiFileUploadLine className="mx-auto h-12 w-12 text-gray-400" />
        ) : (
          <RiUpload2Line className="mx-auto h-12 w-12 text-gray-400" />
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">
            Click to upload
          </span>{' '}
          or drag and drop
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          PDF up to {maxSize}MB
        </p>

        {selectedFile && (
          <div className="mt-4 text-sm text-gray-900 dark:text-white">
            Selected: {selectedFile.name}
          </div>
        )}
      </div>
    </div>
  );
} 