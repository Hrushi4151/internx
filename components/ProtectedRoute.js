'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
      router.push(session.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }
  }, [session, status, router, allowedRoles]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session || (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role))) {
    return null;
  }

  return children;
} 