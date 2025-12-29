'use server';

import { db } from './db';
import { waitlist } from './schema';

export async function addToWaitlist(email: string) {
    try {
        await db.insert(waitlist).values({ email });
        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message.includes('unique constraint')) {
            return { success: false, error: 'Email already exists' };
        }
        console.error('Failed to add to waitlist:', error);
        return { success: false, error: 'Failed to add to waitlist' };
    }
}
