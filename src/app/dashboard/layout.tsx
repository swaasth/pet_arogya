import { ReactNode } from 'react'
import type { User } from '@prisma/client'

interface DashboardLayoutProps {
  children: ReactNode
  user: User | null
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
} 