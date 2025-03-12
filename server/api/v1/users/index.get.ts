import { H3Event } from "h3"
import { sql } from "drizzle-orm";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.searchQuery ? `%${query.searchQuery}%` : null;

  // Count total users for pagination
  const [{ count }] = await useDrizzle()
    .select({ count: sql<number>`count(*)` })
    .from(tables.user).execute()

  // Fetch users with optional search and pagination
  let usersQuery = useDrizzle()
    .select()
    .from(tables.user)
    .limit(limit)
    .offset(offset)

  if (search) {
    usersQuery = usersQuery.where(
      or(
        sql`LOWER(${tables.user.name}) LIKE LOWER(${search})`,
        sql`LOWER(${tables.user.email}) LIKE LOWER(${search})`
      )
    );
  }

  const users = await usersQuery.execute();

  return ApiResponseFormatter(200, "Success", users, {
    total: count,
    perPage: limit,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  })
})
