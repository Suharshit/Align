import { NextResponse } from 'next/server';
import { getNextPrompt } from '@/lib/csm';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const { conversationId } = await params;

        const prompt = await getNextPrompt(conversationId);

        if (!prompt) {
            return NextResponse.json({ prompt: null });
        }

        // Return strict shape as requested
        return NextResponse.json({
            id: prompt.id,
            promptText: prompt.promptText,
            targetRole: prompt.targetRole,
            sequenceOrder: prompt.sequenceOrder,
        });

    } catch (error: any) {
        if (error.message?.includes('Conversation not found')) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        console.error('Error fetching next prompt:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
