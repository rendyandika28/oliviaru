import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';

export default defineEventHandler(async (event: H3Event) => {
  const userId = await requireAuth(event);

  const existingUser = await useDrizzle().query.user.findFirst({
    where: eq(tables.user.id, userId),
  });

  if (!existingUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return ApiResponseFormatter(200, 'Success', existingUser);
});
