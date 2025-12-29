import { config } from 'dotenv';
config({ path: '.env.local' }); // Load env vars manually for script

import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
    console.log('Testing DB connection...');
    try {
        const result = await db.execute(sql`SELECT 1`);
        console.log('Connection successful:', result);
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
