import { format } from 'date-fns'
import { CalendarIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Badge } from '../ui/Badge'

interface HealthRecordCardProps {
  type: 'vaccination' | 'deworming'
  name: string
  dateAdministered: Date
  nextDueDate: Date
  administeredBy: string
  notes?: string
  onEdit?: () => void
}

export default function HealthRecordCard({
  type,
  name,
  dateAdministered,
  nextDueDate,
  administeredBy,
  notes,
  onEdit
}: HealthRecordCardProps) {
  const isOverdue = new Date(nextDueDate) < new Date()
  const isDueSoon = new Date(nextDueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <Badge
            variant={isOverdue ? 'destructive' : isDueSoon ? 'warning' : 'success'}
            className="mt-1"
          >
            {isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : 'Up to Date'}
          </Badge>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Edit</span>
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <dl className="mt-3 space-y-2">
        <div className="flex items-center text-sm">
          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
          <dt className="text-gray-500 mr-1">Administered:</dt>
          <dd className="text-gray-900">
            {format(new Date(dateAdministered), 'MMM d, yyyy')}
          </dd>
        </div>

        <div className="flex items-center text-sm">
          <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
          <dt className="text-gray-500 mr-1">Next Due:</dt>
          <dd className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
            {format(new Date(nextDueDate), 'MMM d, yyyy')}
          </dd>
        </div>

        <div className="flex items-center text-sm">
          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
          <dt className="text-gray-500 mr-1">By:</dt>
          <dd className="text-gray-900">{administeredBy}</dd>
        </div>

        {notes && (
          <div className="text-sm mt-2">
            <dt className="text-gray-500">Notes:</dt>
            <dd className="text-gray-700 mt-1">{notes}</dd>
          </div>
        )}
      </dl>
    </div>
  )
} 