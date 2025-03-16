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

  return ApiResponseFormatter(200, "Success get class", existingClass)
})
