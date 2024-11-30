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

    const vaccinations = await prisma.vaccination.findMany({
      where: {
        dogId: params.dogId
      },
      select: {
        id: true,
        vaccineName: true,
        dateAdministered: true,
        nextDueDate: true,
        administeredBy: true,
        notes: true
      },
      orderBy: {
        dateAdministered: 'desc'
      }
    })

    return NextResponse.json(vaccinations)
  } catch (error: unknown) {
    console.error('Error fetching vaccinations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vaccinations' },
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

    const body = await request.json()
    
    const vaccination = await prisma.vaccination.create({
      data: {
        dogId: params.dogId,
        vaccineName: body.vaccineName,
        dateAdministered: new Date(body.dateAdministered),
        nextDueDate: new Date(body.nextDueDate),
        administeredBy: body.administeredBy,
        notes: body.notes
      }
    })

    return NextResponse.json(vaccination)
  } catch (error: unknown) {
    console.error('Error creating vaccination record:', error)
    return NextResponse.json(
      { error: 'Failed to create vaccination record' },
      { status: 500 }
    )
  }
} 