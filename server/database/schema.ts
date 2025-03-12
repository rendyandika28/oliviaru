import { createId } from '@paralleldrive/cuid2';
import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import { mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const RoleEnum = {
  USER: 'USER',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export const UserStatusEnum = {
  PENDING: 'PENDING',
  REGISTERED: 'REGISTERED',
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

// Define the schema for type safety
export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
