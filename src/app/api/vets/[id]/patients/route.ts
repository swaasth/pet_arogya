import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'
import { ApiError, handleApiError, successResponse, validateUser } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    validateUser(session?.user)

    // Only vets can access their own patients
    if (session.user.id !== params.id || session.user.role !== 'veterinary') {
      throw new ApiError('Unauthorized access', 403)
    }

    // Get all appointments for the vet, including dog and owner information
    const appointments = await prisma.appointment.findMany({
      where: {
        vetId: params.id,
      },
      include: {
        dog: {
          include: {
            owners: {
              include: {
                owner: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true,
                    contact: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        dateTime: 'desc',
      },
    })

    // Transform the data to get unique dogs with their owners
    const uniqueDogs = Array.from(
      new Map(
        appointments.map(appointment => [
          appointment.dog.id,
          {
            id: appointment.dog.id,
            name: appointment.dog.name,
            breed: appointment.dog.breed,
            owners: appointment.dog.owners.map(owner => owner.owner),
            lastAppointment: appointment.dateTime,
          },
        ])
      ).values()
    )

    return successResponse(uniqueDogs)
  } catch (error) {
    return handleApiError(error)
  }
} 