import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface AppointmentCalendarProps {
  appointments: Array<{
    id: string
    dateTime: string
    status: string
    type: string
    dog: {
      name: string
    }
    vet: {
      full_name: string
    }
  }>
}

export default function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Create a map of dates to appointments
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = format(new Date(appointment.dateTime), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(appointment)
    return acc
  }, {} as Record<string, typeof appointments>)

  return (
    <div className="flex flex-col space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => {
            const dateStr = format(date, 'yyyy-MM-dd')
            const dayAppointments = appointmentsByDate[dateStr] || []

            if (dayAppointments.length === 0) {
              return <div>{date.getDate()}</div>
            }

            return (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="relative">
                    {date.getDate()}
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                    >
                      {dayAppointments.length}
                    </Badge>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <div className="font-medium">
                            {format(new Date(apt.dateTime), 'p')} - {apt.type}
                          </div>
                          <div className="text-gray-500">
                            {apt.dog.name} with Dr. {apt.vet.full_name}
                          </div>
                        </div>
                        <Badge variant="outline">{apt.status}</Badge>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )
          },
        }}
      />
    </div>
  )
} 