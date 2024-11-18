'use client'

import { mockDogs, mockVaccinations, mockDewormingRecords } from '@/lib/mockData'
import { CalendarIcon, UserGroupIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function HealthMetrics() {
  const upcomingVaccinations = mockVaccinations.filter(
    (v) => new Date(v.nextDue) > new Date()
  ).length

  const upcomingDeworming = mockDewormingRecords.filter(
    (d) => new Date(d.nextDue) > new Date()
  ).length

  const stats = [
    { name: 'Total Dogs', stat: mockDogs.length, icon: UserGroupIcon },
    { name: 'Upcoming Vaccinations', stat: upcomingVaccinations, icon: CalendarIcon },
    { name: 'Due for Deworming', stat: upcomingDeworming, icon: ExclamationCircleIcon },
  ]

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Health Overview</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
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