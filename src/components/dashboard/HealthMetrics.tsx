'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  CalendarIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface HealthStats {
  totalPets: number
  upcomingVaccinations: number
  upcomingDeworming: number
  pendingAppointments: number
}

export default function HealthMetrics() {
  const { data: stats, isLoading, isError, error } = useQuery<HealthStats>({
    queryKey: ['healthStats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    }
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading health metrics: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }

  const metrics = [
    {
      name: 'Total Pets',
      value: stats?.totalPets || 0,
      icon: HeartIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      name: 'Due Vaccinations',
      value: stats?.upcomingVaccinations || 0,
      icon: ShieldCheckIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      name: 'Due Deworming',
      value: stats?.upcomingDeworming || 0,
      icon: ExclamationCircleIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      name: 'Pending Appointments',
      value: stats?.pendingAppointments || 0,
      icon: CalendarIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="bg-card overflow-hidden rounded-lg shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${metric.bgColor} rounded-md p-3`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    {metric.name}
                  </dt>
                  <dd className="text-lg font-semibold text-card-foreground">
                    {metric.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 