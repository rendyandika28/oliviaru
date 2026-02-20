import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';
import { getClassBySlugOrThrow } from '~/server/services/class.service';

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params?.slug;
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const userId = event.context.auth?.userId;
  const existingClass = await getClassBySlugOrThrow(slug);
  const isAccessible = await checkUserClassAccess(userId, existingClass.id);

  return ApiResponseFormatter(200, 'Success', { ...existingClass, isAccessible });
});
