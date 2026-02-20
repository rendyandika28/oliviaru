import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';
import { deleteClassBySlug } from '~/server/services/class.service';

export default defineEventHandler(async (event: H3Event) => {
  await requireAdmin(event);

  const slug = event.context.params?.slug;
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  await deleteClassBySlug(slug);
  return ApiResponseFormatter(200, 'Successfully deleted class');
});
