import { eq, and, asc } from 'drizzle-orm';
import { db } from './db';
import {
    conversations,
    conversationResponses,
    prompts,
    type Prompt,
} from './schema';

/**
 * CSM: Conversation State Machine
 * Determines the next prompt based on the number of existing responses.
 * 
 * Flow:
 * 0 resp -> MOTIVATION_STUDENT
 * 1 resp -> MOTIVATION_FOUNDER
 * 2 resp -> THINKING_STUDENT
 * 3 resp -> THINKING_FOUNDER
 * 4 resp -> GROWTH_STUDENT
 * 5 resp -> GROWTH_FOUNDER
 * 6 resp -> CLOSURE_STUDENT
 * 7 resp -> CLOSURE_FOUNDER
 * 8+ resp -> null (End of conversation)
 */
export async function getNextPrompt(conversationId: string): Promise<Prompt | null> {
    // 1. Fetch the conversation to check status
    const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
    });

    if (!conversation) {
        throw new Error(`Conversation not found: ${conversationId}`);
    }

    // Rule: If conversation is CLOSED, return null immediately
    if (conversation.status === 'CLOSED') {
        return null;
    }

    // 2. Fetch all responses to determine current position in the flow
    const responses = await db.query.conversationResponses.findMany({
        where: eq(conversationResponses.conversationId, conversationId),
        orderBy: [asc(conversationResponses.createdAt)],
    });

    const responseCount = responses.length;

    // Rule: End of conversation flow
    if (responseCount >= 8) {
        return null;
    }

    // 3. Determine the next sequence order and expected stage
    let nextSequenceOrder: string;
    let expectedStage: 'MOTIVATION' | 'THINKING' | 'GROWTH' = 'MOTIVATION';

    switch (responseCount) {
        case 0:
            nextSequenceOrder = 'MOTIVATION_STUDENT';
            expectedStage = 'MOTIVATION';
            break;
        case 1:
            nextSequenceOrder = 'MOTIVATION_FOUNDER';
            expectedStage = 'MOTIVATION';
            break;
        case 2:
            nextSequenceOrder = 'THINKING_STUDENT';
            expectedStage = 'THINKING';
            break;
        case 3:
            nextSequenceOrder = 'THINKING_FOUNDER';
            expectedStage = 'THINKING';
            break;
        case 4:
            nextSequenceOrder = 'GROWTH_STUDENT';
            expectedStage = 'GROWTH';
            break;
        case 5:
            nextSequenceOrder = 'GROWTH_FOUNDER';
            expectedStage = 'GROWTH';
            break;
        case 6:
            nextSequenceOrder = 'CLOSURE_STUDENT';
            // NOTE: conversation_stage enum currently does not include 'CLOSURE'.
            // Until schema is updated, closure prompts reuse the last valid stage.
            expectedStage = 'GROWTH'; // Fallback as CLOSURE is not in schema enum
            break;
        case 7:
            nextSequenceOrder = 'CLOSURE_FOUNDER';
            expectedStage = 'GROWTH'; // Fallback
            break;
        default:
            // Should be handled by >= 8 check, but safe default
            return null;
    }

    // 4. Update conversation stage if needed
    // Only update if the stage is actually different and valid
    // Since we are falling back to GROWTH for 6-7, it will just stay at GROWTH.
    if (conversation.stage !== expectedStage) {
        await db.update(conversations)
            .set({ stage: expectedStage })
            .where(eq(conversations.id, conversationId));
    }

    // 5. Fetch the prompt
    // We need to find the prompt with the matching sequenceOrder and isActive = true
    const prompt = await db.query.prompts.findFirst({
        where: and(
            eq(prompts.sequenceOrder, nextSequenceOrder),
            eq(prompts.isActive, true)
        ),
    });

    if (!prompt) {
        // Requirement: If prompt is missing → throw or log a system error
        const errorMsg = `CRITICAL: System Prompt missing for order '${nextSequenceOrder}'`;
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    return prompt;
}

/**
 * Submit a response to the current prompt.
 * Validates role, checks existing status, and updates status if finishing.
 */
export async function submitResponse(input: {
    conversationId: string;
    responderRole: 'STUDENT' | 'FOUNDER';
    responseText: string;
}): Promise<void> {
    const { conversationId, responderRole, responseText } = input;

    // 1. Conversation Validation
    const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
    });

    if (!conversation) {
        throw new Error(`Conversation not found: ${conversationId}`);
    }

    if (conversation.status === 'CLOSED') {
        throw new Error('Conversation is already CLOSED.');
    }

    // 2. Determine Expected Prompt
    // logic: getNextPrompt checks existing responses.
    // If 0 responses -> Expects Prompt #0.
    const expectedPrompt = await getNextPrompt(conversationId);

    if (!expectedPrompt) {
        throw new Error('Conversation is complete. No further prompts available.');
    }

    // 3. Role Validation
    if (expectedPrompt.targetRole !== responderRole) {
        throw new Error(
            `Role mismatch. Expected ${expectedPrompt.targetRole}, but got ${responderRole}.`
        );
    }

    // 4. Check if the prompt has already been answered
    const existingResponse = await db.query.conversationResponses.findFirst({
        where: and(
            eq(conversationResponses.conversationId, conversationId),
            eq(conversationResponses.promptId, expectedPrompt.id)
        ),
    });

    if (existingResponse) {
        throw new Error('This prompt has already been answered.');
    }

    // 5. Insert Conversation Response
    await db.insert(conversationResponses).values({
        conversationId,
        promptId: expectedPrompt.id,
        responderRole,
        responseText,
        // createdAt defaults to now()
    });

    // 6. Conversation Status Update (Controlled)
    // If the *just answered* prompt was the final one (CLOSURE_FOUNDER), close the convo.
    if (expectedPrompt.sequenceOrder === 'CLOSURE_FOUNDER') {
        await db.update(conversations)
            .set({
                status: 'CLOSED',
                closedAt: new Date(),
            })
            .where(eq(conversations.id, conversationId));
    }
}
