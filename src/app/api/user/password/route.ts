import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as z from 'zod'
import bcrypt from 'bcryptjs'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = passwordSchema.parse(body)

    // Get the user with password hash
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password_hash: true }
    })

    if (!userWithPassword) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      userWithPassword.password_hash
    )

    if (!isCurrentPasswordValid) {
      return new NextResponse('Current password is incorrect', { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword }
    })

    return new NextResponse('Password updated successfully', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error('Password update error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 