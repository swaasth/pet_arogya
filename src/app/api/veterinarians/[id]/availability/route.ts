import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const availabilitySchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date))),
  slots: z.array(z.object({
    startTime: z.string(),
    endTime: z.string(),
    available: z.boolean()
  }))
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const availability = await prisma.vetAvailability.findMany({
      where: {
        vetId: params.id,
        date: new Date(date)
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
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
    if (!session?.user?.id || session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const body = availabilitySchema.parse(json)

    // Update availability slots
    await prisma.$transaction(async (tx) => {
      // Delete existing slots for the date
      await tx.vetAvailability.deleteMany({
        where: {
          vetId: params.id,
          date: new Date(body.date)
        }
      })

      // Create new slots
      await tx.vetAvailability.createMany({
        data: body.slots.map(slot => ({
          vetId: params.id,
          date: new Date(body.date),
          startTime: slot.startTime,
          endTime: slot.endTime,
          available: slot.available
        }))
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating availability:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
} 