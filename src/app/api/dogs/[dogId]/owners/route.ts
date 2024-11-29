import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const coOwnerSchema = z.object({
  email: z.string().email()
})

export async function GET(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user has access to this dog
    const dogOwners = await prisma.dogsOwners.findMany({
      where: {
        dogId: params.dogId,
        dog: {
          owners: {
            some: {
              ownerId: session.user.id
            }
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            full_name: true
          }
        }
      }
    })

    return NextResponse.json({ owners: dogOwners })
  } catch (error) {
    console.error('Error fetching dog owners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dog owners' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { dogId: string } }
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
    const body = coOwnerSchema.parse(json)

    // Verify user has access to this dog
    const dogAccess = await prisma.dogsOwners.findFirst({
      where: {
        dogId: params.dogId,
        ownerId: session.user.id
      }
    })

    if (!dogAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Find the user to add as co-owner
    const coOwner = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!coOwner) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already a co-owner
    const existingOwnership = await prisma.dogsOwners.findFirst({
      where: {
        dogId: params.dogId,
        ownerId: coOwner.id
      }
    })

    if (existingOwnership) {
      return NextResponse.json(
        { error: 'User is already a co-owner' },
        { status: 400 }
      )
    }

    // Add co-owner
    await prisma.dogsOwners.create({
      data: {
        dogId: params.dogId,
        ownerId: coOwner.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding co-owner:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to add co-owner' },
      { status: 500 }
    )
  }
} 