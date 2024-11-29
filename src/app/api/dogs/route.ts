import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { dogSchema } from '@/lib/validations/dog'
import * as z from 'zod'

// GET all dogs for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const dogs = await prisma.dog.findMany({
      where: {
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
        }
      }
    })

    return NextResponse.json({ dogs })
  } catch (error) {
    console.error('Error fetching dogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dogs' },
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
    const body = dogSchema.parse(json)

    const dog = await prisma.dog.create({
      data: {
        name: body.name,
        breed: body.breed,
        dob: new Date(body.dob),
        gender: body.gender,
        colorMarkings: body.colorMarkings || null,
        microchipId: body.microchipId || null,
        medicalNotes: body.medicalNotes || null,
        owners: {
          create: {
            owner: {
              connect: {
                id: session.user.id
              }
            }
          }
        }
      },
      include: {
        owners: true
      }
    })

    return NextResponse.json({ success: true, data: dog })
  } catch (error) {
    console.error('Dog creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors }, 
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create dog' },
      { status: 500 }
    )
  }
} 