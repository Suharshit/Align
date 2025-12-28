import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums

export const userRoleEnum = pgEnum('user_role', [
  'STUDENT',
  'FOUNDER',
]);

export const ownerTypeEnum = pgEnum('owner_role', [
  'STUDENT',
  'FOUNDER',
]);

export const conversationStatusEnum = pgEnum('conversation_status', [
  'PENDING',
  'ACTIVE',
  'CLOSED',
]);

export const conversationStageEnum = pgEnum('conversation_stage', [
  'MOTIVATION',
  'THINKING',
  'GROWTH',
]);

export const promptCategoryEnum = pgEnum('prompt_category', [
  'FOUNDATION',
  'CONVERSATION',
  'CLOSURE',
]);


// User

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').notNull(),
  authProvider: text('auth_provider').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Student Profile

export const studentProfiles = pgTable('student_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  displayName: text('display_name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Founder Profile

export const founderProfiles = pgTable('founder_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  companyName: text('company_name').notNull(),
  stage: text('stage'), // idea / early / scaling
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Identity Card

export const identityCards = pgTable('identity_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull(),
  ownerType: ownerTypeEnum('owner_type').notNull(),
  content: text('content').notNull(), // JSON later if needed
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Intent Card

export const intentCards = pgTable('intent_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull(),
  ownerType: ownerTypeEnum('owner_type').notNull(),

  // Student intent
  direction: text('direction'),
  growthGoals: text('growth_goals'),
  preferences: text('preferences'),

  // Founder intent
  problem: text('problem'),
  successDefinition: text('success_definition'),
  growthVsOutput: text('growth_vs_output'),

  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Prompt

export const prompts = pgTable('prompts', {
  id: uuid('id').defaultRandom().primaryKey(),
  promptText: text('prompt_text').notNull(),
  targetRole: userRoleEnum('target_role').notNull(),
  category: promptCategoryEnum('category').notNull(),
  sequenceOrder: text('sequence_order').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Conversation

export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => studentProfiles.id),
  founderId: uuid('founder_id')
    .notNull()
    .references(() => founderProfiles.id),

  status: conversationStatusEnum('status').default('PENDING').notNull(),
  stage: conversationStageEnum('stage'),

  startedAt: timestamp('started_at'),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Conversation Response

export const conversationResponses = pgTable('conversation_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversations.id),
  promptId: uuid('prompt_id')
    .notNull()
    .references(() => prompts.id),

  responderRole: userRoleEnum('responder_role').notNull(),
  responseText: text('response_text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type NewStudentProfile = typeof studentProfiles.$inferInsert;

export type FounderProfile = typeof founderProfiles.$inferSelect;
export type NewFounderProfile = typeof founderProfiles.$inferInsert;

export type IdentityCard = typeof identityCards.$inferSelect;
export type NewIdentityCard = typeof identityCards.$inferInsert;

export type IntentCard = typeof intentCards.$inferSelect;
export type NewIntentCard = typeof intentCards.$inferInsert;

export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type ConversationResponse = typeof conversationResponses.$inferSelect;
export type NewConversationResponse = typeof conversationResponses.$inferInsert;