import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Test the database connection
    const result = await db.execute(sql`SELECT NOW() as current_time, version() as pg_version`);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

