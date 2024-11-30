'use client'

import { useQuery } from '@tanstack/react-query'
import { Dog } from '@/types/dog'
import Link from 'next/link'
import { HomeIcon as PawPrintIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface DogsResponse {
  dogs: Dog[]
}

export default function PetCardsGrid() {
  const { data, isLoading } = useQuery<DogsResponse>({
    queryKey: ['userDogs'],
    queryFn: async () => {
      const response = await fetch('/api/dogs')
      if (!response.ok) throw new Error('Failed to fetch dogs')
      return response.json()
    }
  })

  if (isLoading) return <LoadingSpinner />

  if (!data?.dogs || data.dogs.length === 0) {
    return (
      <Link
        href="/dogs/new"
        className="block p-6 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition-colors"
      >
        <PawPrintIcon className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 font-semibold text-gray-900">Add Your First Pet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your furry family member
        </p>
      </Link>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 pb-4">
        {data.dogs.map((dog) => (
          <Link
            key={dog.id}
            href={`/dogs/${dog.id}`}
            className="flex-shrink-0 w-48 bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-500 transition-colors"
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-indigo-100 rounded-full">
              <PawPrintIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-semibold text-gray-900">{dog.name}</h3>
              <p className="text-sm text-gray-500">
                {dog.breed} • {calculateAge(dog.dob)}
              </p>
            </div>
          </Link>
        ))}

        {/* Add New Pet Card */}
        <Link
          href="/dogs/new"
          className="flex-shrink-0 w-48 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-500 transition-colors flex flex-col items-center justify-center"
        >
          <PawPrintIcon className="w-10 h-10 text-gray-400" />
          <span className="mt-2 text-sm font-medium text-gray-600">
            Add New Pet
          </span>
        </Link>
      </div>
    </div>
  )
}

function calculateAge(dob: Date): string {
  const years = new Date().getFullYear() - new Date(dob).getFullYear()
  return `${years} ${years === 1 ? 'year' : 'years'} old`
} 