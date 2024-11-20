import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.$transaction([
      prisma.vaccination.deleteMany({
        where: { dogId: params.dogId }
      }),
      prisma.deworming.deleteMany({
        where: { dogId: params.dogId }
      }),
      prisma.dogsOwners.deleteMany({
        where: { dogId: params.dogId }
      }),
      prisma.dog.delete({
        where: { id: params.dogId }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete dog' },
      { status: 500 }
    )
  }
} 