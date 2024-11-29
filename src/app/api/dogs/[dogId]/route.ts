import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { dogSchema } from '@/lib/validations/dog'
import * as z from 'zod'

export async function GET(
  request: NextRequest,
  context: { params: { dogId: string } }
) {
  try {
    const { dogId } = context.params

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const dog = await prisma.dog.findFirst({
      where: {
        id: dogId,
        owners: {
          some: {
            ownerId: session.user.id
          }
        }
      },
      include: {
        vaccinations: {
          orderBy: {
            dateAdministered: 'desc'
          }
        },
        dewormings: {
          orderBy: {
            dateAdministered: 'desc'
          }
        },
        owners: {
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                full_name: true
              }
            }
          }
        }
      }
    })

    if (!dog) {
      return NextResponse.json(
        { error: 'Dog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(dog)
  } catch (error) {
    console.error('Error fetching dog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dog details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { dogId: string } }
) {
  try {
    const { dogId } = context.params
    const session = await getServerSession(authOptions)
    const data = await request.json()

    const body = dogSchema.parse(data)

    const dog = await prisma.dog.findFirst({
      where: {
        id: dogId,
        owners: {
          some: {
            ownerId: session.user.id
          }
        }
      }
    })

    if (!dog) {
      return NextResponse.json(
        { error: 'Dog not found' },
        { status: 404 }
      )
    }

    const updatedDog = await prisma.dog.update({
      where: {
        id: dogId
      },
      data: {
        name: body.name,
        breed: body.breed,
        dob: new Date(body.dob),
        gender: body.gender,
        colorMarkings: body.colorMarkings || null,
        microchipId: body.microchipId || null,
        medicalNotes: body.medicalNotes || null
      }
    })

    return NextResponse.json({ dog: updatedDog })
  } catch (error) {
    console.error('Error updating dog:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update dog' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { dogId: string } }
) {
  try {
    const { dogId } = context.params
    const session = await getServerSession(authOptions)

    // ... rest of your DELETE logic
  } catch (error) {
    // ... error handling
  }
} 