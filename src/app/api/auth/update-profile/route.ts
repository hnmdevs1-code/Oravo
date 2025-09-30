import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, badRequest, serverError } from '@/lib/response';
import { getUserByEmail, updateUser } from '@/queries';

export async function POST(request: Request) {
  const schema = z.object({
    email: z.string().email(),
    dataRegion: z.string().optional(),
    userRole: z.string().optional(),
    websiteType: z.string().optional(),
    primaryGoal: z.string().optional(),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { email, dataRegion, userRole, websiteType, primaryGoal } = body;

  try {
    // Find user by email
    const user = await getUserByEmail(email.toLowerCase());

    if (!user) {
      return badRequest('User not found');
    }

    // Update user profile
    await updateUser(user.id, {
      dataRegion,
      userRole,
      websiteType,
      primaryGoal,
    });

    return json({
      message: 'Profile updated successfully',
      success: true,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return serverError('Internal server error');
  }
}