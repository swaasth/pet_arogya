import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      role, 
      full_name, 
      license_no, 
      specialization 
    } = body

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

    // Validate veterinary registration
    if (role === 'veterinary' && !license_no) {
      return NextResponse.json(
        { error: 'License number is required for veterinarians' },
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
        full_name,
        license_no: role === 'veterinary' ? license_no : null,
        specialization: role === 'veterinary' ? specialization : null,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
} 