import { defineEventHandler, getRouterParam, createError } from 'h3'
import { classTable, user, userClassAccess } from '~/server/database/schema';
import { ApiResponseFormatter } from '~/utils/api';

export async function getUserDetailWithAccess(userId: string) {
  const [userDetail] = await useDrizzle().select().from(user).where(eq(user.id, userId));

  if (!userDetail) return null;

  const classes = await useDrizzle().select().from(classTable);

  const accessRecords = await useDrizzle().select()
    .from(userClassAccess)
    .where(eq(userClassAccess.userId, userId));

  // Map access by classId
  const accessMap = new Map(
    accessRecords.map((a) => [a.classId, { status: a.status, expiresAt: a.expiresAt }])
  );

  // Merge all classes with access info
  const classesWithAccess = classes.map((cls) => ({
    ...cls,
    accessGranted: accessMap.has(cls.id),
    accessStatus: accessMap.get(cls.id)?.status ?? null,
    accessExpiresAt: accessMap.get(cls.id)?.expiresAt ?? null
  }));

  return {
    ...userDetail,
    classes: classesWithAccess
  };
}

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing user ID'
    })
  }

  const userDetail = await getUserDetailWithAccess(userId)

  if (!userDetail) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  return ApiResponseFormatter(200, "Success get users", userDetail)
})
