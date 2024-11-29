'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Dog } from '@/types/dog'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DogList() {
  const { data, isLoading, error } = useQuery<{ dogs: Dog[] }>({
    queryKey: ['dogs'],
    queryFn: async () => {
      const response = await fetch('/api/dogs')
      if (!response.ok) {
        throw new Error('Failed to fetch dogs')
      }
      return response.json()
    }
  })

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Dogs</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your registered dogs
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dogs/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add dog
          </Link>
        </div>
      </div>

      {data?.dogs && data.dogs.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                {/* Table content */}
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Breed</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Gender</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Age</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.dogs.map((dog) => (
                    <tr key={dog.DogID}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {dog.Name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dog.Breed}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dog.Gender}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date().getFullYear() - new Date(dog.DOB).getFullYear()} years
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link href={`/dogs/${dog.DogID}`} className="text-indigo-600 hover:text-indigo-900">
                          View<span className="sr-only">, {dog.Name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No dogs</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new dog.</p>
          <div className="mt-6">
            <Link
              href="/dogs/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add dog
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 