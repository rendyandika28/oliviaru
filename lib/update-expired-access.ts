import { and, eq, lt, not } from 'drizzle-orm';
import { AccessStatusEnum, userClassAccess } from '~/server/database/schema';

export async function updateExpiredAccesses() {
  const now = new Date();
  await useDrizzle()
    .update(userClassAccess)
    .set({ status: AccessStatusEnum.EXPIRED })
    .where(
      and(
        lt(userClassAccess.expiresAt, now),
        not(eq(userClassAccess.status, AccessStatusEnum.EXPIRED))
      )
    );
}
