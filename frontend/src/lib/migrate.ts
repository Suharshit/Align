import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { resolve } from 'path';

// Note: Bun automatically loads .env.local, so explicit dotenv config is often not needed,
// but checking it helps debug.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  console.error('Make sure .env.local exists and contains DATABASE_URL.');
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

async function runMigrations() {
  try {
    console.log('Running migrations...');

    // Use absolute path to ensure the folder is found regardless of where the script is run from
    const migrationsFolder = resolve(process.cwd(), 'drizzle');
    console.log(`Reading migrations from: ${migrationsFolder}`);

    await migrate(db, { migrationsFolder });

    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed!');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();

