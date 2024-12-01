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
                vaccinations: true
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
    const vaccinations = []

    user.dogs.forEach(({ dog }) => {
      dog.vaccinations.forEach(vax => {
        if (vax.nextDueDate <= nextMonth) {
          vaccinations.push({
            id: vax.id,
            dogName: dog.name,
            vaccineName: vax.vaccineName,
            date: vax.nextDueDate
          })
        }
      })
    })

    // Sort vaccinations by date
    vaccinations.sort((a, b) => a.date.getTime() - b.date.getTime())

    return NextResponse.json({ vaccinations })
  } catch (error) {
    console.error('Error fetching upcoming vaccinations:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 