// server/plugins/drizzle.ts
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as schema from '../database/schema';

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  // Only run migrations in development
  if (process.dev) {
    const connection = await mysql.createConnection({
      uri: config.databaseUrl
    });

    const db = drizzle(connection, { schema, mode: 'default' });

    // This will run the migrations
    await migrate(db, { migrationsFolder: './server/database/migrations' });

    await connection.end();
    console.log('Database migrations applied');
  }
});
