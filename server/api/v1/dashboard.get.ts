import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';

export default defineEventHandler(async (event: H3Event) => {
  await requireAdmin(event);

  const db = useDrizzle();
  const [[{ userCount }], [{ classCount }], [{ activeAccessCount }]] = await Promise.all([
    db.select({ userCount: sql<number>`count(*)` }).from(tables.user).execute(),
    db.select({ classCount: sql<number>`count(*)` }).from(tables.classTable).execute(),
    db.select({ activeAccessCount: sql<number>`count(*)` }).from(tables.userClassAccess)
      .where(eq(tables.userClassAccess.status, 'ACTIVE')).execute(),
  ]);

  return ApiResponseFormatter(200, 'Success', {
    userCount,
    classCount,
    activeAccessCount,
  });
});
