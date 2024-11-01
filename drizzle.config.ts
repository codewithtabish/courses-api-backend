/** @format */

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/models/course-model.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL! ||
      'postgresql://neondb_owner:nat2CGT5VWNu@ep-small-tooth-a444bgxh.us-east-1.aws.neon.tech/courses-selling?sslmode=require',
  },
});
