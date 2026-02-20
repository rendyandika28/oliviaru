import { VideoStatusEnum } from '~/server/database/schema';

export interface ClassListOptions {
  page: number;
  limit: number;
  offset: number;
  search: string | null;
}

export async function getClassList(options: ClassListOptions) {
  const { limit, offset, search } = options;
  const db = useDrizzle();

  const conditions = search
    ? or(
        like(tables.classTable.title, search),
        like(tables.classTable.description, search)
      )
    : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(tables.classTable)
    .where(conditions)
    .execute();

  const classes = await db.query.classTable.findMany({
    limit,
    offset,
    where: conditions ? () => conditions : undefined,
    with: {
      subClasses: {
        orderBy: (subClasses: any) => [subClasses.orderIndex],
      },
    },
  });

  return { classes, total };
}

export async function getUserClassList(
  userId: string,
  options: ClassListOptions
) {
  const { limit, offset, search } = options;
  const db = useDrizzle();

  const baseConditions = and(
    eq(tables.userClassAccess.userId, userId),
    eq(tables.userClassAccess.status, 'ACTIVE')
  );

  const searchConditions = search
    ? and(
        baseConditions,
        or(
          like(tables.classTable.title, search),
          like(tables.classTable.description, search)
        )
      )
    : baseConditions;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(tables.classTable)
    .innerJoin(tables.userClassAccess, eq(tables.classTable.id, tables.userClassAccess.classId))
    .where(searchConditions)
    .execute();

  const results = await db
    .select()
    .from(tables.classTable)
    .innerJoin(tables.userClassAccess, eq(tables.classTable.id, tables.userClassAccess.classId))
    .where(searchConditions)
    .offset(offset)
    .limit(limit)
    .execute();

  const classes = results.map((r) => r.class);

  return { classes, total };
}

export async function getClassBySlug(slug: string) {
  return useDrizzle().query.classTable.findFirst({
    where: eq(tables.classTable.slug, slug),
    with: {
      subClasses: {
        orderBy: (subClasses: any) => [subClasses.orderIndex],
      },
    },
  });
}

export async function getClassBySlugOrThrow(slug: string) {
  const existingClass = await getClassBySlug(slug);
  if (!existingClass) {
    throw createError({ statusCode: 404, statusMessage: 'Class not found' });
  }
  return existingClass;
}

interface ClassFormFields {
  title: string;
  description?: string;
  status?: string;
  thumbnail_url?: unknown;
  subclasses: Array<{
    id?: number | string;
    title: string;
    description?: string;
    video_url?: unknown;
    attachment_url?: unknown;
  }>;
  [key: string]: unknown;
}

export async function createClass(fields: ClassFormFields) {
  const slug = generateUniqueSlug(fields.title);

  let thumbnailUrl: string | null = null;
  if (fields.thumbnail_url && typeof fields.thumbnail_url !== 'string') {
    thumbnailUrl = await uploadFormFile(fields.thumbnail_url, 'thumbnails');
  }

  return useDrizzle().transaction(async (tx) => {
    const insertId = await tx.insert(tables.classTable).values({
      title: fields.title,
      slug,
      description: fields.description,
      thumbnailUrl,
      status: fields.status || 'DRAFT',
    }).$returningId();

    if (!fields.subclasses || fields.subclasses.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'At least one subclass is required' });
    }

    const subClassValues = await Promise.all(
      fields.subclasses.map(async (sub, index) => {
        let attachmentUrl: string | null = null;
        if (sub?.attachment_url && typeof sub.attachment_url !== 'string') {
          attachmentUrl = await uploadFormFile(sub.attachment_url, 'attachments');
        }
        return {
          title: sub.title,
          slug: generateUniqueSlug(sub.title),
          description: sub.description,
          orderIndex: index + 1,
          videoUrl: sub?.video_url || null,
          attachmentUrl,
          videoStatus: VideoStatusEnum.UPLOADED,
          classId: Number(insertId[0].id),
        };
      })
    );

    await tx.insert(tables.subClassTable).values(subClassValues);
    return { slug };
  });
}

export async function updateClass(existingSlug: string, fields: ClassFormFields) {
  const existingClass = await getClassBySlugOrThrow(existingSlug);

  // Handle thumbnail upload
  let thumbnailUrl = existingClass.thumbnailUrl;
  if (fields.thumbnail_url && typeof fields.thumbnail_url !== 'string') {
    thumbnailUrl = await uploadFormFile(fields.thumbnail_url, 'thumbnails');
    await deleteStoredFile(existingClass.thumbnailUrl);
  }

  // Update slug if title changed
  let slug = existingClass.slug;
  if (fields.title !== existingClass.title) {
    slug = generateUniqueSlug(fields.title);
  }

  return useDrizzle().transaction(async (tx) => {
    await tx.update(tables.classTable).set({
      title: fields.title,
      slug,
      description: fields.description,
      thumbnailUrl,
      status: fields.status || existingClass.status,
    }).where(eq(tables.classTable.id, existingClass.id));

    if (!fields.subclasses || fields.subclasses.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'At least one subclass is required' });
    }

    // Identify subclasses to delete
    const existingSubclassIds = existingClass.subClasses.map(s => s.id);
    const updatedSubclassIds = fields.subclasses
      .filter(s => s.id)
      .map(s => Number(s.id));
    const subclassesToDelete = existingSubclassIds.filter(id => !updatedSubclassIds.includes(id));

    // Clean up files for deleted subclasses
    const deletedSubs = existingClass.subClasses.filter(s => subclassesToDelete.includes(s.id));
    for (const sub of deletedSubs) {
      await deleteStoredFile(sub.attachmentUrl);
    }

    if (subclassesToDelete.length > 0) {
      await tx.delete(tables.subClassTable)
        .where(inArray(tables.subClassTable.id, subclassesToDelete));
    }

    // Update or create subclasses
    for (let i = 0; i < fields.subclasses.length; i++) {
      const subClass = fields.subclasses[i];
      const orderIndex = i + 1;

      if (subClass.id) {
        // Update existing subclass
        const updateData: Record<string, any> = {
          title: subClass.title,
          description: subClass.description,
          orderIndex,
        };

        if (subClass.video_url) {
          updateData.videoUrl = subClass.video_url;
          updateData.videoStatus = VideoStatusEnum.UPLOADED;
        }

        if (subClass.attachment_url && typeof subClass.attachment_url !== 'string') {
          updateData.attachmentUrl = await uploadFormFile(subClass.attachment_url, 'attachments');
          const existingSub = existingClass.subClasses.find(s => s.id === Number(subClass.id));
          await deleteStoredFile(existingSub?.attachmentUrl);
        }

        await tx.update(tables.subClassTable)
          .set(updateData)
          .where(eq(tables.subClassTable.id, Number(subClass.id)));
      } else {
        // Create new subclass
        let attachmentUrl: string | null = null;
        if (subClass.attachment_url && typeof subClass.attachment_url !== 'string') {
          attachmentUrl = await uploadFormFile(subClass.attachment_url, 'attachments');
        }

        await tx.insert(tables.subClassTable).values({
          title: subClass.title,
          slug: generateUniqueSlug(subClass.title),
          description: subClass.description,
          orderIndex,
          videoUrl: subClass?.video_url || null,
          videoStatus: VideoStatusEnum.UPLOADED,
          attachmentUrl,
          classId: existingClass.id,
        });
      }
    }

    return { slug };
  });
}

export async function deleteClassBySlug(slug: string) {
  const existingClass = await getClassBySlugOrThrow(slug);

  // Collect all file URLs for cleanup
  const filesToDelete: (string | null)[] = [existingClass.thumbnailUrl];
  for (const sub of existingClass.subClasses) {
    filesToDelete.push(sub.attachmentUrl);
  }

  await useDrizzle().delete(tables.classTable)
    .where(eq(tables.classTable.id, existingClass.id));

  // Clean up files after successful DB deletion
  for (const url of filesToDelete) {
    await deleteStoredFile(url);
  }
}
