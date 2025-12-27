import { db } from '../lib/db';
import { prompts, type NewPrompt } from '../lib/schema';

// EDIT THIS ARRAY TO ADD YOUR PROMPTS
const promptsToSeed: NewPrompt[] = [
    // FOUNDATION - STUDENT

    {
        promptText: 'What have you been learning or building recently?',
        targetRole: 'STUDENT',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_STUDENT_1',
        isActive: true,
    },
    {
        promptText: 'What parts of tech do you feel most comfortable exploring right now?',
        targetRole: 'STUDENT',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_STUDENT_2',
        isActive: true,
    },
    {
        promptText: 'What kind of problems do you want to work on in the near future?',
        targetRole: 'STUDENT',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_STUDENT_3',
        isActive: true,
    },
    {
        promptText: 'What are you hoping to understand or improve next?',
        targetRole: 'STUDENT',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_STUDENT_4',
        isActive: true,
    },

    // FOUNDATION - FOUNDER

    {
        promptText: 'What is your team currently building?',
        targetRole: 'FOUNDER',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_FOUNDER_1',
        isActive: true,
    },
    {
        promptText: 'What problem do you need help with right now?',
        targetRole: 'FOUNDER',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_FOUNDER_2',
        isActive: true,
    },
    {
        promptText: 'What kind of engineer tends to grow well in your team?',
        targetRole: 'FOUNDER',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_FOUNDER_3',
        isActive: true,
    },
    {
        promptText: 'What does success look like in the next few months for this role?',
        targetRole: 'FOUNDER',
        category: 'FOUNDATION',
        sequenceOrder: 'FOUNDATION_FOUNDER_4',
        isActive: true,
    },

    // CONVERSATION — MOTIVATION

    {
        promptText: 'What about this team’s work feels interesting or relevant to you?',
        targetRole: 'STUDENT',
        category: 'CONVERSATION',
        sequenceOrder: 'MOTIVATION_STUDENT',
        isActive: true,
    },
    {
        promptText: 'What stood out to you in the student’s response?',
        targetRole: 'FOUNDER',
        category: 'CONVERSATION',
        sequenceOrder: 'MOTIVATION_FOUNDER',
        isActive: true,
    },

    // CONVERSATION — THINKING

    {
        promptText: 'At a high level, how would you start approaching this problem?',
        targetRole: 'STUDENT',
        category: 'CONVERSATION',
        sequenceOrder: 'THINKING_STUDENT',
        isActive: true,
    },
    {
        promptText: 'How does your team currently think about or approach this problem?',
        targetRole: 'FOUNDER',
        category: 'CONVERSATION',
        sequenceOrder: 'THINKING_FOUNDER',
        isActive: true,
    },

    // CONVERSATION — GROWTH

    {
        promptText: 'What would you hope to gain if this conversation continues?',
        targetRole: 'STUDENT',
        category: 'CONVERSATION',
        sequenceOrder: 'GROWTH_STUDENT',
        isActive: true,
    },
    {
        promptText: 'What would success look like for someone in this role after a few months?',
        targetRole: 'FOUNDER',
        category: 'CONVERSATION',
        sequenceOrder: 'GROWTH_FOUNDER',
        isActive: true,
    },

    // CLOSURE — SYSTEM

    {
        promptText: 'Does this conversation feel aligned enough to continue outside Align?',
        targetRole: 'STUDENT',
        category: 'CLOSURE',
        sequenceOrder: 'CLOSURE_STUDENT',
        isActive: true,
    },
    {
        promptText: 'Does this conversation feel aligned enough to continue outside Align?',
        targetRole: 'FOUNDER',
        category: 'CLOSURE',
        sequenceOrder: 'CLOSURE_FOUNDER',
        isActive: true,
    },
];

async function seed() {
    try {
        console.log('🌱 Starting seeding...');

        // Optional: Clear existing prompts before seeding to avoid duplicates
        // await db.delete(prompts); 

        if (promptsToSeed.length === 0) {
            console.log('No prompts to seed. Edit src/lib/seed.ts first!');
            process.exit(0);
        }

        const inserted = await db.insert(prompts).values(promptsToSeed).returning();

        console.log(`✅ Successfully seeded ${inserted.length} prompts!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
