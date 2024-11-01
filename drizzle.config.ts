/** @format */

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Validate and parse the DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    'Error: DATABASE_URL environment variable is not set. Please define it.'
  );
  process.exit(1);
}

export default defineConfig({
  out: './drizzle',
  schema: './src/models/course-model.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
