'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'
import TimeSlotGrid from './TimeSlotGrid'

const DEFAULT_TIME_SLOTS = Array.from({ length: 24 }, (_, i) => ({
  startTime: `${String(i).padStart(2, '0')}:00`,
  endTime: `${String(i + 1).padStart(2, '0')}:00`,
  available: false
}))

export default function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ['availability', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await fetch(
        `/api/veterinarians/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`
      )
      if (!response.ok) throw new Error('Failed to fetch availability')
      return response.json()
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (slots: typeof DEFAULT_TIME_SLOTS) => {
      const response = await fetch('/api/veterinarians/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          slots
        })
      })
      if (!response.ok) throw new Error('Failed to update availability')
      return response.json()
    },
    onSuccess: () => {
      toast.success('Availability updated successfully')
    },
    onError: () => {
      toast.error('Failed to update availability')
    }
  })

  const slots = availabilityData?.slots || DEFAULT_TIME_SLOTS

  const handleSlotToggle = (index: number) => {
    const newSlots = [...slots]
    newSlots[index] = {
      ...newSlots[index],
      available: !newSlots[index].available
    }
    updateMutation.mutate(newSlots)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeSlotGrid
            slots={slots}
            onSlotToggle={handleSlotToggle}
            isLoading={isLoading || updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
} 