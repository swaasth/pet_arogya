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

    // Get user's dogs count
    const dogsCount = await prisma.dog.count({
      where: {
        owners: {
          some: {
            ownerId: session.user.id
          }
        }
      }
    })

    // Get upcoming vaccinations (next 30 days)
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
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        dog: true
      },
      orderBy: {
        nextDueDate: 'asc'
      }
    })

    // Get upcoming deworming (next 30 days)
    const upcomingDeworming = await prisma.deworming.findMany({
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
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        dog: true
      },
      orderBy: {
        nextDueDate: 'asc'
      }
    })

    return NextResponse.json({
      stats: {
        totalDogs: dogsCount,
        upcomingVaccinations: upcomingVaccinations.length,
        upcomingDeworming: upcomingDeworming.length,
        recentVaccinations: upcomingVaccinations.slice(0, 5),
        recentDeworming: upcomingDeworming.slice(0, 5)
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
} 