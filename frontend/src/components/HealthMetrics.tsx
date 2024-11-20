'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarIcon, UserGroupIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface DashboardStats {
  totalDogs: number
  upcomingVaccinations: number
  upcomingDeworming: number
}

export default function HealthMetrics() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      return response.json()
    }
  })

  if (isLoading) {
    return <div className="animate-pulse">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Loading Health Overview...</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </dl>
    </div>
  }

  if (error) {
    return <div className="text-red-600">Error loading health metrics</div>
  }

  const metricsData = [
    { name: 'Total Dogs', stat: stats?.totalDogs || 0, icon: UserGroupIcon },
    { name: 'Upcoming Vaccinations', stat: stats?.upcomingVaccinations || 0, icon: CalendarIcon },
    { name: 'Due for Deworming', stat: stats?.upcomingDeworming || 0, icon: ExclamationCircleIcon },
  ]

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Health Overview</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {metricsData.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
} 