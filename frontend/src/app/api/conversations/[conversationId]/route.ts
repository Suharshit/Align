import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const { conversationId } = await params;

        const conversation = await db.query.conversations.findFirst({
            where: eq(conversations.id, conversationId),
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: conversation.id,
            status: conversation.status,
            stage: conversation.stage,
            createdAt: conversation.createdAt,
            closedAt: conversation.closedAt,
        });

    } catch (error) {
        console.error('Error fetching conversation:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
