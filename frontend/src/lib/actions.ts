'use server';

import { db } from './db';
import { waitlist } from './schema';
import { eq } from 'drizzle-orm';

export async function addToWaitlist(email: string) {
    try {
        // Check for existing email first to avoid relying on exception parsing
        const existing = await db.select().from(waitlist).where(eq(waitlist.email, email));
        if (existing.length > 0) {
            return { success: false, error: 'Email already exists' };
        }

        await db.insert(waitlist).values({ email });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to add to waitlist:', error);
        return { success: false, error: 'Failed to add to waitlist' };
    }
}
