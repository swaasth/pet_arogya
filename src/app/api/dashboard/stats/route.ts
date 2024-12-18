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
                appointments: true,
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
    
    // Count upcoming events
    let upcomingVaccinations = 0
    let upcomingDeworming = 0
    let pendingAppointments = 0

    user.dogs.forEach(({ dog }) => {
      // Check vaccinations
      dog.vaccinations.forEach(vax => {
        if (vax.nextDueDate <= nextMonth) {
          upcomingVaccinations++
        }
      })

      // Check dewormings
      dog.dewormings.forEach(deworming => {
        if (deworming.nextDueDate <= nextMonth) {
          upcomingDeworming++
        }
      })

      // Check appointments
      dog.appointments.forEach(apt => {
        if (apt.status === 'scheduled') {
          pendingAppointments++
        }
      })
    })

    return NextResponse.json({
      totalPets: user.dogs.length,
      upcomingVaccinations,
      upcomingDeworming,
      pendingAppointments
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 