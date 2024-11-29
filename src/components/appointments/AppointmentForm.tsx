'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const appointmentSchema = z.object({
  dogId: z.string().min(1, 'Please select a dog'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  reason: z.string().min(3, 'Please enter a reason'),
  notes: z.string().optional()
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void
  onCancel: () => void
}

export default function AppointmentForm({ onSubmit, onCancel }: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
  const { register, handleSubmit, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema)
  })

  // Fetch user's dogs
  const { data: dogs } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const response = await fetch('/api/dogs')
      if (!response.ok) throw new Error('Failed to fetch dogs')
      return response.json()
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dog Selection */}
      <div>
        <label htmlFor="dogId" className="block text-sm font-medium text-gray-700">
          Select Pet
        </label>
        <select
          id="dogId"
          {...register('dogId')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a pet</option>
          {dogs?.map((dog: any) => (
            <option key={dog.id} value={dog.id}>
              {dog.name}
            </option>
          ))}
        </select>
        {errors.dogId && (
          <p className="mt-1 text-sm text-red-600">{errors.dogId.message}</p>
        )}
      </div>

      {/* Date Selection */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          {...register('date')}
          min={format(new Date(), 'yyyy-MM-dd')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      {/* Time Selection */}
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <input
          type="time"
          id="time"
          {...register('time')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.time && (
          <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
        )}
      </div>

      {/* Reason */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason for Visit
        </label>
        <input
          type="text"
          id="reason"
          {...register('reason')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., Annual checkup"
        />
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Any additional information..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Schedule Appointment
        </button>
      </div>
    </form>
  )
} 