/** @format */

import { drizzle } from 'drizzle-orm/postgres-js';

// Validate the DATABASE_URL environment variable
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  console.error(
    'Using default database URL, which may not be secure for production.'
  );
}

const db = drizzle(
  databaseUrl ||
    'postgresql://neondb_owner:nat2CGT5VWNu@ep-small-tooth-a444bgxh.us-east-1.aws.neon.tech/courses-selling?sslmode=require'
);

// Example query (uncomment when needed)
// const result = await db.execute('select 1');

export { db };
