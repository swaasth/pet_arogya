'use client'

import { useParams } from 'next/navigation'
import { mockDogs, mockVaccinations, mockDewormingRecords } from '@/lib/mockData'
import DogProfile from '@/components/dogs/DogProfile'
import DogHealthRecords from '@/components/dogs/DogHealthRecords'
import { Tab } from '@headlessui/react'
import { Fragment } from 'react'

export default function DogPage() {
  const params = useParams()
  const dogId = params.id as string
  
  const dog = mockDogs.find(d => d.id === dogId)
  const vaccinations = mockVaccinations.filter(v => v.dogId === dogId)
  const dewormingRecords = mockDewormingRecords.filter(d => d.dogId === dogId)

  if (!dog) {
    return <div>Dog not found</div>
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{dog.name}'s Profile</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`
                      w-full rounded-lg py-2.5 text-sm font-medium leading-5
                      ${selected 
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}
                    `}
                  >
                    Profile
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`
                      w-full rounded-lg py-2.5 text-sm font-medium leading-5
                      ${selected 
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}
                    `}
                  >
                    Health Records
                  </button>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <DogProfile dog={dog} />
              </Tab.Panel>
              <Tab.Panel>
                <DogHealthRecords 
                  vaccinations={vaccinations} 
                  dewormingRecords={dewormingRecords} 
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  )
} 