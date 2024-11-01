/** @format */

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Validate the DATABASE_URL environment variable
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  console.error(
    'Using default database URL, which may not be secure for production.'
  );
}

export default defineConfig({
  out: './drizzle',
  schema: './src/models/course-model.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      databaseUrl ||
      'postgresql://neondb_owner:nat2CGT5VWNu@ep-small-tooth-a444bgxh.us-east-1.aws.neon.tech/courses-selling?sslmode=require',
  },
});
