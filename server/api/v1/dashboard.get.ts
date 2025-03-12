import { H3Event } from "h3"
import { ApiResponseFormatter } from "~/utils/api"
export default defineEventHandler(async (event: H3Event) => {
  // Count total users for pagination
  const [{ count: user_count }] = await useDrizzle()
    .select({ count: sql<number>`count(*)` })
    .from(tables.user).execute()

  return ApiResponseFormatter(200, "Success", {
    user_count
  })
})
