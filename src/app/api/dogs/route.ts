import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const userWithDogs = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dogs: {
          include: {
            dog: true
          }
        }
      }
    })

    if (!userWithDogs) {
      return new NextResponse('User not found', { status: 404 })
    }

    const dogs = userWithDogs.dogs.map(({ dog }) => ({
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      dob: dog.dob,
      gender: dog.gender,
      colorMarkings: dog.colorMarkings,
      microchipId: dog.microchipId
    }))

    return NextResponse.json({ dogs })
  } catch (error) {
    console.error('Error fetching dogs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 