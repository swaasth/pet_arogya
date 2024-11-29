import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const appointmentUpdateSchema = z.object({
  dateTime: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  type: z.enum(['checkup', 'vaccination', 'emergency', 'grooming', 'other']).optional(),
  notes: z.string().optional()
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            vetId: session.user.id
          },
          {
            dog: {
              owners: {
                some: {
                  ownerId: session.user.id
                }
              }
            }
          }
        ]
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
        },
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

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointment details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const body = appointmentUpdateSchema.parse(json)

    // Verify access to appointment
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            vetId: session.user.id
          },
          {
            dog: {
              owners: {
                some: {
                  ownerId: session.user.id
                }
              }
            }
          }
        ]
      }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.appointment.update({
      where: {
        id: params.id
      },
      data: {
        ...(body.dateTime && { dateTime: new Date(body.dateTime) }),
        ...(body.status && { status: body.status }),
        ...(body.type && { type: body.type }),
        ...(body.notes !== undefined && { notes: body.notes })
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

    return NextResponse.json({ appointment: updated })
  } catch (error) {
    console.error('Error updating appointment:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify access to appointment
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            vetId: session.user.id
          },
          {
            dog: {
              owners: {
                some: {
                  ownerId: session.user.id
                }
              }
            }
          }
        ]
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    await prisma.appointment.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
} 