import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const upcomingVaccinations = await prisma.vaccination.findMany({
      where: {
        dog: {
          owners: {
            some: {
              ownerId: session.user.id
            }
          }
        },
        nextDueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
        }
      },
      include: {
        dog: true
      },
      orderBy: {
        nextDueDate: 'asc'
      }
    })

    return NextResponse.json({ vaccinations: upcomingVaccinations })
  } catch (error) {
    console.error('Error fetching upcoming vaccinations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming vaccinations' },
      { status: 500 }
    )
  }
} 