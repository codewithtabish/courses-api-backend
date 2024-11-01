/** @format */

import { sql } from 'drizzle-orm';
import { db } from './db';

export async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT 1;`);

    console.log('Connection successful: 💞💞');
  } catch (error) {}
}
