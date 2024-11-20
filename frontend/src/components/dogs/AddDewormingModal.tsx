'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Dialog } from '@headlessui/react'
import { toast } from 'react-hot-toast'

interface AddDewormingModalProps {
  dogId: number
  onClose: () => void
  onSuccess: () => void
}

export default function AddDewormingModal({
  dogId,
  onClose,
  onSuccess,
}: AddDewormingModalProps) {
  const [formData, setFormData] = useState({
    medicineName: '',
    dateAdministered: '',
    nextDueDate: '',
    administeredBy: '',
    notes: '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/dogs/${dogId}/deworming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to add deworming record')
      return response.json()
    },
    onSuccess: () => {
      toast.success('Deworming record added successfully')
      onSuccess()
    },
    onError: () => {
      toast.error('Failed to add deworming record')
    },
  })

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Add Deworming Record
          </Dialog.Title>

          <form onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate(formData)
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medicine Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Administered
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.dateAdministered}
                  onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Next Due Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Administered By
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.administeredBy}
                  onChange={(e) => setFormData({ ...formData, administeredBy: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-5 sm:mt-6 space-x-3">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {mutation.isPending ? 'Adding...' : 'Add Record'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 