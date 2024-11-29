import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

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

    const healthRecords = await prisma.dog.findFirst({
      where: {
        id: params.dogId,
        owners: {
          some: {
            ownerId: session.user.id
          }
        }
      },
      select: {
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

    return NextResponse.json(healthRecords)
  } catch (error) {
    console.error('Error fetching health records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health records' },
      { status: 500 }
    )
  }
} 