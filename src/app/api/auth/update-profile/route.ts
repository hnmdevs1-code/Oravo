import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, dataRegion, userRole, websiteType, primaryGoal } = await request.json();

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

    // Update user profile
    await db.user.update({
      where: { id: user.id },
      data: {
        dataRegion,
        userRole,
        websiteType,
        primaryGoal,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      success: true,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}