import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserButton } from '@/components/UserButton';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import Logo from '@/components/Logo';

export default async function StudentLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'student') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Logo />
              </div>
              <div className="ml-6 flex space-x-8">
                <Link
                  href="/student/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/student/internships"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Browse Internships
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationsDropdown />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {session.user.email}
              </span>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">{children}</main>
    </div>
  );
} 