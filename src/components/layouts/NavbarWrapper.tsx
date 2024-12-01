'use client'

import { usePathname } from 'next/navigation'
import TopNavbar from './TopNavbar'
import { useSession } from 'next-auth/react'

export default function NavbarWrapper() {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  // Don't show navbar on root and auth pages
  const hideNavbarPaths = ['/', '/auth/login', '/auth/register']
  if (hideNavbarPaths.includes(pathname)) {
    return null
  }

  return <TopNavbar user={session?.user} />
} 