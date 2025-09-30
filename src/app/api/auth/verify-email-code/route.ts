import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, badRequest, serverError } from '@/lib/response';
import { getUserByEmail, updateUser } from '@/queries';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  const schema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { email, code } = body;

  try {
    // Find user with matching email
    const user = await getUserByEmail(email.toLowerCase());

    if (!user || 
        user.emailVerificationCode !== code || 
        !user.emailVerificationExpiry || 
        user.emailVerificationExpiry < new Date()) {
      return badRequest('Invalid or expired verification code');
    }

    // Update user to mark email as verified and clear verification code
    await updateUser(user.id, {
      emailVerified: new Date(),
      emailVerificationCode: null,
      emailVerificationExpiry: null,
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if email sending fails
    }

    return json({
      message: 'Email verified successfully',
      success: true,
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return serverError('Internal server error');
  }
}