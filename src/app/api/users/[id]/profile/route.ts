import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'
import { ApiError, handleApiError, successResponse, validateUser } from '@/lib/api-utils'

const profileUpdateSchema = z.object({
  full_name: z.string().min(1).optional(),
  contact: z.string().optional(),
  address: z.string().optional(),
  specialization: z.string().optional(),
  license_no: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    validateUser(session?.user)

    // Users can only access their own profile unless they're admin
    if (session.user.id !== params.id && session.user.role !== 'admin') {
      throw new ApiError('Unauthorized access', 403)
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        full_name: true,
        contact: true,
        address: true,
        role: true,
        specialization: true,
        license_no: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    return successResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    validateUser(session?.user)

    // Users can only update their own profile
    if (session.user.id !== params.id) {
      throw new ApiError('Unauthorized access', 403)
    }

    const json = await request.json()
    const data = profileUpdateSchema.parse(json)

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        email: true,
        full_name: true,
        contact: true,
        address: true,
        role: true,
        specialization: true,
        license_no: true,
        updated_at: true,
      },
    })

    return successResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
} 