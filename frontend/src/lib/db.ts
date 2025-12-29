import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get the database URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL environment variable is not set. Database features will fail.');
}

// Create the Neon HTTP client
const sql = neon(connectionString || 'postgres://user:pass@host/db');

// Create the Drizzle database instance
export const db = drizzle(sql, { schema });

// Export the schema for use in other files
export * from './schema';

