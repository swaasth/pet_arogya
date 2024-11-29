'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import RoleSelectionModal from '../auth/RoleSelectionModal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [showRoleModal, setShowRoleModal] = useState(false)

  useEffect(() => {
    if (session?.user?.needsRoleSelection) {
      setShowRoleModal(true)
    }
  }, [session])

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col">
          {/* Main Content */}
          <main className="flex-1">
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      {showRoleModal && (
        <RoleSelectionModal 
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)} 
        />
      )}
    </>
  )
} 