'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/Loading';
import { RiUser3Line, RiMailLine, RiBuildingLine, RiCalendarLine, RiFileTextLine } from 'react-icons/ri';

export default function Profile() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (res.ok) {
          setProfile(data.data);
          setFormData(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchApplications = async () => {
      if (session?.user.role === 'student') {
        try {
          const res = await fetch('/api/applications/student');
          const data = await res.json();
          if (res.ok) {
            setApplications(data.data);
          }
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      }
    };

    if (session) {
      Promise.all([fetchProfile(), fetchApplications()]).finally(() => setLoading(false));
    }
  }, [session]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.data);
        showToast('Profile updated successfully', 'success');
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return <Loading />;
  }

  const InputField = ({ icon: Icon, label, name, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
          value={formData[name]}
          onChange={(e) => handleInputChange(name, e.target.value)}
          {...props}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <RiUser3Line className="h-10 w-10 text-gray-600 dark:text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
              </div>
            </div>

            {session?.user.role === 'student' && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.department}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.year}th Year</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Applications</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{applications.length} Total</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Profile Information</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField icon={RiUser3Line} label="Full Name" type="text" required name="name" />
                <InputField icon={RiMailLine} label="Email" type="email" required disabled name="email" />
                {session?.user.role === 'student' && (
                  <>
                    <InputField icon={RiBuildingLine} label="Department" type="text" required name="department" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiCalendarLine className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          required
                          className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                          value={formData.year}
                          onChange={(e) => handleInputChange('year', e.target.value)}
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute left-3 top-3 flex items-center pointer-events-none">
                    <RiFileTextLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    rows={4}
                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    value={formData.bio}
                    name="bio"
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Write a short bio about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {session?.user.role === 'student' && applications.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Recent Applications</h3>
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{app.internship.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{app.internship.company}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.status === 'accepted'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}