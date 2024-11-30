'use client'

import { usePathname } from 'next/navigation'
import TopNavbar from './TopNavbar'

const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password']

export default function NavbarWrapper() {
  const pathname = usePathname()
  
  if (publicPaths.includes(pathname)) {
    return null
  }

  return <TopNavbar />
} 