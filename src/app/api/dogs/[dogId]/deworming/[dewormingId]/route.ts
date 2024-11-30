import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { dogId: string; dewormingId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.deworming.delete({
      where: {
        id: params.dewormingId,
        dogId: params.dogId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deworming record:', error)
    return NextResponse.json(
      { error: 'Failed to delete deworming record' },
      { status: 500 }
    )
  }
} 