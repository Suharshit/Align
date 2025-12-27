import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get the database URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the Neon HTTP client
const sql = neon(connectionString);

// Create the Drizzle database instance
export const db = drizzle(sql, { schema });

// Export the schema for use in other files
export * from './schema';

