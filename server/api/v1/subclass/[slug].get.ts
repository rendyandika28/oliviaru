import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params?.slug;
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const userId = event.context.auth?.userId;

  const existingSubClass = await useDrizzle().query.subClassTable.findFirst({
    where: eq(tables.subClassTable.slug, slug),
    with: {
      class: {
        columns: { id: true, slug: true, title: true },
      },
    },
  });

  if (!existingSubClass) {
    throw createError({ statusCode: 404, statusMessage: 'Subclass not found' });
  }

  const isAccessible = await checkUserClassAccess(userId, existingSubClass.classId);

  const nextSubClass = await useDrizzle().query.subClassTable.findFirst({
    where: and(
      eq(tables.subClassTable.classId, existingSubClass.classId),
      eq(tables.subClassTable.orderIndex, existingSubClass.orderIndex + 1)
    ),
    columns: { slug: true },
  });

  return ApiResponseFormatter(200, 'Success', {
    ...existingSubClass,
    isAccessible,
    nextSubClassSlug: nextSubClass?.slug || null,
  });
});
