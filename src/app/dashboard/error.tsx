'use client';

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-8">
          {error.message || 'An error occurred while loading the dashboard.'}
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => reset()}
            variant="outline"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.reload()}
          >
            Refresh page
          </Button>
        </div>
      </div>
    </div>
  )
} 