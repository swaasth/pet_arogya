import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user is a veterinarian
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    })

    if (user?.role !== 'veterinarian') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all dogs the vet has access to
    // Implement based on your access control schema
    const dogs = await prisma.dog.findMany({
      where: {
        // Add your vet access conditions here
      },
      include: {
        owners: {
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                full_name: true,
                contact: true
              }
            }
          }
        },
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
    console.error('Error fetching vet patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
} 