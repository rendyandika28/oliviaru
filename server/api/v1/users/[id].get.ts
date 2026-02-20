import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';
import { getUserDetailWithAccess } from '~/server/services/user.service';

export default defineEventHandler(async (event: H3Event) => {
  await requireAdmin(event);

  const userId = event.context.params?.id;
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const userDetail = await getUserDetailWithAccess(userId);
  if (!userDetail) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return ApiResponseFormatter(200, 'Success', userDetail);
});
