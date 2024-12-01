import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserMenu } from '../common/UserMenu'
import { PawPrintIcon, SunIcon, MoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'

interface TopNavbarProps {
  user?: {
    id: string
    email: string
    role: string
    full_name?: string | null
  }
}

interface NavItem {
  label: string
  href: string
  roles: string[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', roles: ['pet_owner', 'veterinary', 'admin'] },
  { label: 'My Dogs', href: '/dogs', roles: ['pet_owner'] },
  { label: 'Appointments', href: '/appointments', roles: ['pet_owner', 'veterinary'] },
  { label: 'Health Records', href: '/health', roles: ['pet_owner', 'veterinary'] },
  { label: 'Profile', href: '/profile', roles: ['pet_owner', 'veterinary', 'admin'] },
]

export default function TopNavbar({ user }: TopNavbarProps) {
  const pathname = usePathname()
  const userRole = user?.role || 'pet_owner'
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center">
          <PawPrintIcon className="h-8 w-8 text-purple-600" />
          <span className="ml-2 text-2xl font-bold text-foreground">Pet Arogya</span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mr-2"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          )}
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  )
} 