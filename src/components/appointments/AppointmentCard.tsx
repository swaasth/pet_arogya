import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AppointmentCardProps {
  appointment: {
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
  }
  userRole?: string
}

export function AppointmentCard({ appointment, userRole }: AppointmentCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update appointment status')
      }

      toast.success('Appointment status updated')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update appointment status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete appointment')
      }

      toast.success('Appointment cancelled')
      router.refresh()
    } catch (error) {
      toast.error('Failed to cancel appointment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">
            {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
          </CardTitle>
          <CardDescription>
            {format(new Date(appointment.dateTime), 'PPP p')}
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className={statusColors[appointment.status as keyof typeof statusColors]}
        >
          {appointment.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="text-sm">
            <span className="font-medium">Pet:</span> {appointment.dog.name} ({appointment.dog.breed})
          </div>
          <div className="text-sm">
            <span className="font-medium">Veterinarian:</span> {appointment.vet.full_name}
            {appointment.vet.specialization && ` - ${appointment.vet.specialization}`}
          </div>
          {appointment.notes && (
            <div className="text-sm mt-2">
              <span className="font-medium">Notes:</span> {appointment.notes}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        {userRole === 'veterinarian' && appointment.status === 'scheduled' && (
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate('completed')}
            disabled={isLoading}
          >
            Mark as Completed
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {appointment.status === 'scheduled' && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Cancel Appointment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
} 