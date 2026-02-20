import { H3Event } from 'h3';

export async function requireAuth(event: H3Event): Promise<string> {
  const userId = event.context.auth?.userId;
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  return userId;
}

export async function requireAdmin(event: H3Event): Promise<string> {
  const userId = await requireAuth(event);
  const userRecord = await useDrizzle().query.user.findFirst({
    where: eq(tables.user.id, userId),
    columns: { role: true },
  });
  if (!userRecord || userRecord.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admin access required' });
  }
  return userId;
}
