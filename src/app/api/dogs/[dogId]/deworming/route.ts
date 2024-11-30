import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const records = await prisma.deworming.findMany({
      where: {
        dogId: params.dogId
      },
      select: {
        id: true,
        medicineName: true,
        dateAdministered: true,
        nextDueDate: true,
        administeredBy: true,
        notes: true
      },
      orderBy: {
        dateAdministered: 'desc'
      }
    })

    return NextResponse.json(records)
  } catch (error: unknown) {
    console.error('Error fetching deworming records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deworming records' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { medicineName, dateAdministered, nextDueDate, administeredBy, notes } = await request.json()

    await prisma.deworming.create({
      data: {
        dogId: params.dogId,
        medicineName,
        dateAdministered,
        nextDueDate,
        administeredBy,
        notes
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error adding deworming record:', error);
    return NextResponse.json(
      { error: 'Failed to add deworming record' },
      { status: 500 }
    )
  }
} 