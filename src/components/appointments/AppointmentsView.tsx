'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  PlusCircleIcon,
  SearchIcon,
  FilterIcon
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Appointment {
  id: string
  dogId: string
  vetId: string
  dateTime: Date
  status: string
  type: string
  notes?: string | null
  dog: {
    id: string
    name: string
    breed: string
  }
  vet: {
    id: string
    full_name: string | null
    specialization: string | null
  }
}

interface AppointmentsViewProps {
  initialAppointments: Appointment[]
}

export default function AppointmentsView({ initialAppointments }: AppointmentsViewProps) {
  const [appointments] = useState<Appointment[]>(initialAppointments)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.type.toLowerCase().includes(searchQuery.toLowerCase())
    const aptDate = new Date(apt.dateTime)
    const isUpcoming = aptDate >= new Date()
    
    if (filter === 'upcoming') return matchesSearch && isUpcoming
    if (filter === 'past') return matchesSearch && !isUpcoming
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your veterinary appointments and schedules
          </p>
        </div>
        <Link
          href="/appointments/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          New Appointment
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <FilterIcon className="h-5 w-5 text-gray-400 self-center" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {appointment.dog.name}
                    </h3>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:gap-6">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm text-gray-500">
                        {format(new Date(appointment.dateTime), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm text-gray-500">
                        {format(new Date(appointment.dateTime), 'h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm text-gray-500">
                        {appointment.vet.full_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <Link
                    href={`/appointments/${appointment.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <SearchIcon className="h-5 w-5 mr-2" />
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  )
} 