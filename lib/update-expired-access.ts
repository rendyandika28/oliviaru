import { and, eq, lt, not } from 'drizzle-orm';
import { AccessStatusEnum, userClassAccess } from '~/server/database/schema';

export async function updateExpiredAccesses() {
  const now = new Date();
  // Update all access records where `expires_at` < now AND status != EXPIRED
  await useDrizzle().update(userClassAccess)
    .set({ status: AccessStatusEnum.EXPIRED })
    .where(
      and(
        lt(userClassAccess.expiresAt, now),
        not(eq(userClassAccess.status, AccessStatusEnum.EXPIRED))
      )
    );
}
