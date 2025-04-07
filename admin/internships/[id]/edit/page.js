'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/Loading';
import InternshipForm from '@/components/InternshipForm';

export default function EditInternship({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await fetch(`/api/internships/${params.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setInternship(data);
        } else {
          showToast(data.message || 'Failed to load internship', 'error');
        }
      } catch (error) {
        console.error('Error fetching internship:', error);
        showToast('Failed to load internship', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [params.id, showToast]);

  if (loading) {
    return <Loading />;
  }

  if (!internship) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        Internship not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Internship
        </h1>
        <InternshipForm internship={internship} mode="edit" />
      </div>
    </div>
  );
} 