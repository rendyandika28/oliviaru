import { H3Event } from "h3"
import { sql } from "drizzle-orm";
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
  let classQuery = useDrizzle()
    .select()
    .from(tables.classTable)
    .limit(limit)
    .offset(offset)

  if (search) {
    classQuery = classQuery.where(
      or(
        sql`LOWER(${tables.classTable.title}) LIKE LOWER(${search})`,
        sql`LOWER(${tables.classTable.description}) LIKE LOWER(${search})`
      )
    );
  }

  const users = await classQuery.execute();

  return ApiResponseFormatter(200, "Success", users, {
    total: count,
    perPage: limit,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  })
})
