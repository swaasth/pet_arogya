import React from 'react'
import { AppointmentCard } from './AppointmentCard'

interface AppointmentListProps {
  appointments: Array<{
    id: string
    dateTime: string
    status: string
    type: string
    notes?: string
    dog: {
      id: string
      name: string
      breed: string
    }
    vet: {
      id: string
      full_name: string
      specialization?: string
    }
  }>
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  if (!appointments.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No appointments found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard 
          key={appointment.id}
          appointment={appointment}
        />
      ))}
    </div>
  )
} 