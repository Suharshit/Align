import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, studentProfiles, founderProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, founderId } = body;

        if (!studentId || !founderId) {
            return NextResponse.json(
                { error: 'Missing required fields: studentId, founderId' },
                { status: 400 }
            );
        }

        // Optional: Validate that profiles exist (good practice, though not strictly MVP requirement, catches errors early)
        const sProfile = await db.query.studentProfiles.findFirst({
            where: eq(studentProfiles.id, studentId),
        });
        const fProfile = await db.query.founderProfiles.findFirst({
            where: eq(founderProfiles.id, founderId),
        });

        if (!sProfile || !fProfile) {
            return NextResponse.json(
                { error: 'Invalid studentId or founderId' },
                { status: 404 }
            );
        }

        // Insert new conversation
        const newConversation = await db.insert(conversations).values({
            studentId,
            founderId,
            status: 'PENDING',
            stage: 'MOTIVATION',
        }).returning({ id: conversations.id });

        return NextResponse.json({ conversationId: newConversation[0].id }, { status: 201 });

    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
