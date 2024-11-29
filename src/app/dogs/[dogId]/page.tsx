'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Tab } from '@headlessui/react'
import { PawPrintIcon, CalendarIcon, ClipboardIcon } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import DogProfile from '@/components/dogs/DogProfile'
import { format } from 'date-fns'

export default function DogPage() {
  const params = useParams()
  const router = useRouter()
  const dogId = params.dogId as string

  const { data: dog, isLoading } = useQuery({
    queryKey: ['dog', dogId],
    queryFn: async () => {
      const response = await fetch(`/api/dogs/${dogId}`)
      if (!response.ok) throw new Error('Failed to fetch dog details')
      return response.json()
    }
  })

  if (isLoading) return <LoadingSpinner />
  if (!dog) return <div>Dog not found</div>

  const tabs = [
    {
      name: 'Profile',
      icon: PawPrintIcon,
      content: <DogProfile dog={dog} />
    },
    {
      name: 'Health Records',
      icon: ClipboardIcon,
      content: (
        <div className="space-y-6">
          {/* Vaccinations Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Vaccination History
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {dog.vaccinations?.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {dog.vaccinations.map((vax: any) => (
                    <div key={vax.id} className="px-4 py-4 sm:px-6">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {vax.vaccineName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Administered: {format(new Date(vax.dateAdministered), 'PPP')}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Next due: {format(new Date(vax.nextDueDate), 'PPP')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-gray-500 text-center">
                  No vaccination records found
                </div>
              )}
            </div>
          </div>

          {/* Deworming Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Deworming History
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {dog.dewormings?.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {dog.dewormings.map((record: any) => (
                    <div key={record.id} className="px-4 py-4 sm:px-6">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {record.medicineName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Administered: {format(new Date(record.dateAdministered), 'PPP')}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Next due: {format(new Date(record.nextDueDate), 'PPP')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-gray-500 text-center">
                  No deworming records found
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Appointments',
      icon: CalendarIcon,
      content: (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upcoming Appointments
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-gray-500 text-center">No upcoming appointments</p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{dog.name}'s Profile</h1>
        <button
          onClick={() => router.push('/dogs')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Dogs
        </button>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx}>{tab.content}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 