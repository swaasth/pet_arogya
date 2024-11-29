import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import * as z from 'zod'

const vetAccessSchema = z.object({
  vetEmail: z.string().email(),
  accessDuration: z.number().min(1).max(30) // Days of access
})

export async function GET(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user has access to this dog
    const dogAccess = await prisma.dogsOwners.findFirst({
      where: {
        dogId: params.dogId,
        ownerId: session.user.id
      }
    })

    if (!dogAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all vets with access
    const vets = await prisma.user.findMany({
      where: {
        role: 'veterinarian',
        // Add your vet access conditions here based on your schema
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        license_no: true,
        specialization: true
      }
    })

    return NextResponse.json({ vets })
  } catch (error) {
    console.error('Error fetching vet access:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vet access' },
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
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const body = vetAccessSchema.parse(json)

    // Verify user has access to this dog
    const dogAccess = await prisma.dogsOwners.findFirst({
      where: {
        dogId: params.dogId,
        ownerId: session.user.id
      }
    })

    if (!dogAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Find the veterinarian
    const vet = await prisma.user.findFirst({
      where: {
        email: body.vetEmail,
        role: 'veterinarian'
      }
    })

    if (!vet) {
      return NextResponse.json(
        { error: 'Veterinarian not found' },
        { status: 404 }
      )
    }

    // Grant access (implement based on your access control schema)
    // This is a placeholder - implement according to your needs
    const accessExpiry = new Date()
    accessExpiry.setDate(accessExpiry.getDate() + body.accessDuration)

    // Add your vet access logic here

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error granting vet access:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to grant vet access' },
      { status: 500 }
    )
  }
} 