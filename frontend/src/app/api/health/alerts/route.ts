import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addDays } from 'date-fns'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    const thirtyDaysFromNow = addDays(today, 30)

    // Fetch upcoming vaccinations and deworming
    const [vaccinations, deworming] = await Promise.all([
      prisma.vaccination.findMany({
        where: {
          dog: {
            owners: {
              some: {
                ownerId: session.user.profileId
              }
            }
          },
          nextDueDate: {
            gte: today,
            lte: thirtyDaysFromNow
          }
        },
        include: {
          dog: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.deworming.findMany({
        where: {
          dog: {
            owners: {
              some: {
                ownerId: session.user.profileId
              }
            }
          },
          nextDueDate: {
            gte: today,
            lte: thirtyDaysFromNow
          }
        },
        include: {
          dog: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    // Transform into alerts
    const alerts = [
      ...vaccinations.map(v => ({
        id: `vac-${v.id}`,
        type: 'vaccination' as const,
        dogName: v.dog.name,
        message: `Vaccination due: ${v.vaccineName}`,
        dueDate: v.nextDueDate
      })),
      ...deworming.map(d => ({
        id: `dew-${d.id}`,
        type: 'deworming' as const,
        dogName: d.dog.name,
        message: `Deworming due: ${d.medicineName}`,
        dueDate: d.nextDueDate
      }))
    ]

    return NextResponse.json(alerts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch health alerts' },
      { status: 500 }
    )
  }
} 