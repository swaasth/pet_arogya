'use client'

import { useQuery } from '@tanstack/react-query'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'

interface VaccinationEvent {
  id: string
  dogName: string
  vaccineName: string
  date: Date
}

export default function VaccinationSchedule() {
  const { data, isLoading } = useQuery<{ vaccinations: VaccinationEvent[] }>({
    queryKey: ['vaccinations', 'upcoming'],
    queryFn: async () => {
      const response = await fetch('/api/vaccinations/upcoming')
      if (!response.ok) throw new Error('Failed to fetch vaccinations')
      return response.json()
    }
  })

  const startDate = startOfWeek(new Date())
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i))

  if (isLoading) {
    return <div className="animate-pulse">Loading schedule...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date) => {
          const dayEvents = data?.vaccinations?.filter(event => 
            isSameDay(new Date(event.date), date)
          )

          return (
            <div 
              key={date.toISOString()}
              className={`p-3 rounded-lg text-center ${
                dayEvents?.length 
                  ? 'bg-pink-50 border border-pink-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium text-gray-500">
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {format(date, 'd')}
              </div>
              {dayEvents?.map(event => (
                <div 
                  key={event.id}
                  className="mt-1 text-xs text-pink-700 truncate"
                  title={`${event.dogName} - ${event.vaccineName}`}
                >
                  {event.dogName}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
} 