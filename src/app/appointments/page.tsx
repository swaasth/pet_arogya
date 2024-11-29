import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AppointmentsView from '@/components/appointments/AppointmentsView'

export default async function AppointmentsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Server-side data fetching
  const appointments = await prisma.appointment.findMany({
    where: {
      OR: [
        {
          dog: {
            owners: {
              some: {
                ownerId: user.id
              }
            }
          }
        },
        {
          vetId: user.id // Include appointments where user is the vet
        }
      ]
    },
    include: {
      dog: true,
      vet: {
        select: {
          id: true,
          full_name: true,
          email: true,
          specialization: true
        }
      }
    },
    orderBy: {
      dateTime: 'asc'
    }
  })

  return <AppointmentsView initialAppointments={appointments} />
} 