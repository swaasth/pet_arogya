'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navigation() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/auth/login',
      redirect: true
    });
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Pet Arogya</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {status === 'authenticated' && session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 