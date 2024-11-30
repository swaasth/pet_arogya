import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@prisma/client'
import { UserMenu } from '../common/UserMenu'
import { Logo } from '../common/Logo'

interface TopNavbarProps {
  user: User
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
  const userRole = user.role

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Logo />
        
        <div className="ml-auto flex items-center space-x-4">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  )
} 