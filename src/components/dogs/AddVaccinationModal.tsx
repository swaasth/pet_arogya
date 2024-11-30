'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Dialog } from '@headlessui/react'
import { toast } from 'react-hot-toast'

interface AddVaccinationModalProps {
  dogId: number
  onClose: () => void
  onSuccess: () => void
}

export default function AddVaccinationModal({
  dogId,
  onClose,
  onSuccess,
}: AddVaccinationModalProps) {
  const [formData, setFormData] = useState({
    vaccineName: '',
    dateAdministered: '',
    nextDueDate: '',
    administeredBy: '',
    notes: '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/dogs/${dogId}/vaccinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to add vaccination')
      return response.json()
    },
    onSuccess: () => {
      toast.success('Vaccination added successfully')
      onSuccess()
    },
    onError: () => {
      toast.error('Failed to add vaccination')
    },
  })

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Add Vaccination Record
          </Dialog.Title>

          <form onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate(formData)
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vaccine Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.vaccineName}
                  onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
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
                  required
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
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Vaccination
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 