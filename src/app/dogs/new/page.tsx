'use client'

import DogForm from '@/components/dogs/DogForm'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PawPrintIcon } from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function NewDogPage() {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login')
    },
  })

  if (status === 'loading') return <LoadingSpinner />

  return (
    <div className="max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-lg bg-white/80 backdrop-blur-sm shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-indigo-100 p-3">
              <PawPrintIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-semibold text-gray-900 mb-8">
            Add a New Furry Friend
          </h1>
          <div className="max-w-xl mx-auto">
            <DogForm />
          </div>
        </div>
      </div>
    </div>
  )
} 