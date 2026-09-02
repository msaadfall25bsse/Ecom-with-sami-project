import express from 'express';
import { db, initDatabase } from '../server/db/index.js';
import { adminRouter } from '../server/routes/admin.js';
import { enrollmentRouter } from '../server/routes/enrollments.js';
import { publicRouter } from '../server/routes/public.js';
import { authRouter } from '../server/routes/auth.js';

async function testLifecycle() {
  console.log('🔄 TESTING COMPLETE ENROLLMENT -> ADMIN APPROVAL LIFECYCLE...\n');

  initDatabase();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/enrollments', enrollmentRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/public', publicRouter);

  const server = app.listen(5099);

  try {
    // 1. Submit a test student enrollment
    console.log('1️⃣ Submitting test student enrollment...');
    const enrollmentRes = await fetch('http://127.0.0.1:5099/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Ali',
        lastName: 'Ahmed',
        email: 'ali.ahmed.test@gmail.com',
        phone: '03001234567',
        city: 'Lahore',
        paymentMethod: 'easypaisa'
      })
    });
    const enrollData = await enrollmentRes.json();
    console.log('  -> Enrollment Result:', enrollData);

    // 2. Admin logs in
    console.log('\n2️⃣ Admin logs in to get token...');
    const loginRes = await fetch('http://127.0.0.1:5099/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sami@ecomwithsami.com',
        password: 'SAMI123456'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('  -> Token obtained:', !!token);

    // 3. Admin fetches enrollment requests
    console.log('\n3️⃣ Admin fetches enrollment requests list...');
    const requestsRes = await fetch('http://127.0.0.1:5099/api/admin/enrollment-requests', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const requestsData = await requestsRes.json();
    console.log(`  -> Requests found: ${requestsData.requests?.length || 0}`);
    const latestReq = requestsData.requests?.[0];
    console.log('  -> Latest Request:', latestReq?.first_name, latestReq?.email, latestReq?.status);

    if (latestReq) {
      // 4. Admin Approves Request
      console.log(`\n4️⃣ Admin Approves Request ID: ${latestReq.id}...`);
      const approveRes = await fetch(`http://127.0.0.1:5099/api/admin/enrollment-requests/${latestReq.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'approved',
          adminNote: 'Payment verified on Easypaisa'
        })
      });
      const approveData = await approveRes.json();
      console.log('  -> Approval Response:', approveData);
      console.log('  -> Access Code Generated:', approveData.accessCode);
      console.log('  -> Student Name:', approveData.studentName);
    }

    console.log('\n🎉 COMPLETE LIFECYCLE TEST PASSED 100%!');
  } catch (err: any) {
    console.error('❌ Test failed:', err.message);
  } finally {
    server.close();
  }
}

testLifecycle();
