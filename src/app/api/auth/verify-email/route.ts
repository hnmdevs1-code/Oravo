import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, badRequest, methodNotAllowed } from '@/lib/response';
import { updateUser } from '@/queries';
import { sendEmail, generateWelcomeEmailHtml } from '@/lib/email';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return badRequest('Verification token is required');
  }

  try {
    // Find user with this verification token
    const user = await prisma.client.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
        deletedAt: null,
      },
    });

    if (!user) {
      return badRequest('Invalid or expired verification token');
    }

    // Update user as verified and clear the token
    await updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
    });

    // Send welcome email
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;
    const welcomeEmailHtml = generateWelcomeEmailHtml(user.displayName || user.username, dashboardUrl);
    
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Oravo Analytics!',
      html: welcomeEmailHtml,
    });

    // Redirect to a success page or dashboard
    return Response.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?verified=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    return badRequest('Failed to verify email');
  }
}

export async function POST(request: Request) {
  const schema = z.object({
    token: z.string(),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { token } = body;

  try {
    // Find user with this verification token
    const user = await prisma.client.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
        deletedAt: null,
      },
    });

    if (!user) {
      return badRequest('Invalid or expired verification token');
    }

    // Update user as verified and clear the token
    await updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
    });

    // Send welcome email
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;
    const welcomeEmailHtml = generateWelcomeEmailHtml(user.displayName || user.username, dashboardUrl);
    
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Oravo Analytics!',
      html: welcomeEmailHtml,
    });

    return json({ 
      success: true, 
      message: 'Email verified successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: true,
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return badRequest('Failed to verify email');
  }
}

// Only allow GET and POST methods
export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}