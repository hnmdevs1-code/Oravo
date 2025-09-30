import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, badRequest, serverError } from '@/lib/response';
import { getUserByEmail, updateUser } from '@/queries';
import { createSecureToken } from '@/lib/jwt';
import { secret } from '@/lib/crypto';
import { saveAuth } from '@/lib/auth';
import redis from '@/lib/redis';

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

    if (!user.emailVerified) {
      return badRequest('Email not verified');
    }

    // Mark onboarding as completed
    await updateUser(user.id, {
      onboardingCompleted: true,
    });

    // Create authentication token
    const token = createSecureToken({ userId: user.id }, secret());
    const authKey = `auth:${token}`;

    // Save authentication in Redis
    await saveAuth(token, {
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Complete onboarding error:', err);
    return serverError('Internal server error');
  }
}