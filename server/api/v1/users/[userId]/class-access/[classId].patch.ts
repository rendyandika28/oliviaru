import { H3Event } from "h3";
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { AccessStatusEnum, userClassAccess } from "~/server/database/schema";
import { ApiResponseFormatter } from "~/utils/api";

export default defineEventHandler(async (event: H3Event) => {
  const userId = event.context.params?.userId;
  const classId = Number(event.context.params?.classId);
  const body = await readBody<{
    action: 'grant' | 'revoke';
    grantedByUserId: string;
  }>(event);

  if (!userId || !classId || !['grant', 'revoke'].includes(body.action)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid request' }));
  }

  const existingAccess = await useDrizzle().query.userClassAccess.findFirst({
    where: and(
      eq(userClassAccess.userId, userId),
      eq(userClassAccess.classId, classId),
    )
  });

  if (body.action === 'grant') {
    // If already ACTIVE, do nothing
    if (existingAccess?.status === AccessStatusEnum.ACTIVE) {
      return ApiResponseFormatter(200, 'Kelas sudah aktif');
    }

    const grantedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(grantedAt.getMonth() + 12); // 12-month access

    if (existingAccess) {
      // Re-grant if previously revoked/expired
      await useDrizzle().update(userClassAccess).set({
        status: AccessStatusEnum.ACTIVE,
        grantedAt,
        expiresAt,
        grantedByUserId: body.grantedByUserId,
        updatedAt: new Date(),
      }).where(eq(userClassAccess.id, existingAccess.id));
    } else {
      // New grant
      await useDrizzle().insert(userClassAccess).values({
        id: createId(),
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
    return ApiResponseFormatter(200, 'Akses berhasil diberikan');
  }

  if (body.action === 'revoke') {
    if (!existingAccess || existingAccess.status !== AccessStatusEnum.ACTIVE) {
      return ApiResponseFormatter(200, 'Tidak ada aksi');
    }

    await useDrizzle().update(userClassAccess).set({
      status: AccessStatusEnum.REVOKED,
      updatedAt: new Date(),
    }).where(eq(userClassAccess.id, existingAccess.id));
    return ApiResponseFormatter(200, 'Akses berhasil dicabut');
  }
});
