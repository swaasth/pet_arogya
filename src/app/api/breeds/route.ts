import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const group = searchParams.get('group')
    const size = searchParams.get('size')

    const where = {
      ...(query && {
        name: {
          contains: query,
          mode: 'insensitive' as const
        }
      }),
      ...(group && { breedGroup: group }),
      ...(size && { size: size })
    }

    const breeds = await prisma.breeds.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ breeds })
  } catch (error) {
    console.error('Error fetching breeds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch breeds' },
      { status: 500 }
    )
  }
} 