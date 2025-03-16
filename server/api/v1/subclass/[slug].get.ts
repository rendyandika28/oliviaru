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
      class: true
    }
  })

  if (!existingSubClass) {
    throw createError({
      statusCode: 404,
      message: 'Class not found'
    })
  }

  return ApiResponseFormatter(200, "Success get class", existingSubClass)
})
