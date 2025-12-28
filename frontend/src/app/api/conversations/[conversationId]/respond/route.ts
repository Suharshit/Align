import { NextResponse } from 'next/server';
import { submitResponse } from '@/lib/csm';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const { conversationId } = await params;
        const body = await request.json();
        const { responderRole, responseText } = body;

        // Basic Validation
        if (!responderRole || !responseText) {
            return NextResponse.json(
                { error: 'Missing required fields: responderRole, responseText' },
                { status: 400 }
            );
        }

        if (responderRole !== 'STUDENT' && responderRole !== 'FOUNDER') {
            return NextResponse.json(
                { error: 'Invalid responderRole. Must be STUDENT or FOUNDER' },
                { status: 400 }
            );
        }

        // Call CSM Logic
        await submitResponse({
            conversationId,
            responderRole,
            responseText
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        const errorMsg = error.message || 'Unknown Error';
        console.error('Error submitting response:', errorMsg);

        // Map strict CSM errors to HTTP status codes
        if (errorMsg.includes('Conversation not found')) {
            return NextResponse.json({ error: errorMsg }, { status: 404 });
        }
        if (errorMsg.includes('Role mismatch') || errorMsg.includes('already been answered')) {
            return NextResponse.json({ error: errorMsg }, { status: 409 }); // Conflict
        }
        if (errorMsg.includes('Conversation is already CLOSED') || errorMsg.includes('Conversation is complete')) {
            return NextResponse.json({ error: errorMsg }, { status: 409 });
        }

        // Fallback
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
