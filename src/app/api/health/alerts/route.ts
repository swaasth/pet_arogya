import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dogs: {
          include: {
            dog: {
              include: {
                vaccinations: true,
                dewormings: true,
                appointments: {
                  where: {
                    status: 'scheduled'
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const nextMonth = addDays(new Date(), 30)
    const alerts = []

    user.dogs.forEach(({ dog }) => {
      // Check vaccinations
      dog.vaccinations.forEach(vax => {
        if (vax.nextDueDate <= nextMonth) {
          alerts.push({
            id: `vax-${vax.id}`,
            type: 'vaccination',
            dogName: dog.name,
            message: `${vax.vaccineName} vaccination due`,
            dueDate: vax.nextDueDate.toISOString()
          })
        }
      })

      // Check dewormings
      dog.dewormings.forEach(deworming => {
        if (deworming.nextDueDate <= nextMonth) {
          alerts.push({
            id: `deworming-${deworming.id}`,
            type: 'deworming',
            dogName: dog.name,
            message: `${deworming.medicineName} deworming due`,
            dueDate: deworming.nextDueDate.toISOString()
          })
        }
      })

      // Check appointments
      dog.appointments.forEach(apt => {
        alerts.push({
          id: `apt-${apt.id}`,
          type: 'checkup',
          dogName: dog.name,
          message: `Scheduled appointment: ${apt.type}`,
          dueDate: apt.dateTime.toISOString()
        })
      })
    })

    // Sort alerts by due date
    alerts.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching health alerts:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 