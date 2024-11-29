'use client'

import { usePathname } from 'next/navigation'
import TopNavbar from './TopNavbar'

export default function NavbarWrapper() {
  const pathname = usePathname()
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth/')

  if (isPublicPage) {
    return null
  }

  return <TopNavbar />
} 