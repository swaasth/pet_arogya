'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarIcon, ClockIcon, ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

const appointmentSchema = z.object({
  dogId: z.string().min(1, 'Please select a pet'),
  vetId: z.string().min(1, 'Please select a veterinarian'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  type: z.string().min(1, 'Please select appointment type'),
  notes: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface NewAppointmentFormProps {
  pets: { id: string; name: string; breed: string }[]
  vets: { id: string; full_name: string; specialization: string }[]
}

const appointmentTypes = [
  'Regular Checkup',
  'Vaccination',
  'Emergency',
  'Surgery',
  'Dental Care',
  'Grooming'
]

export default function NewAppointmentForm({ pets, vets }: NewAppointmentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  })

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true)
      const dateTime = new Date(`${data.date}T${data.time}`)

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dateTime,
          status: 'scheduled'
        }),
      })

      if (!response.ok) throw new Error('Failed to create appointment')

      toast.success('Appointment scheduled successfully!')
      router.push('/appointments')
      router.refresh()
    } catch (error) {
      toast.error('Failed to schedule appointment')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/appointments"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Appointments
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Schedule New Appointment</h1>
        <p className="mt-1 text-sm text-gray-500">
          Book a veterinary appointment for your pet
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pet Selection */}
          <div>
            <label htmlFor="dogId" className="block text-sm font-medium text-gray-700">
              Select Pet
            </label>
            <select
              id="dogId"
              {...register('dogId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Choose a pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.breed})
                </option>
              ))}
            </select>
            {errors.dogId && (
              <p className="mt-1 text-sm text-red-600">{errors.dogId.message}</p>
            )}
          </div>

          {/* Vet Selection */}
          <div>
            <label htmlFor="vetId" className="block text-sm font-medium text-gray-700">
              Select Veterinarian
            </label>
            <select
              id="vetId"
              {...register('vetId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Choose a veterinarian</option>
              {vets.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  Dr. {vet.full_name} ({vet.specialization})
                </option>
              ))}
            </select>
            {errors.vetId && (
              <p className="mt-1 text-sm text-red-600">{errors.vetId.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="mt-1 relative">
                <input
                  type="date"
                  id="date"
                  {...register('date')}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <div className="mt-1 relative">
                <input
                  type="time"
                  id="time"
                  {...register('time')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Appointment Type
            </label>
            <select
              id="type"
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Select type</option>
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Any specific concerns or information..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scheduling...
                </>
              ) : (
                'Schedule Appointment'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 