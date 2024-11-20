'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Dog } from '@/types/dog'

interface DogFormProps {
  dog?: Dog
  isEdit?: boolean
}

export default function DogForm({ dog, isEdit = false }: DogFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: dog?.Name || '',
    breed: dog?.Breed || '',
    dateOfBirth: dog?.DOB ? new Date(dog.DOB).toISOString().split('T')[0] : '',
    gender: dog?.Gender || 'male',
    colorMarkings: dog?.ColorMarkings || '',
    microchipID: dog?.MicrochipID || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/dogs${isEdit ? `/${dog?.DogID}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to save dog')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] })
      toast.success(`Dog ${isEdit ? 'updated' : 'added'} successfully`)
      router.push('/dogs')
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} dog`)
    },
  })

  // Form JSX with all fields...
} 