'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tab } from '@headlessui/react'
import HealthRecordCard from './HealthRecordCard'
import AddHealthRecordModal from './AddHealthRecordModal'
import { Button } from '../ui/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

interface VaccinationRecord {
  id: string
  vaccineName: string
  dateAdministered: string
  nextDueDate: string
  administeredBy: string
  notes?: string
}

interface DewormingRecord {
  id: string
  medicineName: string
  dateAdministered: string
  nextDueDate: string
  administeredBy: string
  notes?: string
}

interface HealthRecordsContainerProps {
  dogId: string
}

export default function HealthRecordsContainer({ dogId }: HealthRecordsContainerProps) {
  const [selectedTab, setSelectedTab] = useState(0)
  const [isAddingRecord, setIsAddingRecord] = useState(false)

  const { data: vaccinations, isLoading: loadingVaccinations } = useQuery({
    queryKey: ['vaccinations', dogId],
    queryFn: async () => {
      const res = await fetch(`/api/dogs/${dogId}/vaccinations`)
      if (!res.ok) throw new Error('Failed to fetch vaccinations')
      return res.json()
    }
  })

  const { data: dewormings, isLoading: loadingDewormings } = useQuery({
    queryKey: ['dewormings', dogId],
    queryFn: async () => {
      const res = await fetch(`/api/dogs/${dogId}/deworming`)
      if (!res.ok) throw new Error('Failed to fetch deworming records')
      return res.json()
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Health Records</h2>
        <Button
          onClick={() => setIsAddingRecord(true)}
          className="inline-flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected 
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }`
            }
          >
            Vaccinations
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected 
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }`
            }
          >
            Deworming
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          <Tab.Panel className="space-y-4">
            {loadingVaccinations ? (
              <div>Loading vaccinations...</div>
            ) : vaccinations?.length > 0 ? (
              vaccinations.map((vax: VaccinationRecord) => (
                <HealthRecordCard
                  key={vax.id}
                  type="vaccination"
                  name={vax.vaccineName}
                  dateAdministered={vax.dateAdministered}
                  nextDueDate={vax.nextDueDate}
                  administeredBy={vax.administeredBy}
                  notes={vax.notes}
                  onEdit={() => {/* TODO: Implement edit */}}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No vaccination records found
              </div>
            )}
          </Tab.Panel>

          <Tab.Panel className="space-y-4">
            {loadingDewormings ? (
              <div>Loading deworming records...</div>
            ) : dewormings?.length > 0 ? (
              dewormings.map((record: DewormingRecord) => (
                <HealthRecordCard
                  key={record.id}
                  type="deworming"
                  name={record.medicineName}
                  dateAdministered={record.dateAdministered}
                  nextDueDate={record.nextDueDate}
                  administeredBy={record.administeredBy}
                  notes={record.notes}
                  onEdit={() => {/* TODO: Implement edit */}}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No deworming records found
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {isAddingRecord && (
        <AddHealthRecordModal
          dogId={dogId}
          type={selectedTab === 0 ? 'vaccination' : 'deworming'}
          onClose={() => setIsAddingRecord(false)}
          onSuccess={() => {
            setIsAddingRecord(false)
            // Invalidate queries to refresh data
            queryClient.invalidateQueries(['vaccinations', dogId])
            queryClient.invalidateQueries(['dewormings', dogId])
          }}
        />
      )}
    </div>
  )
} 