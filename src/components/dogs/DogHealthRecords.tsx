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
  const [isAddingRecord, setIsAddingRecord] = useState(false)

  // Fetch all health records
  const { data: healthRecords } = useQuery({
    queryKey: ['health-records', dogId],
    queryFn: async () => {
      const response = await fetch(`/api/dogs/${dogId}/health-records`)
      if (!response.ok) throw new Error('Failed to fetch health records')
      return response.json()
    }
  })

  const { vaccinations, dewormings } = healthRecords || { vaccinations: [], dewormings: [] }

  // Delete mutations
  const deleteRecordMutation = useMutation({
    mutationFn: async ({ type, id }: { type: 'vaccination' | 'deworming', id: string }) => {
      const response = await fetch(`/api/dogs/${dogId}/${type}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error(`Failed to delete ${type} record`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records', dogId] })
      toast.success('Record deleted successfully')
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Health Records</h2>
        <Button onClick={() => setIsAddingRecord(true)}>Add Record</Button>
      </div>

      {/* Vaccinations Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-md font-medium mb-4">Vaccinations</h3>
        <DataTable data={vaccinations} columns={vaccinationColumns} />
      </div>

      {/* Deworming Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-md font-medium mb-4">Deworming Records</h3>
        <DataTable data={dewormings} columns={dewormingColumns} />
      </div>

      {/* Add Record Modal */}
      <AddHealthRecordModal 
        open={isAddingRecord}
        onClose={() => setIsAddingRecord(false)}
        dogId={dogId}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['health-records', dogId] })
          setIsAddingRecord(false)
        }}
      />
    </div>
  )
} 