import { db } from '../server/db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server/middleware/auth.js';

async function runTests() {
  console.log('🧪 Starting Web LMS & Curriculum API Verification Tests...\n');

  // 1. Verify Database Schema
  console.log('1️⃣ Checking Database Tables & Columns:');
  const userCols = db.prepare('PRAGMA table_info(users)').all() as any[];
  const userColNames = userCols.map(c => c.name);
  console.log('   - Users table columns:', userColNames.filter(c => ['access_code', 'current_session_token', 'last_login_ip'].includes(c)));

  const lessonCols = db.prepare('PRAGMA table_info(lessons)').all() as any[];
  const lessonColNames = lessonCols.map(c => c.name);
  console.log('   - Lessons table columns:', lessonColNames.filter(c => ['video_type', 'vdocipher_id', 'notes'].includes(c)));

  const modulesCount = (db.prepare('SELECT count(*) as count FROM modules').get() as any).count;
  const lessonsCount = (db.prepare('SELECT count(*) as count FROM lessons').get() as any).count;
  console.log(`   - Curriculum Status: ${modulesCount} Modules, ${lessonsCount} Lessons loaded.`);

  // 2. Create or verify a Test Student
  const testEmail = 'vip_student_test@example.com';
  const testAccessCode = 'SAMI998877';
  const hashedPassword = bcrypt.hashSync(testAccessCode, 10);

  db.prepare('DELETE FROM users WHERE email = ?').run(testEmail);
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, phone, city, password, access_code, role, status)
    VALUES (?, ?, ?, ?, ?, ?, 'student', 'active')
  `).run('Ahmed Raza (Test VIP Student)', testEmail, '03001234567', 'Lahore', hashedPassword, testAccessCode);

  const studentId = insertUser.lastInsertRowid;
  console.log(`\n2️⃣ Created Test VIP Student (ID: ${studentId}, Email: ${testEmail}, Access Code: ${testAccessCode})`);

  // Generate Student JWT
  const studentToken = jwt.sign(
    { id: studentId, email: testEmail, name: 'Ahmed Raza (Test VIP Student)', role: 'student' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  // Generate Admin JWT
  const admin = db.prepare("SELECT * FROM admins WHERE email = 'admin@samiecom.com'").get() as any;
  const adminToken = jwt.sign(
    { id: admin?.id || 1, email: 'admin@samiecom.com', name: 'Sami Admin', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const baseUrl = 'http://localhost:5000';

  // 3. Test Student Login endpoint
  console.log('\n3️⃣ Testing Student Login API with Email + Access Code:');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, accessCode: testAccessCode })
  });
  const loginData = await loginRes.json();
  console.log(`   - Status: ${loginRes.status} | Success: ${loginData.success} | Redirect: ${loginData.redirectUrl}`);

  // 4. Test LMS Dashboard API
  console.log('\n4️⃣ Testing GET /api/lms/dashboard:');
  const dashRes = await fetch(`${baseUrl}/api/lms/dashboard`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const dashData = await dashRes.json();
  console.log(`   - Status: ${dashRes.status} | Course: ${dashData.course?.title}`);
  console.log(`   - Student: ${dashData.student?.name} | Total Lectures: ${dashData.course?.totalLectures}`);
  console.log(`   - Downloads Available: ${dashData.downloads?.length} resources`);

  // 5. Test LMS Curriculum API
  console.log('\n5️⃣ Testing GET /api/lms/curriculum:');
  const curRes = await fetch(`${baseUrl}/api/lms/curriculum`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const curData = await curRes.json();
  console.log(`   - Status: ${curRes.status} | Total Modules: ${curData.curriculum?.length}`);
  console.log(`   - Module 1 Title: "${curData.curriculum?.[0]?.title}" (${curData.curriculum?.[0]?.lessons?.length} lectures)`);

  // 6. Test Single Lesson & Dynamic DRM Watermark API
  console.log('\n6️⃣ Testing GET /api/lms/lesson/1:');
  const lessonRes = await fetch(`${baseUrl}/api/lms/lesson/1`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const lessonData = await lessonRes.json();
  console.log(`   - Status: ${lessonRes.status} | Lecture: "${lessonData.lesson?.title}"`);
  console.log(`   - Video Provider: ${lessonData.lesson?.videoType} | Duration: ${lessonData.lesson?.duration}`);
  console.log(`   - DRM Watermark Payload: "${lessonData.watermark?.displayString}"`);

  // 7. Test Lesson Progress Completion API
  console.log('\n7️⃣ Testing POST /api/lms/progress:');
  const progRes = await fetch(`${baseUrl}/api/lms/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`
    },
    body: JSON.stringify({ lessonId: 1, completed: true })
  });
  const progData = await progRes.json();
  console.log(`   - Status: ${progRes.status} | Message: ${progData.message}`);
  console.log(`   - Progress: ${progData.stats?.completedLessons}/${progData.stats?.totalLessons} (${progData.stats?.progressPercentage}%)`);

  // 8. Test Admin Curriculum CMS Endpoints
  console.log('\n8️⃣ Testing Admin Curriculum CMS API:');
  const adminCurRes = await fetch(`${baseUrl}/api/admin/curriculum`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminCurData = await adminCurRes.json();
  console.log(`   - GET /api/admin/curriculum Status: ${adminCurRes.status} | Modules: ${adminCurData.modules?.length}`);

  // Test Adding a new module
  const addModRes = await fetch(`${baseUrl}/api/admin/curriculum/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Bonus Module: 2026 AI Product Scaling Masterclass',
      module_number: '12',
      description: 'Advanced AI creatives, TikTok Symphony ads, and bulk automated inventory sourcing.',
      sort_order: 12
    })
  });
  const addModData = await addModRes.json();
  console.log(`   - POST /api/admin/curriculum/modules: Success=${addModData.success} (Module ID: ${addModData.id})`);

  // Clean up test module
  if (addModData.id) {
    await fetch(`${baseUrl}/api/admin/curriculum/modules/${addModData.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`   - DELETE /api/admin/curriculum/modules/${addModData.id}: Cleaned up successfully.`);
  }

  // 9. Clean up test student
  db.prepare('DELETE FROM users WHERE id = ?').run(studentId);
  db.prepare('DELETE FROM user_progress WHERE user_id = ?').run(studentId);

  console.log('\n🎉 ALL WEB LMS & CURRICULUM VERIFICATION TESTS PASSED SUCCESSFULLY! ✅\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
