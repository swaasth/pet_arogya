import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dogs = await prisma.dog.findMany({
      where: {
        owners: {
          some: {
            ownerId: session.user.profileId
          }
        }
      },
      select: {
        id: true,
        name: true,
        breed: true,
        dob: true,
        gender: true,
        colorMarkings: true,
        microchipId: true
      }
    })

    return NextResponse.json({ dogs })
  } catch (error) {
    console.error('Failed to fetch dogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dogs' },
      { status: 500 }
    )
  }
} 