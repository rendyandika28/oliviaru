import { H3Event } from 'h3';
import { AccessStatusEnum } from '~/server/database/schema';
import { ApiResponseFormatter } from '~/utils/api';

export default defineEventHandler(async (event: H3Event) => {
  await requireAdmin(event);

  const userId = event.context.params?.userId;
  const classId = Number(event.context.params?.classId);
  const body = await readBody<{
    action: 'grant' | 'revoke';
    grantedByUserId: string;
  }>(event);

  if (!userId || !classId || !['grant', 'revoke'].includes(body.action)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' });
  }

  const existingAccess = await useDrizzle().query.userClassAccess.findFirst({
    where: and(
      eq(tables.userClassAccess.userId, userId),
      eq(tables.userClassAccess.classId, classId),
    ),
  });

  if (body.action === 'grant') {
    if (existingAccess?.status === AccessStatusEnum.ACTIVE) {
      return ApiResponseFormatter(200, 'Class access already active');
    }

    const grantedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(grantedAt.getMonth() + 12);

    if (existingAccess) {
      await useDrizzle().update(tables.userClassAccess).set({
        status: AccessStatusEnum.ACTIVE,
        grantedAt,
        expiresAt,
        grantedByUserId: body.grantedByUserId,
      }).where(eq(tables.userClassAccess.id, existingAccess.id));
    } else {
      await useDrizzle().insert(tables.userClassAccess).values({
        userId,
        classId,
        durationDays: 365,
        grantedAt,
        expiresAt,
        status: AccessStatusEnum.ACTIVE,
        grantedByUserId: body.grantedByUserId,
        notificationSent: false,
      });
    }
    return ApiResponseFormatter(200, 'Access granted successfully');
  }

  if (body.action === 'revoke') {
    if (!existingAccess || existingAccess.status !== AccessStatusEnum.ACTIVE) {
      return ApiResponseFormatter(200, 'No active access to revoke');
    }

    await useDrizzle().update(tables.userClassAccess).set({
      status: AccessStatusEnum.REVOKED,
    }).where(eq(tables.userClassAccess.id, existingAccess.id));

    return ApiResponseFormatter(200, 'Access revoked successfully');
  }
});
