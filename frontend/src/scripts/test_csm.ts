import { db } from '../lib/db';
import {
    users,
    studentProfiles,
    founderProfiles,
    conversations,
    type NewUser
} from '../lib/schema';
import { getNextPrompt, submitResponse } from '../lib/csm';
import { eq } from 'drizzle-orm';

/**
 * Manual Integration Test for CSM Logic
 * 
 * Flow:
 * 1. Setup Data (Users, Profiles, Conversation)
 * 2. CSM Walkthrough (Step 0 to 7)
 * 3. Validate Closure
 * 4. Negative Testing
 */
async function runTest() {
    console.log('--- Starting CSM Integration Test ---');

    try {
        // --- Step 1: Setup Data ---
        console.log('\n[1] Setting up test data...');

        // Create test users
        const studentUser: NewUser = {
            email: `test_student_${Date.now()}@example.com`,
            role: 'STUDENT',
            authProvider: 'email',
        };
        const founderUser: NewUser = {
            email: `test_founder_${Date.now()}@example.com`,
            role: 'FOUNDER',
            authProvider: 'email',
        };

        const insertedStudent = await db.insert(users).values(studentUser).returning();
        const insertedFounder = await db.insert(users).values(founderUser).returning();

        const sUser = insertedStudent[0];
        const fUser = insertedFounder[0];

        // Create profiles
        const studentProfile = await db.insert(studentProfiles).values({
            userId: sUser.id,
            displayName: 'Test Student',
        }).returning();

        const founderProfile = await db.insert(founderProfiles).values({
            userId: fUser.id,
            companyName: 'Test Corp',
            stage: 'idea',
        }).returning();

        // Create Conversation
        const conversation = await db.insert(conversations).values({
            studentId: studentProfile[0].id,
            founderId: founderProfile[0].id,
            status: 'PENDING',
            stage: 'MOTIVATION',
        }).returning();

        const convoId = conversation[0].id;
        console.log(`✅ Created Conversation: ${convoId}`);


        // --- Step 2: CSM Walkthrough ---
        console.log('\n[2] Starting Conversation Walkthrough...');

        const steps = [
            { order: 'MOTIVATION_STUDENT', role: 'STUDENT' as const },
            { order: 'MOTIVATION_FOUNDER', role: 'FOUNDER' as const },
            { order: 'THINKING_STUDENT', role: 'STUDENT' as const },
            { order: 'THINKING_FOUNDER', role: 'FOUNDER' as const },
            { order: 'GROWTH_STUDENT', role: 'STUDENT' as const },
            { order: 'GROWTH_FOUNDER', role: 'FOUNDER' as const },
            { order: 'CLOSURE_STUDENT', role: 'STUDENT' as const },
            { order: 'CLOSURE_FOUNDER', role: 'FOUNDER' as const },
        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            console.log(`\n--- Step ${i}: Expecting ${step.order} ---`);

            // A. Get Next Prompt
            const prompt = await getNextPrompt(convoId);

            if (!prompt) {
                throw new Error(`❌ Step ${i}: Expected prompt but got null!`);
            }

            console.log(`Got Prompt: ${prompt.sequenceOrder} ("${prompt.promptText.substring(0, 30)}...")`);

            if (prompt.sequenceOrder !== step.order) {
                throw new Error(`❌ Sequence Mismatch! Expected ${step.order}, got ${prompt.sequenceOrder}`);
            }

            // --- Step 4: Negative Testing (Injecting in the middle) ---
            // Test Role Mismatch at Step 0
            if (i === 0) {
                console.log('[Test] Attempting Role Mismatch (Founder answering Student prompt)...');
                try {
                    await submitResponse({
                        conversationId: convoId,
                        responderRole: 'FOUNDER', // Wrong role
                        responseText: 'Should fail',
                    });
                    throw new Error('❌ Role validation FAILED! (Should have thrown error)');
                } catch (e: any) {
                    console.log(`✅ Role validation passed: Caught expected error -> ${e.message}`);
                }
            }

            // B. Submit Response
            console.log(`Submitting response as ${step.role}...`);
            await submitResponse({
                conversationId: convoId,
                responderRole: step.role,
                responseText: `Test response for ${step.order}`,
            });
            console.log('✅ Response submitted.');

            // Test Duplicate Submission
            if (i === 0) {
                console.log('[Test] Attempting Duplicate Submission...');
                try {
                    await submitResponse({
                        conversationId: convoId,
                        responderRole: step.role, // Correct role, but repeated
                        responseText: 'Duplicate answer',
                    });
                    throw new Error('❌ Duplicate check FAILED! (Should have thrown error)');
                } catch (e: any) {
                    console.log(`✅ Duplicate check passed: Caught expected error -> ${e.message}`);
                }
            }
        }


        // --- Step 3: Validate Closure ---
        console.log('\n[3] Validating Closure...');

        const finalConvo = await db.query.conversations.findFirst({
            where: eq(conversations.id, convoId),
        });

        if (finalConvo?.status !== 'CLOSED') {
            throw new Error(`❌ Conversation status is ${finalConvo?.status}, expected CLOSED`);
        }
        console.log('✅ Conversation Status is CLOSED.');

        const nextPrompt = await getNextPrompt(convoId);
        if (nextPrompt !== null) {
            throw new Error(`❌ Expected null prompt after closure, got ${nextPrompt.sequenceOrder}`);
        }
        console.log('✅ getNextPrompt returned null (correct).');

        console.log('\n✅✅✅ CSM Integration Test PASSED Successfully! ✅✅✅');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    }
}

runTest();
