'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { User } from '@prisma/client'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User | null
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  if (!user) return null

  return <div className="min-h-screen bg-background">{children}</div>
} 