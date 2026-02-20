import { generateAccessToken } from '~/utils/auth';

export async function upsertUserToken(userId: string) {
  const token = generateAccessToken(userId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const existingToken = await useDrizzle()
    .select({ id: tables.userToken.id })
    .from(tables.userToken)
    .where(eq(tables.userToken.userId, userId))
    .limit(1);

  if (existingToken.length > 0) {
    await useDrizzle()
      .update(tables.userToken)
      .set({ token, expiresAt })
      .where(eq(tables.userToken.userId, userId));
  } else {
    await useDrizzle()
      .insert(tables.userToken)
      .values({ userId, token, expiresAt });
  }

  return { token, expiresAt };
}
