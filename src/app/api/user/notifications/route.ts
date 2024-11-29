import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
})

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = notificationSchema.parse(body)

    // Update notification preferences
    // Note: You'll need to add these fields to your User model in schema.prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailNotifications: validatedData.emailNotifications,
        smsNotifications: validatedData.smsNotifications,
      },
      select: {
        id: true,
        emailNotifications: true,
        smsNotifications: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error('Notification preferences update error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 