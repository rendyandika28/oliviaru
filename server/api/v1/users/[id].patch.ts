import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';

export default defineEventHandler(async (event: H3Event) => {
  await requireAdmin(event);

  const userId = event.context.params?.id;
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const body = await readBody(event);

  const updateData: Partial<{ role: string; userStatus: string }> = {};
  if (body.role) updateData.role = body.role;
  if (body.status) updateData.userStatus = body.status;

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields to update' });
  }

  await useDrizzle().update(tables.user).set(updateData).where(eq(tables.user.id, userId));
  return ApiResponseFormatter(200, 'Successfully updated user');
});
