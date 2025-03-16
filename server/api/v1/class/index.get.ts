import { H3Event } from "h3"
import { sql, like } from "drizzle-orm";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.searchQuery ? `%${query.searchQuery}%` : null;

  // Count total class for pagination
  const [{ count }] = await useDrizzle()
    .select({ count: sql<number>`count(*)` })
    .from(tables.classTable).execute()

  // Fetch class with optional search and pagination
  let classQuery = useDrizzle().query.classTable.findMany({
    limit,
    offset,
    with: {
      subClasses: true,
    },
  });

  // Add conditional where clause for search
  if (search) {
    classQuery = useDrizzle().query.classTable.findMany({
      limit,
      offset,
      where: or(
        like(tables.classTable.title, `%${search}%`),
        like(tables.classTable.description, `%${search}%`)
      ),
    });
  }

  const users = await classQuery.execute();

  return ApiResponseFormatter(200, "Success", users, {
    total: count,
    perPage: limit,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  })
})
