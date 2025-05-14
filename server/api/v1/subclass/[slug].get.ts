import { H3Event } from "h3";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "slug is required" });
  }
  const userId = event.context.auth?.userId;

  const existingSubClass = await useDrizzle().query.subClassTable.findFirst({
    where: eq(tables.subClassTable.slug, slug),
    with: {
      class: {
        columns: {
          id: true,
          slug: true,
          title: true,
        },
      }
    }
  })

  if (!existingSubClass) {
    throw createError({
      statusCode: 404,
      message: 'Class not found'
    })
  }

  let isAccessible = false;

  if (userId) {
    const accessRecord = await useDrizzle().query.userClassAccess.findFirst({
      where: and(
        eq(tables.userClassAccess.userId, userId),
        eq(tables.userClassAccess.classId, existingSubClass.classId),
        eq(tables.userClassAccess.status, "ACTIVE")
      ),
    });

    isAccessible = !!accessRecord;
  }

  // Fetch the slug of the next subclass with the same class_id and orderIndex + 1
  const nextSubClass = await useDrizzle().query.subClassTable.findFirst({
    where: and(
      eq(tables.subClassTable.classId, existingSubClass.classId),
      eq(tables.subClassTable.orderIndex, existingSubClass.orderIndex + 1)
    ),
    columns: { slug: true }, // Only fetch the slug
  });

  return ApiResponseFormatter(200, "Success get class", { ...existingSubClass, isAccessible, nextSubClassSlug: nextSubClass?.slug || null })
})
