/** @format */

import { drizzle } from 'drizzle-orm/postgres-js';

// Validate the DATABASE_URL environment variable
const databaseUrl = process.env.DATABASE_URL!;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// Initialize the database connection
let db;

try {
  // @ts-ignore
  db = drizzle(databaseUrl);
} catch (error: any) {
  console.error('Database connection error:', error.message);
  process.exit(1);
}

export { db };
