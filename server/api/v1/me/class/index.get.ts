import { H3Event } from "h3"
import { sql, like } from "drizzle-orm";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const { userId } = event.context.auth;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.searchQuery ? `%${query.searchQuery}%` : null;


  // Count total class for pagination
  const [{ count }] = await useDrizzle()
    .select({ count: sql<number>`count(*)` })
    .from(tables.classTable)
    .innerJoin(tables.userClassAccess, eq(tables.classTable.id, tables.userClassAccess.classId))
    .where(and(
      eq(tables.userClassAccess.userId, userId),
      eq(tables.userClassAccess.status, 'ACTIVE')
    ))
    .execute();

  console.log({ count });


  // Fetch paginated and filtered classes
  const results = await useDrizzle()
    .select()
    .from(tables.classTable)
    .innerJoin(tables.userClassAccess, eq(tables.classTable.id, tables.userClassAccess.classId))
    .where(and(
      eq(tables.userClassAccess.userId, userId),
      eq(tables.userClassAccess.status, 'ACTIVE'),
      ...(search ? [
        or(
          like(tables.classTable.title, search),
          like(tables.classTable.description, search)
        )
      ] : [])
    ))
    .offset(offset)
    .limit(limit)
    .execute();

  const data = results.map((r) => r.class); // destructure from joined result


  return ApiResponseFormatter(200, "Success", data, {
    total: count,
    perPage: limit,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  })
})
