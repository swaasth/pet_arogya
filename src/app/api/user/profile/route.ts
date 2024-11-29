import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  contact: z.string().min(10, 'Please enter a valid contact number'),
  address: z.string().min(5, 'Please enter a valid address'),
  specialization: z.string().optional(),
  license_no: z.string().optional(),
})

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    // Only allow vet-specific fields if user is a vet
    if (user.role !== 'vet') {
      delete validatedData.specialization
      delete validatedData.license_no
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        full_name: true,
        contact: true,
        address: true,
        role: true,
        license_no: true,
        specialization: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error('Profile update error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 