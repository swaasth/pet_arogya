import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { dogId: string; ownerId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Prevent self-removal
    if (session.user.id === params.ownerId) {
      return NextResponse.json(
        { error: 'Cannot remove yourself as an owner' },
        { status: 400 }
      )
    }

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

    // Remove co-owner
    await prisma.dogsOwners.deleteMany({
      where: {
        dogId: params.dogId,
        ownerId: params.ownerId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing co-owner:', error)
    return NextResponse.json(
      { error: 'Failed to remove co-owner' },
      { status: 500 }
    )
  }
} 