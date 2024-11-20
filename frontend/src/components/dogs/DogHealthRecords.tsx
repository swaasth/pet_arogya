'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { Vaccination, DewormingRecord } from '@/types/dog'

interface DogHealthRecordsProps {
  dogId: number
}

export default function DogHealthRecords({ dogId }: DogHealthRecordsProps) {
  const queryClient = useQueryClient()
  const [isAddingVaccination, setIsAddingVaccination] = useState(false)
  const [isAddingDeworming, setIsAddingDeworming] = useState(false)

  // Fetch vaccinations
  const { data: vaccinations } = useQuery<Vaccination[]>({
    queryKey: ['vaccinations', dogId],
    queryFn: async () => {
      const response = await fetch(`/api/dogs/${dogId}/vaccinations`)
      if (!response.ok) throw new Error('Failed to fetch vaccinations')
      return response.json()
    }
  })

  // Fetch deworming records
  const { data: dewormingRecords } = useQuery<DewormingRecord[]>({
    queryKey: ['deworming', dogId],
    queryFn: async () => {
      const response = await fetch(`/api/dogs/${dogId}/deworming`)
      if (!response.ok) throw new Error('Failed to fetch deworming records')
      return response.json()
    }
  })

  // Delete mutations
  const deleteVaccinationMutation = useMutation({
    mutationFn: async (vaccinationId: number) => {
      const response = await fetch(`/api/dogs/${dogId}/vaccinations/${vaccinationId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete vaccination')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', dogId] })
      toast.success('Vaccination record deleted')
    }
  })

  const deleteDewormingMutation = useMutation({
    mutationFn: async (dewormingId: number) => {
      const response = await fetch(`/api/dogs/${dogId}/deworming/${dewormingId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete deworming record')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deworming', dogId] })
      toast.success('Deworming record deleted')
    }
  })

  return (
    <div className="space-y-6">
      {/* Vaccinations Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Vaccination History</h3>
          <button
            onClick={() => setIsAddingVaccination(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Add Vaccination
          </button>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {vaccinations?.map((vaccination) => (
              <li key={vaccination.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vaccination.vaccineName}</p>
                    <p className="text-sm text-gray-500">
                      Administered: {format(new Date(vaccination.dateAdministered), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Next due: {format(new Date(vaccination.nextDue), 'MMMM d, yyyy')}
                    </div>
                    <button
                      onClick={() => deleteVaccinationMutation.mutate(vaccination.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deworming Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Deworming History</h3>
          <button
            onClick={() => setIsAddingDeworming(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Add Deworming
          </button>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {dewormingRecords?.map((record) => (
              <li key={record.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{record.medicationName}</p>
                    <p className="text-sm text-gray-500">
                      Administered: {format(new Date(record.dateAdministered), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Next due: {format(new Date(record.nextDue), 'MMMM d, yyyy')}
                    </div>
                    <button
                      onClick={() => deleteDewormingMutation.mutate(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 