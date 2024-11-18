'use client'

import { Vaccination, DewormingRecord } from '@/types/dog'
import { format } from 'date-fns'

interface DogHealthRecordsProps {
  vaccinations: Vaccination[]
  dewormingRecords: DewormingRecord[]
}

export default function DogHealthRecords({ vaccinations, dewormingRecords }: DogHealthRecordsProps) {
  return (
    <div className="space-y-6">
      {/* Vaccinations Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Vaccination History</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {vaccinations.map((vaccination) => (
              <li key={vaccination.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vaccination.vaccineName}</p>
                    <p className="text-sm text-gray-500">
                      Administered: {format(new Date(vaccination.dateAdministered), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Next due: {format(new Date(vaccination.nextDue), 'MMMM d, yyyy')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deworming Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Deworming History</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {dewormingRecords.map((record) => (
              <li key={record.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{record.medicationName}</p>
                    <p className="text-sm text-gray-500">
                      Administered: {format(new Date(record.dateAdministered), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Next due: {format(new Date(record.nextDue), 'MMMM d, yyyy')}
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