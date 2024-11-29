import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const appointmentSchema = z.object({
  dogId: z.string().uuid(),
  vetId: z.string().uuid(),
  dateTime: z.string().refine((date) => !isNaN(Date.parse(date))),
  type: z.enum(['checkup', 'vaccination', 'emergency', 'grooming', 'other']),
  notes: z.string().optional()
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const timeframe = searchParams.get('timeframe') // upcoming, past, all

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    let appointments
    const now = new Date()

    if (user?.role === 'veterinarian') {
      // Fetch appointments where user is the vet
      appointments = await prisma.appointment.findMany({
        where: {
          vetId: session.user.id,
          ...(status && { status }),
          ...(timeframe === 'upcoming' && {
            dateTime: { gte: now }
          }),
          ...(timeframe === 'past' && {
            dateTime: { lt: now }
          })
        },
        include: {
          dog: {
            include: {
              owners: {
                include: {
                  owner: {
                    select: {
                      id: true,
                      full_name: true,
                      email: true,
                      contact: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          dateTime: timeframe === 'past' ? 'desc' : 'asc'
        }
      })
    } else {
      // Fetch appointments for pet owner's dogs
      appointments = await prisma.appointment.findMany({
        where: {
          dog: {
            owners: {
              some: {
                ownerId: session.user.id
              }
            }
          },
          ...(status && { status }),
          ...(timeframe === 'upcoming' && {
            dateTime: { gte: now }
          }),
          ...(timeframe === 'past' && {
            dateTime: { lt: now }
          })
        },
        include: {
          dog: true,
          vet: {
            select: {
              id: true,
              full_name: true,
              email: true,
              contact: true,
              specialization: true
            }
          }
        },
        orderBy: {
          dateTime: timeframe === 'past' ? 'desc' : 'asc'
        }
      })
    }

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const body = appointmentSchema.parse(json)

    // Verify dog ownership
    const dogAccess = await prisma.dogsOwners.findFirst({
      where: {
        dogId: body.dogId,
        ownerId: session.user.id
      }
    })

    if (!dogAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Verify vet exists and is actually a vet
    const vet = await prisma.user.findFirst({
      where: {
        id: body.vetId,
        role: 'veterinarian'
      }
    })

    if (!vet) {
      return NextResponse.json(
        { error: 'Veterinarian not found' },
        { status: 404 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        dogId: body.dogId,
        vetId: body.vetId,
        dateTime: new Date(body.dateTime),
        type: body.type,
        notes: body.notes,
        status: 'scheduled'
      },
      include: {
        dog: true,
        vet: {
          select: {
            id: true,
            full_name: true,
            email: true,
            contact: true,
            specialization: true
          }
        }
      }
    })

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error creating appointment:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
} 