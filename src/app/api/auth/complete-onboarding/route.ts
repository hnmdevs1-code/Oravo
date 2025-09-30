import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { createSecureToken } from '@/lib/jwt';
import { secret } from '@/lib/crypto';
import { saveAuth } from '@/lib/auth';
import redis from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { message: 'Email not verified' },
        { status: 400 }
      );
    }

    // Mark onboarding as completed
    await db.user.update({
      where: { id: user.id },
      data: {
        onboardingCompleted: true,
      },
    });

    // Generate auth token
    let token: string;

    if (redis.enabled) {
      token = await saveAuth({ userId: user.id, role: user.role });
    } else {
      token = createSecureToken({ userId: user.id, role: user.role }, secret());
    }

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        onboardingCompleted: true,
      },
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}