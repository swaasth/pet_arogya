import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, license_no, specialization } = body;

    // Validate veterinary data
    if (role === 'veterinary' && !license_no) {
      return NextResponse.json(
        { error: 'License number is required for veterinarians' },
        { status: 400 }
      );
    }

    // Update user
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        role,
        license_no: role === 'veterinary' ? license_no : null,
        specialization: role === 'veterinary' ? specialization : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
} 