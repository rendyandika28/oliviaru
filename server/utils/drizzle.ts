import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
export { sql, eq, and, or } from 'drizzle-orm';
import * as schema from '../database/schema';

// Create a connection pool
let connectionPool: mysql.Pool | null = null;
let db: MySql2Database<typeof schema> | null = null;

function getConnectionPool() {
  if (!connectionPool) {
    connectionPool = mysql.createPool({
      uri: process.env.NUXT_DATABASE_URL
    });
  }
  return connectionPool;
}

export const tables = schema;


export function useDrizzle(): MySql2Database<typeof schema> {
  if (!db) {
    db = drizzle(getConnectionPool(), { schema, mode: 'default' });
  }
  return db;
}

// Export your types
// Export your types using the InferSelectModel and InferInsertModel
export type { User, NewUser } from '../database/schema';
