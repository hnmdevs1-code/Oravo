import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Find user with matching email and verification code
    const user = await db.user.findFirst({
      where: {
        email: email.toLowerCase(),
        emailVerificationCode: code,
        emailVerificationExpiry: {
          gt: new Date(), // Code hasn't expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Update user as verified and clear verification fields
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationCode: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.displayName || user.username);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if email sending fails
    }

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}