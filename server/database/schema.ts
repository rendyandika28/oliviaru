import { createId } from '@paralleldrive/cuid2';
import { InferInsertModel, InferSelectModel, sql, relations } from 'drizzle-orm';
import { mysqlEnum, mysqlTable, timestamp, varchar, int, text, uniqueIndex, index, boolean } from 'drizzle-orm/mysql-core';

export const RoleEnum = {
  USER: 'USER',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export const UserStatusEnum = {
  PENDING: 'PENDING',
  REGISTERED: 'REGISTERED',
} as const;

// Define enums
export const ClassStatusEnum = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
} as const;

export const VideoStatusEnum = {
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED',
  FAILED: 'FAILED'
} as const;

// New enum for access status
export const AccessStatusEnum = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED'
} as const;

export const user = mysqlTable('user', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 255 }),
  provider: varchar('provider', { length: 255 }),
  providerAccountId: varchar('provider_account_id', { length: 255 }),
  role: mysqlEnum('role', Object.values(RoleEnum)).notNull().default(RoleEnum.USER),
  userStatus: mysqlEnum('user_status', Object.values(UserStatusEnum)).notNull().default(UserStatusEnum.PENDING),

  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
})

export const userToken = mysqlTable('user_token', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const classTable = mysqlTable('class', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  status: mysqlEnum('status', Object.values(ClassStatusEnum)).notNull().default(ClassStatusEnum.DRAFT),

  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// Define the subclass table
export const subClassTable = mysqlTable('sub_class', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  orderIndex: int('order_index').notNull(),
  videoUrl: text('video_url'),
  attachmentUrl: text('attachment_url'),
  videoStatus: mysqlEnum('video_status', Object.values(VideoStatusEnum)).default(VideoStatusEnum.UPLOADING),
  thumbnailUrl: text('thumbnail_url'),
  classId: int('class_id').notNull().references(() => classTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    // Create composite unique constraint
    classIdSlugUnique: uniqueIndex('class_id_slug_unique').on(table.classId, table.slug),
    // Create index for efficient ordering
    classIdOrderIndex: index('class_id_order_index').on(table.classId, table.orderIndex)
  };
});

// New table for managing user access to classes
export const userClassAccess = mysqlTable('user_class_access', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  classId: int('class_id').notNull().references(() => classTable.id, { onDelete: 'cascade' }),

  // Duration in days
  durationDays: int('duration_days').notNull(),

  // Track when access was granted and when it expires
  grantedAt: timestamp('granted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: timestamp('expires_at').notNull(),

  // Status of the access
  status: mysqlEnum('status', Object.values(AccessStatusEnum)).notNull().default(AccessStatusEnum.ACTIVE),

  // Admin who granted the access
  grantedByUserId: varchar('granted_by_user_id', { length: 128 }).references(() => user.id),

  // Notes for admin
  notes: text('notes'),

  // Notification settings
  notificationSent: boolean('notification_sent').notNull().default(false),

  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    // Index for looking up access by user
    userIdIndex: index('user_id_index').on(table.userId),
    // Index for looking up access by class
    classIdIndex: index('class_id_index').on(table.classId),
    // Index for finding soon-to-expire or expired access
    expiresAtIndex: index('expires_at_index').on(table.expiresAt),
    // Unique constraint to prevent duplicate active access
    userClassUnique: uniqueIndex('user_class_unique').on(
      table.userId,
      table.classId
    )
  };
});

// Define the relations
export const userRelations = relations(user, ({ many }) => ({
  classAccess: many(userClassAccess),
  grantedAccess: many(userClassAccess, { relationName: 'grantedBy' })
}));

export const classRelations = relations(classTable, ({ many }) => ({
  subClasses: many(subClassTable),
  userAccess: many(userClassAccess)
}));

export const subClassRelations = relations(subClassTable, ({ one }) => ({
  class: one(classTable, {
    fields: [subClassTable.classId],
    references: [classTable.id]
  })
}));

export const userClassAccessRelations = relations(userClassAccess, ({ one }) => ({
  user: one(user, {
    fields: [userClassAccess.userId],
    references: [user.id]
  }),
  class: one(classTable, {
    fields: [userClassAccess.classId],
    references: [classTable.id]
  }),
  grantedBy: one(user, {
    fields: [userClassAccess.grantedByUserId],
    references: [user.id],
    relationName: 'grantedBy'
  })
}));

// Define the schema for type safety
export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
export type UserToken = InferSelectModel<typeof userToken>
export type NewUserToken = InferInsertModel<typeof userToken>

export type Class = InferSelectModel<typeof classTable>;
export type NewClass = InferInsertModel<typeof classTable>;

export type SubClass = InferSelectModel<typeof subClassTable>;
export type NewSubClass = InferInsertModel<typeof subClassTable>;

export type UserClassAccess = InferSelectModel<typeof userClassAccess>;
export type NewUserClassAccess = InferInsertModel<typeof userClassAccess>;
