import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'
import { ApiError, handleApiError, successResponse, validateUser } from '@/lib/api-utils'

const vaccinationSchema = z.object({
  vaccineName: z.string().min(1),
  dateAdministered: z.string().datetime(),
  nextDueDate: z.string().datetime(),
  administeredBy: z.string().min(1),
  notes: z.string().optional(),
})

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
      include: { owners: true, vaccinations: true },
    })

    if (!dog) {
      throw new ApiError('Dog not found', 404)
    }

    // Verify user has access to this dog
    const hasAccess = dog.owners.some(owner => owner.ownerId === session.user.id)
    if (!hasAccess && session.user.role !== 'veterinary') {
      throw new ApiError('Unauthorized access', 403)
    }

    return successResponse(dog.vaccinations)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    validateUser(session?.user)

    if (session.user.role !== 'veterinary') {
      throw new ApiError('Only veterinarians can add vaccinations', 403)
    }

    const dogId = params.id
    const json = await request.json()
    const data = vaccinationSchema.parse(json)

    const vaccination = await prisma.vaccination.create({
      data: {
        ...data,
        dogId,
        dateAdministered: new Date(data.dateAdministered),
        nextDueDate: new Date(data.nextDueDate),
      },
    })

    return successResponse(vaccination, 201)
  } catch (error) {
    return handleApiError(error)
  }
} 