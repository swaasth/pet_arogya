import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'
import { ApiError, handleApiError, successResponse, validateUser } from '@/lib/api-utils'
import type { DogsOwners } from '@prisma/client'

interface DogWithOwners {
  id: string
  owners: DogsOwners[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    validateUser(session?.user)

    const dogId = params.id
    const dog = await prisma.dog.findUnique({
      where: { id: dogId },
      include: { owners: true },
    })

    if (!dog) {
      throw new ApiError('Dog not found', 404)
    }

    // Verify user has access to this dog
    const hasAccess = dog.owners.some((owner: DogsOwners) => owner.ownerId === session.user.id)
    if (!hasAccess && session.user.role !== 'veterinary') {
      throw new ApiError('Unauthorized access', 403)
    }

    const today = new Date()
    const threeMonthsFromNow = new Date(today.setMonth(today.getMonth() + 3))

    const upcomingVaccinations = await prisma.vaccination.findMany({
      where: {
        dogId,
        nextDueDate: {
          gte: today,
          lte: threeMonthsFromNow,
        },
      },
      orderBy: {
        nextDueDate: 'asc',
      },
    })

    return successResponse(upcomingVaccinations)
  } catch (error) {
    return handleApiError(error)
  }
} 