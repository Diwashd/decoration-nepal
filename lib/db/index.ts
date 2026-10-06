import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create PostgreSQL connection pool with SSL for cloud databases
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Vercel can create many function instances. Keep each instance small so
  // the aggregate connection count stays within Supabase's pooler limit.
  max: Number(process.env.DB_POOL_MAX || 1),
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
  ssl: process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('neon')
    ? { rejectUnauthorized: false }
    : false,
});

// Export drizzle instance with schema
export const db = drizzle(pool, { schema });

// Export types for convenience
export type DbClient = typeof db;
