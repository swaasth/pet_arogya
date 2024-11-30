'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { dogSchema } from '@/lib/validations/dog'
import type { Dog } from '@/types/dog'
import { z } from 'zod'

interface DogFormProps {
  initialData?: Partial<Dog>
  isEditing?: boolean
}

type DogFormData = z.infer<typeof dogSchema>

export default function DogForm({ initialData, isEditing = false }: DogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(dogSchema),
    defaultValues: {
      name: initialData?.name || '',
      breed: initialData?.breed || '',
      dob: initialData?.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
      gender: initialData?.gender || 'male',
      colorMarkings: initialData?.colorMarkings || '',
      microchipId: initialData?.microchipId || '',
      medicalNotes: initialData?.medicalNotes || ''
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: DogFormData) => {
      const response = await fetch(`/api/dogs${isEditing ? `/${initialData?.id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save dog')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast.success(`Dog successfully ${isEditing ? 'updated' : 'added'}`)
      router.push('/dogs')
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit = async (data: DogFormData) => {
    setIsSubmitting(true)
    try {
      await mutation.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...form.register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
            Breed
          </label>
          <input
            type="text"
            {...form.register('breed')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {form.formState.errors.breed && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.breed.message}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            {...form.register('dob')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {form.formState.errors.dob && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.dob.message}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            {...form.register('gender')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="microchipId" className="block text-sm font-medium text-gray-700">
            Microchip ID
          </label>
          <input
            type="text"
            {...form.register('microchipId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="colorMarkings" className="block text-sm font-medium text-gray-700">
            Color & Markings
          </label>
          <input
            type="text"
            {...form.register('colorMarkings')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="medicalNotes" className="block text-sm font-medium text-gray-700">
            Medical Notes
          </label>
          <textarea
            {...form.register('medicalNotes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Dog' : 'Add Dog'}
        </button>
      </div>
    </form>
  )
} 