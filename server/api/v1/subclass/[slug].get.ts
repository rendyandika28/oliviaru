import { H3Event } from "h3";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "slug is required" });
  }

  const existingSubClass = await useDrizzle().query.subClassTable.findFirst({
    where: eq(tables.subClassTable.slug, slug),
    with: {
      class: {
        columns: {
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

  // Fetch the slug of the next subclass with the same class_id and orderIndex + 1
  const nextSubClass = await useDrizzle().query.subClassTable.findFirst({
    where: and(
      eq(tables.subClassTable.classId, existingSubClass.classId),
      eq(tables.subClassTable.orderIndex, existingSubClass.orderIndex + 1)
    ),
    columns: { slug: true }, // Only fetch the slug
  });

  return ApiResponseFormatter(200, "Success get class", {...existingSubClass, nextSubClassSlug: nextSubClass?.slug || null})
})
