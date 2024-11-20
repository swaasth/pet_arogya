import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalDogs, upcomingVaccinations, upcomingDeworming] = await Promise.all([
      prisma.dog.count({
        where: {
          owners: {
            some: {
              ownerId: session.user.profileId
            }
          }
        }
      }),

      prisma.vaccination.count({
        where: {
          dog: {
            owners: {
              some: {
                ownerId: session.user.profileId
              }
            }
          },
          nextDueDate: {
            gt: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      prisma.deworming.count({
        where: {
          dog: {
            owners: {
              some: {
                ownerId: session.user.profileId
              }
            }
          },
          nextDueDate: {
            gt: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    return NextResponse.json({
      totalDogs,
      upcomingVaccinations,
      upcomingDeworming
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 