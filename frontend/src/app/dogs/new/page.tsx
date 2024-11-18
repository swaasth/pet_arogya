'use client'

import DogForm from '@/components/dogs/DogForm'
import { mockDogs } from '@/lib/mockData'
import { useRouter } from 'next/navigation'

export default function NewDogPage() {
  const router = useRouter()

  const handleSubmit = (dogData: any) => {
    // In a real app, this would be an API call
    const newDog = {
      ...dogData,
      id: `${mockDogs.length + 1}`,
    }
    mockDogs.push(newDog)
    router.push('/dogs')
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Dog</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <DogForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
} 