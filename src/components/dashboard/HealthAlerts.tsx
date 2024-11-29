'use client'

import { useQuery } from '@tanstack/react-query'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '@/components/LoadingSpinner'

interface HealthAlert {
  id: string
  type: 'vaccination' | 'deworming' | 'checkup'
  dogName: string
  message: string
  dueDate: string
}

export default function HealthAlerts() {
  const { data: alerts, isLoading } = useQuery<HealthAlert[]>({
    queryKey: ['healthAlerts'],
    queryFn: async () => {
      const response = await fetch('/api/health/alerts')
      if (!response.ok) throw new Error('Failed to fetch health alerts')
      return response.json()
    }
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Alerts</h2>
      <div className="space-y-3">
        {alerts?.length === 0 ? (
          <p className="text-sm text-gray-500">No pending health alerts</p>
        ) : (
          alerts?.map((alert) => (
            <div
              key={alert.id}
              className="bg-amber-50 border border-amber-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {alert.dogName}
                  </h3>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-amber-600 mt-1">
                    Due: {format(new Date(alert.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 