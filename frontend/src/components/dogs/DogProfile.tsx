'use client'

import { Dog } from '@/types/dog'
import { format } from 'date-fns'

interface DogProfileProps {
  dog: Dog
}

export default function DogProfile({ dog }: DogProfileProps) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Dog Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and basic information.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{dog.name}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Breed</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{dog.breed}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              {format(new Date(dog.dateOfBirth), 'MMMM d, yyyy')}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Medical Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              {dog.medicalNotes || 'No medical notes available'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
} 