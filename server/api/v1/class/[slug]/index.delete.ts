import { H3Event } from "h3";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "slug is required" });
  }

  const existingClass = await useDrizzle().query.classTable.findFirst({
    where: eq(tables.classTable.slug, slug),
    with: {
      subClasses: {
        orderBy: (subClasses) => [subClasses.orderIndex]
      }
    }
  })

  if (!existingClass) {
    throw createError({
      statusCode: 404,
      message: 'Class not found'
    })
  }

  return useDrizzle().transaction(async (tx) => {
    // Due to the "cascade" option in foreign key constraint,
    // deleting the class should automatically delete related subclasses
    await tx.delete(tables.classTable)
      .where(eq(tables.classTable.id, existingClass.id))

    return ApiResponseFormatter(200, "Successfully deleted class")
  }).catch(error => {
    console.error('Error deleting class:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to delete class',
    });
  })
})
