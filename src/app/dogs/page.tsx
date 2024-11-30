'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { PlusIcon, PawPrintIcon, CalendarIcon } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { format } from 'date-fns'
import { calculateAge } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Dog {
  id: string
  name: string
  breed: string
  dob: string
  gender: 'male' | 'female'
  vaccinations?: Array<{
    dateAdministered: string
  }>
  dewormings?: Array<{
    dateAdministered: string
  }>
}

export default function DogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const response = await fetch('/api/dogs')
      if (!response.ok) throw new Error('Failed to fetch dogs')
      return response.json()
    }
  })

  if (isLoading) return <LoadingSpinner />

  const dogs = data?.dogs || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your pets&apos; profiles and health records
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dogs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Pet
          </Link>
        </div>
      </div>

      {dogs.length === 0 ? (
        <div className="mt-12 text-center">
          <PawPrintIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No pets yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first pet.
          </p>
          <div className="mt-6">
            <Link
              href="/dogs/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Pet
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog: Dog) => (
            <Link key={dog.id} href={`/dogs/${dog.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                      <PawPrintIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dog.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {dog.breed} • {calculateAge(dog.dob)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(dog.dob), 'MMM d, yyyy')}
                      </div>
                      <Badge variant={dog.gender === 'male' ? 'default' : 'secondary'}>
                        {dog.gender}
                      </Badge>
                    </div>
                  </div>

                  {dog.vaccinations && dog.vaccinations.length > 0 && (
                    <div className="mt-4 text-sm">
                      <p className="text-gray-500">
                        Last vaccination:{' '}
                        {format(
                          new Date(dog.vaccinations[0].dateAdministered),
                          'MMM d, yyyy'
                        )}
                      </p>
                    </div>
                  )}

                  {dog.dewormings && dog.dewormings.length > 0 && (
                    <div className="mt-1 text-sm">
                      <p className="text-gray-500">
                        Last deworming:{' '}
                        {format(
                          new Date(dog.dewormings[0].dateAdministered),
                          'MMM d, yyyy'
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Add New Pet Card */}
          <Link href="/dogs/new">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full text-gray-500 hover:text-indigo-600">
                <PlusIcon className="h-12 w-12 mb-4" />
                <p className="text-sm font-medium">Add New Pet</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
} 