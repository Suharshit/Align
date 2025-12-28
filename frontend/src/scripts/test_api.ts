
import { db } from '../lib/db';
import { users, studentProfiles, founderProfiles, type NewUser } from '../lib/schema';

const BASE_URL = 'http://localhost:3000';

async function setupTestData() {
    console.log('🌐 Running API Integration Test (real server)');

    console.log('🛠️  Setting up test data in DB...');

    // Create random users
    const studentEmail = `api_test_student_${Date.now()}@example.com`;
    const founderEmail = `api_test_founder_${Date.now()}@example.com`;

    const [sUser] = await db.insert(users).values({
        email: studentEmail,
        role: 'STUDENT',
        authProvider: 'test_script'
    }).returning();

    const [fUser] = await db.insert(users).values({
        email: founderEmail,
        role: 'FOUNDER',
        authProvider: 'test_script'
    }).returning();

    // Create Profiles
    const [sProfile] = await db.insert(studentProfiles).values({
        userId: sUser.id,
        displayName: 'API Test Student'
    }).returning();

    const [fProfile] = await db.insert(founderProfiles).values({
        userId: fUser.id,
        companyName: 'API Test Corp',
        stage: 'early'
    }).returning();

    console.log(`✅ Created Student: ${sProfile.id}`);
    console.log(`✅ Created Founder: ${fProfile.id}`);

    return { studentId: sProfile.id, founderId: fProfile.id };
}

async function runApiTest() {
    console.log('🚀 Starting API Integration Test...');

    try {
        // 1. Setup DB Data
        const { studentId, founderId } = await setupTestData();

        // 2. Create Conversation
        console.log('\n[POST] /api/conversations');
        const createRes = await fetch(`${BASE_URL}/api/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, founderId })
        });

        if (!createRes.ok) throw new Error(`Create Failed: ${createRes.status} ${await createRes.text()}`);
        const { conversationId } = await createRes.json();
        console.log(`✅ Conversation Created: ${conversationId}`);

        // 3. Get Conversation Details
        console.log(`\n[GET] /api/conversations/${conversationId}`);
        const getRes = await fetch(`${BASE_URL}/api/conversations/${conversationId}`);
        if (!getRes.ok) throw new Error(`Get Failed: ${getRes.status} ${await getRes.text()}`);
        const convoData = await getRes.json();
        console.log('✅ Got Conversation Data:', convoData);

        if (convoData.status !== 'PENDING') throw new Error('❌ Status should be PENDING');


        // 4. Get First Prompt
        console.log(`\n[GET] /api/conversations/${conversationId}/next-prompt`);
        const p1Res = await fetch(`${BASE_URL}/api/conversations/${conversationId}/next-prompt`);
        if (!p1Res.ok) throw new Error(`Get Prompt Failed: ${p1Res.status} ${await p1Res.text()}`);
        const p1Data = await p1Res.json();
        console.log('✅ Prompt 1:', p1Data.sequenceOrder);

        if (p1Data.sequenceOrder !== 'MOTIVATION_STUDENT') throw new Error('❌ Expected MOTIVATION_STUDENT');


        // 5. Submit Response (Student)
        console.log(`\n[POST] /api/conversations/${conversationId}/respond`);
        const respRes = await fetch(`${BASE_URL}/api/conversations/${conversationId}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                responderRole: 'STUDENT',
                responseText: 'I am motivated by learning!'
            })
        });
        if (!respRes.ok) throw new Error(`Respond Failed: ${respRes.status} ${await respRes.text()}`);
        const respData = await respRes.json();
        console.log('✅ Response Submitted:', respData);


        // 6. Get Next Prompt (Should be Founder)
        console.log(`\n[GET] /api/conversations/${conversationId}/next-prompt`);
        const p2Res = await fetch(`${BASE_URL}/api/conversations/${conversationId}/next-prompt`);
        const p2Data = await p2Res.json();
        console.log('✅ Prompt 2:', p2Data.sequenceOrder);

        if (p2Data.sequenceOrder !== 'MOTIVATION_FOUNDER') throw new Error('❌ Expected MOTIVATION_FOUNDER');

        console.log('\n✅✅✅ API Test Passed Successfully! ✅✅✅');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Test Failed:', error);
        process.exit(1);
    }
}

runApiTest();
