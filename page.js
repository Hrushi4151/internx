import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-gray-600 dark:text-gray-400">
                Internship Management System
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your internship journey with our comprehensive management portal.
              Apply for internships, track applications, and manage your career growth all in one place.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {session ? (
                <Link
                  href={session.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-24">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Easy Application Process',
                  description: 'Apply to multiple internships with just a few clicks. Upload your resume and track your applications in real-time.',
                },
                {
                  title: 'Real-time Notifications',
                  description: 'Stay updated with instant notifications about application status changes and new internship opportunities.',
                },
                {
                  title: 'Comprehensive Dashboard',
                  description: 'Get a clear overview of your applications, pending tasks, and upcoming deadlines all in one place.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="pt-6"
                >
                  <div className="flow-root bg-white dark:bg-gray-800 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Internship Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
