import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, badRequest, serverError } from '@/lib/response';
import { getUserByEmail, updateUser } from '@/queries';
import { sendVerificationEmail } from '@/lib/email';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  const schema = z.object({
    email: z.string().email(),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { email } = body;

  try {
    // Find user by email
    const user = await getUserByEmail(email.toLowerCase());

    if (!user) {
      return badRequest('User not found');
    }

    if (user.emailVerified) {
      return badRequest('Email is already verified');
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new verification code
    await updateUser(user.id, {
      emailVerificationCode: verificationCode,
      emailVerificationExpiry: expiryTime,
    });

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode, user.username);

    return json({
      message: 'Verification email sent successfully',
      success: true,
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    return serverError('Internal server error');
  }
}