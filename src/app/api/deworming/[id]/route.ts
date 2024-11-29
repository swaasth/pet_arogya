import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const dewormingUpdateSchema = z.object({
  medicineName: z.string().min(1),
  dateAdministered: z.string().refine((date) => !isNaN(Date.parse(date))),
  nextDueDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  administeredBy: z.string().min(1),
  notes: z.string().optional().nullable()
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

    const deworming = await prisma.deworming.findFirst({
      where: {
        id: params.id,
        dog: {
          owners: {
            some: {
              ownerId: session.user.id
            }
          }
        }
      },
      include: {
        dog: true
      }
    })

    if (!deworming) {
      return NextResponse.json(
        { error: 'Deworming record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ deworming })
  } catch (error) {
    console.error('Error fetching deworming record:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deworming details' },
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
    const body = dewormingUpdateSchema.parse(json)

    // Verify ownership before update
    const existingRecord = await prisma.deworming.findFirst({
      where: {
        id: params.id,
        dog: {
          owners: {
            some: {
              ownerId: session.user.id
            }
          }
        }
      }
    })

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Deworming record not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.deworming.update({
      where: {
        id: params.id
      },
      data: {
        medicineName: body.medicineName,
        dateAdministered: new Date(body.dateAdministered),
        nextDueDate: new Date(body.nextDueDate),
        administeredBy: body.administeredBy,
        notes: body.notes
      },
      include: {
        dog: true
      }
    })

    return NextResponse.json({ deworming: updated })
  } catch (error) {
    console.error('Error updating deworming record:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update deworming record' },
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

    // Verify ownership before deletion
    const deworming = await prisma.deworming.findFirst({
      where: {
        id: params.id,
        dog: {
          owners: {
            some: {
              ownerId: session.user.id
            }
          }
        }
      }
    })

    if (!deworming) {
      return NextResponse.json(
        { error: 'Deworming record not found' },
        { status: 404 }
      )
    }

    await prisma.deworming.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deworming record:', error)
    return NextResponse.json(
      { error: 'Failed to delete deworming record' },
      { status: 500 }
    )
  }
} 