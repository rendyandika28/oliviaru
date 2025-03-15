import { H3Event } from "h3";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id is required" });
  }

  const existingClass = await useDrizzle().query.classTable.findFirst({
    where: eq(tables.subClassTable.id, Number(id)),
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
