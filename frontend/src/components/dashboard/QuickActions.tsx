import Link from 'next/link'
import { 
  PlusCircleIcon, 
  CalendarIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline'

const actions = [
  {
    name: 'Add New Pet',
    href: '/dogs/new',
    icon: PlusCircleIcon,
    description: 'Register a new pet to your family'
  },
  {
    name: 'View All Records',
    href: '/records',
    icon: DocumentTextIcon,
    description: 'Access complete vaccination history'
  },
  {
    name: 'Book Appointment',
    href: '/appointments/new',
    icon: CalendarIcon,
    description: 'Schedule a vet visit'
  }
]

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <action.icon className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                {action.name}
              </h3>
              <p className="text-xs text-gray-500">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 