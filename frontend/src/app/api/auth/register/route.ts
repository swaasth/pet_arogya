import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role, profileData } = body

    console.log('Registration attempt:', { email, role })

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password_hash: hashedPassword,
          role,
          full_name: profileData?.fullName || null,
          contact: profileData?.contactNumber || null,
          address: role === 'veterinary' ? profileData?.clinicAddress : null,
          license_no: role === 'veterinary' ? profileData?.licenseNumber : null,
          specialization: role === 'veterinary' ? profileData?.specialization : null
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        userId: user.id
      })

    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 