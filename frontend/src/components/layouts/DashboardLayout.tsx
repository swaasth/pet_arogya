'use client'

import Link from 'next/link'
import UserMenu from '@/components/UserMenu'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <span className="text-xl font-bold text-indigo-600">Pet Arogya</span>
              <nav className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dogs" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  My Pets
                </Link>
                <Link 
                  href="/appointments" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Appointments
                </Link>
                <UserMenu />
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 