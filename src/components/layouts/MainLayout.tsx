import { ReactNode } from 'react'
import TopNavbar from './TopNavbar'
import { User } from '@prisma/client'

interface MainLayoutProps {
  children: ReactNode
  user: User | null
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar user={user} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
} 