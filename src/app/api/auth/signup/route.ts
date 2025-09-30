import { z } from 'zod';
import { hashPassword } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { uuid } from '@/lib/crypto';
import { parseRequest } from '@/lib/request';
import { json, badRequest, methodNotAllowed } from '@/lib/response';
import { createUser, getUserByUsername, getUserByEmail } from '@/queries';
import { createSecureToken } from '@/lib/jwt';
import { secret } from '@/lib/crypto';
import { saveAuth } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import redis from '@/lib/redis';

export async function POST(request: Request) {
  const schema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email().max(255),
    username: z.string().min(3).max(255),
    password: z.string().min(6),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { name, email, username, password } = body;

  // Check if user already exists by username or email
  const existingUserByUsername = await getUserByUsername(username, { showDeleted: true });
  const existingUserByEmail = await getUserByEmail(email, { showDeleted: true });

  if (existingUserByUsername) {
    return badRequest('Username already exists');
  }

  if (existingUserByEmail) {
    return badRequest('Email address already exists');
  }

  try {
    // Generate email verification code
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user
    const user = await createUser({
      id: uuid(),
      username,
      email,
      password: hashPassword(password),
      role: ROLES.user,
      displayName: name,
      emailVerificationCode,
      emailVerificationExpiry,
    });

    // Send verification email with code
    await sendVerificationEmail(email, emailVerificationCode, name);

    return json({
      message: 'User created successfully. Please check your email for verification code.',
      user: { 
        id: user.id, 
        username: user.username,
        email: user.email,
        role: user.role, 
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        isAdmin: user.role === ROLES.admin 
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return badRequest('Failed to create user');
  }
}

// Only allow POST method
export async function GET() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}