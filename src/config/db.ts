/** @format */

import { drizzle } from 'drizzle-orm/postgres-js';

export const db = drizzle(
  process.env.DATABASE_URL! ||
    'postgresql://neondb_owner:nat2CGT5VWNu@ep-small-tooth-a444bgxh.us-east-1.aws.neon.tech/courses-selling?sslmode=require'
);

// const result = await db.execute('select 1');
