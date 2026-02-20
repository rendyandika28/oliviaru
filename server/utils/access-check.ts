export async function checkUserClassAccess(
  userId: string | undefined,
  classId: number
): Promise<boolean> {
  if (!userId) return false;

  // Admins always have access
  const userRecord = await useDrizzle().query.user.findFirst({
    where: eq(tables.user.id, userId),
    columns: { role: true },
  });
  if (userRecord?.role === 'SUPER_ADMIN') return true;

  const accessRow = await useDrizzle().query.userClassAccess.findFirst({
    where: and(
      eq(tables.userClassAccess.userId, userId),
      eq(tables.userClassAccess.classId, classId),
      eq(tables.userClassAccess.status, 'ACTIVE')
    ),
  });
  return !!accessRow;
}
