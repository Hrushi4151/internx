'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const jsonData = await res.json();
        if (res.ok && jsonData.data) {
          setNotifications(jsonData.data);
        } else {
          console.error('Failed to fetch notifications:', jsonData.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
      });
      const jsonData = await res.json();

      if (res.ok && jsonData.data) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        showToast('All notifications marked as read', 'success');
      } else {
        throw new Error(jsonData.message || 'Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      showToast(error.message || 'Failed to mark notifications as read', 'error');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Close the dropdown
      setIsOpen(false);

      console.log('Clicked notification:', notification);

      // Mark the notification as read if it's unread
      if (!notification.read) {
        const res = await fetch('/api/notifications', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notificationId: notification._id }),
        });

        if (res.ok) {
          setNotifications(prev =>
            prev.map(n =>
              n._id === notification._id ? { ...n, read: true } : n
            )
          );
        }
      }

      // Check if notification has applicationId and navigate
      if (notification.type === 'application') {
        const appId = notification.applicationId?.toString();
        console.log('Application ID:', appId);
        
        if (appId) {
          console.log('Navigating to application:', appId);
          // Use router.push for navigation
          router.push(`/student/applications/${appId}`);
        } else {
          console.log('No applicationId found in notification:', notification);
          showToast('Application details not available', 'error');
        }
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      showToast('Failed to process notification', 'error');
    }
  };

  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No notifications
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg cursor-pointer ${
                      notification.read
                        ? 'bg-gray-50 dark:bg-gray-700'
                        : 'bg-blue-50 dark:bg-blue-900'
                    } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200`}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 