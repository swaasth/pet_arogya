import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

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

    const vaccination = await prisma.vaccination.findFirst({
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

    if (!vaccination) {
      return NextResponse.json(
        { error: 'Vaccination record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ vaccination })
  } catch (error) {
    console.error('Error fetching vaccination:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vaccination details' },
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
    const vaccination = await prisma.vaccination.findFirst({
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

    if (!vaccination) {
      return NextResponse.json(
        { error: 'Vaccination record not found' },
        { status: 404 }
      )
    }

    await prisma.vaccination.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vaccination:', error)
    return NextResponse.json(
      { error: 'Failed to delete vaccination' },
      { status: 500 }
    )
  }
} 