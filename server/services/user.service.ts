export async function getUserDetailWithAccess(userId: string) {
  const [userDetail] = await useDrizzle()
    .select()
    .from(tables.user)
    .where(eq(tables.user.id, userId));

  if (!userDetail) return null;

  const classes = await useDrizzle().select().from(tables.classTable);

  const accessRecords = await useDrizzle()
    .select()
    .from(tables.userClassAccess)
    .where(eq(tables.userClassAccess.userId, userId));

  const accessMap = new Map(
    accessRecords.map((a) => [a.classId, { status: a.status, expiresAt: a.expiresAt }])
  );

  const classesWithAccess = classes.map((cls) => ({
    ...cls,
    accessGranted: accessMap.has(cls.id),
    accessStatus: accessMap.get(cls.id)?.status ?? null,
    accessExpiresAt: accessMap.get(cls.id)?.expiresAt ?? null,
  }));

  return { ...userDetail, classes: classesWithAccess };
}

export async function getUserList(options: {
  page: number;
  limit: number;
  offset: number;
  search: string | null;
}) {
  const { limit, offset, search } = options;
  const db = useDrizzle();

  const conditions = search
    ? or(
        sql`LOWER(${tables.user.name}) LIKE LOWER(${search})`,
        sql`LOWER(${tables.user.email}) LIKE LOWER(${search})`
      )
    : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(tables.user)
    .where(conditions)
    .execute();

  const users = await db
    .select()
    .from(tables.user)
    .where(conditions)
    .limit(limit)
    .offset(offset)
    .execute();

  return { users, total };
}
