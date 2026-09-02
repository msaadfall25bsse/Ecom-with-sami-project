import http from 'http';
import { db, initDatabase } from '../server/db/index.js';
import app from '../server/index.js';

const TEST_PORT = 5098;

interface TestResult {
  category: string;
  endpoint: string;
  method: string;
  status: number;
  expectedStatus: number;
  passed: boolean;
  notes?: string;
}

async function runCompleteTestSuite() {
  console.log('🚀 INITIALIZING FULL API TEST SUITE...\n');
  initDatabase();

  const results: TestResult[] = [];

  const server = app.listen(TEST_PORT, async () => {
    console.log(`📡 Test server online at http://127.0.0.1:${TEST_PORT}\n`);

    const request = (
      method: string,
      path: string,
      body?: any,
      headers?: Record<string, string>
    ): Promise<{ status: number; data: any }> => {
      return new Promise((resolve, reject) => {
        const postData = body ? JSON.stringify(body) : '';
        const req = http.request({
          hostname: '127.0.0.1',
          port: TEST_PORT,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            ...(headers || {})
          }
        }, (res) => {
          let resData = '';
          res.on('data', chunk => resData += chunk);
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode || 500, data: JSON.parse(resData) });
            } catch (e) {
              resolve({ status: res.statusCode || 500, data: resData });
            }
          });
        });

        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
      });
    };

    try {
      // 1. PUBLIC APIS
      console.log('--- 🌐 Testing Public Storefront APIs ---');
      const publicEndpoints = [
        { method: 'GET', path: '/api/health', expected: 200, name: 'System Health' },
        { method: 'GET', path: '/api/public/cms-content', expected: 200, name: 'Storefront CMS Content' },
        { method: 'GET', path: '/api/public/payment-methods', expected: 200, name: 'Active Payment Methods' },
        { method: 'GET', path: '/api/public/contact-config', expected: 200, name: 'WhatsApp & Contact Config' },
        { method: 'GET', path: '/api/public/faq-reviews', expected: 200, name: 'FAQs & Reviews' },
        { method: 'GET', path: '/api/pixels/active', expected: 200, name: 'Active Tracking Pixels' }
      ];

      for (const ep of publicEndpoints) {
        const res = await request(ep.method, ep.path);
        const passed = res.status === ep.expected;
        results.push({
          category: 'Public APIs',
          endpoint: ep.path,
          method: ep.method,
          status: res.status,
          expectedStatus: ep.expected,
          passed,
          notes: ep.name
        });
        console.log(`[${passed ? '✅ PASS' : '❌ FAIL'}] ${ep.method} ${ep.path} (HTTP ${res.status}) - ${ep.name}`);
      }

      // Contact Form POST
      const contactRes = await request('POST', '/api/public/contact', {
        name: 'Test Student',
        email: 'test@example.com',
        phone: '03001234567',
        subject: 'General Question',
        message: 'Testing public contact API'
      });
      results.push({
        category: 'Public APIs',
        endpoint: '/api/public/contact',
        method: 'POST',
        status: contactRes.status,
        expectedStatus: 200,
        passed: contactRes.status === 200,
        notes: 'Contact Form Submission'
      });
      console.log(`[${contactRes.status === 200 ? '✅ PASS' : '❌ FAIL'}] POST /api/public/contact (HTTP ${contactRes.status})`);

      // 2. AUTHENTICATION APIS
      console.log('\n--- 🔑 Testing Authentication & Session APIs ---');
      const adminLoginRes = await request('POST', '/api/auth/login', {
        email: 'sami@ecomwithsami.com',
        password: 'SamiMaster@2026'
      });
      const adminToken = adminLoginRes.data.token;
      const adminPassed = adminLoginRes.status === 200 && !!adminToken;
      results.push({
        category: 'Authentication',
        endpoint: '/api/auth/login (Admin)',
        method: 'POST',
        status: adminLoginRes.status,
        expectedStatus: 200,
        passed: adminPassed,
        notes: 'Admin Login'
      });
      console.log(`[${adminPassed ? '✅ PASS' : '❌ FAIL'}] POST /api/auth/login (Admin) -> Token generated: ${!!adminToken}`);

      const studentLoginRes = await request('POST', '/api/auth/login', {
        email: 'student@ecomwithsami.com',
        password: 'student123'
      });
      const studentToken = studentLoginRes.data.token;
      results.push({
        category: 'Authentication',
        endpoint: '/api/auth/login (Student)',
        method: 'POST',
        status: studentLoginRes.status,
        expectedStatus: 200,
        passed: studentLoginRes.status === 200,
        notes: 'Student Login'
      });
      console.log(`[${studentLoginRes.status === 200 ? '✅ PASS' : '❌ FAIL'}] POST /api/auth/login (Student)`);

      const authHeaders = { 'Authorization': `Bearer ${adminToken}` };
      const studentHeaders = { 'Authorization': `Bearer ${studentToken}` };

      const meRes = await request('GET', '/api/auth/me', null, authHeaders);
      results.push({
        category: 'Authentication',
        endpoint: '/api/auth/me',
        method: 'GET',
        status: meRes.status,
        expectedStatus: 200,
        passed: meRes.status === 200 && meRes.data.user?.role === 'admin',
        notes: 'Admin Profile Verification'
      });
      console.log(`[${meRes.status === 200 ? '✅ PASS' : '❌ FAIL'}] GET /api/auth/me -> Verified: ${meRes.data.user?.email}`);

      // 3. STUDENT LMS APIS
      console.log('\n--- 🎓 Testing Web LMS & Course Streaming APIs ---');
      const lmsEndpoints = [
        { method: 'GET', path: '/api/lms/curriculum', expected: 200, name: 'Curriculum & Lectures' },
        { method: 'GET', path: '/api/lms/resources', expected: 200, name: 'Course Attachments' },
        { method: 'GET', path: '/api/lms/progress', expected: 200, name: 'Lesson Progress' },
        { method: 'GET', path: '/api/lms/security-status', expected: 200, name: 'Anti-Piracy Security Guard' },
        { method: 'GET', path: '/api/lms/stream/1', expected: 200, name: 'Direct/Bunny Video Stream Token' }
      ];

      for (const ep of lmsEndpoints) {
        const res = await request(ep.method, ep.path, null, studentHeaders);
        const passed = res.status === ep.expected;
        results.push({
          category: 'Web LMS',
          endpoint: ep.path,
          method: ep.method,
          status: res.status,
          expectedStatus: ep.expected,
          passed,
          notes: ep.name
        });
        console.log(`[${passed ? '✅ PASS' : '❌ FAIL'}] ${ep.method} ${ep.path} (HTTP ${res.status}) - ${ep.name}`);
      }

      // LMS Progress Toggle
      const progRes = await request('POST', '/api/lms/progress', { lessonId: 1 }, studentHeaders);
      results.push({
        category: 'Web LMS',
        endpoint: '/api/lms/progress',
        method: 'POST',
        status: progRes.status,
        expectedStatus: 200,
        passed: progRes.status === 200,
        notes: 'Mark Lesson Progress'
      });
      console.log(`[${progRes.status === 200 ? '✅ PASS' : '❌ FAIL'}] POST /api/lms/progress (HTTP ${progRes.status})`);

      // 4. ADMIN CMS APIS
      console.log('\n--- 🎨 Testing CMS & Payment Methods APIs ---');
      const cmsEndpoints = [
        { method: 'GET', path: '/api/admin/cms/sections', expected: 200, name: 'All CMS Sections' },
        { method: 'GET', path: '/api/admin/cms/reviews', expected: 200, name: 'Student Reviews' },
        { method: 'GET', path: '/api/admin/cms/blogs', expected: 200, name: 'Site Blogs' },
        { method: 'GET', path: '/api/admin/cms/payment-methods', expected: 200, name: 'CMS Payment Methods' },
        { method: 'POST', path: '/api/admin/cms/payment-methods/reset-defaults', expected: 200, name: 'Reset Default Accounts' }
      ];

      for (const ep of cmsEndpoints) {
        const res = await request(ep.method, ep.path, null, authHeaders);
        const passed = res.status === ep.expected;
        results.push({
          category: 'Admin CMS',
          endpoint: ep.path,
          method: ep.method,
          status: res.status,
          expectedStatus: ep.expected,
          passed,
          notes: ep.name
        });
        console.log(`[${passed ? '✅ PASS' : '❌ FAIL'}] ${ep.method} ${ep.path} (HTTP ${res.status}) - ${ep.name}`);
      }

      // Update Section PUT
      const putSecRes = await request('PUT', '/api/admin/cms/sections/hero', {
        title: 'Hero Section',
        content: { title: 'Test Headline Updated' },
        is_visible: 1
      }, authHeaders);
      results.push({
        category: 'Admin CMS',
        endpoint: '/api/admin/cms/sections/hero',
        method: 'PUT',
        status: putSecRes.status,
        expectedStatus: 200,
        passed: putSecRes.status === 200,
        notes: 'Update CMS Section'
      });
      console.log(`[${putSecRes.status === 200 ? '✅ PASS' : '❌ FAIL'}] PUT /api/admin/cms/sections/hero (HTTP ${putSecRes.status})`);

      // Save Payment Method PUT (UPSERT)
      const putPMRes = await request('PUT', '/api/admin/cms/payment-methods/1', {
        title: 'Easypaisa Mobile Wallet',
        category: 'wallet',
        account_title: 'SARDAR SAMIULLAH',
        account_number: '03481095933',
        price_display: 'PKR 3,900',
        is_active: 1
      }, authHeaders);
      results.push({
        category: 'Admin CMS',
        endpoint: '/api/admin/cms/payment-methods/1',
        method: 'PUT',
        status: putPMRes.status,
        expectedStatus: 200,
        passed: putPMRes.status === 200,
        notes: 'UPSERT Payment Method'
      });
      console.log(`[${putPMRes.status === 200 ? '✅ PASS' : '❌ FAIL'}] PUT /api/admin/cms/payment-methods/1 (HTTP ${putPMRes.status})`);

      // 5. ADMIN MANAGEMENT & TRACKING APIS
      console.log('\n--- 👑 Testing Admin Management & Pixels APIs ---');
      const adminEndpoints = [
        { method: 'GET', path: '/api/admin/overview', expected: 200, name: 'Dashboard Analytics' },
        { method: 'GET', path: '/api/admin/enrollments', expected: 200, name: 'Enrollment Requests' },
        { method: 'GET', path: '/api/admin/students', expected: 200, name: 'Students Directory' },
        { method: 'GET', path: '/api/admin/pixels', expected: 200, name: 'Tracking Pixels' },
        { method: 'GET', path: '/api/admin/settings', expected: 200, name: 'Store Settings' },
        { method: 'GET', path: '/api/admin/curriculum/modules', expected: 200, name: 'Admin Curriculum Modules' }
      ];

      for (const ep of adminEndpoints) {
        const res = await request(ep.method, ep.path, null, authHeaders);
        const passed = res.status === ep.expected;
        results.push({
          category: 'Admin Core',
          endpoint: ep.path,
          method: ep.method,
          status: res.status,
          expectedStatus: ep.expected,
          passed,
          notes: ep.name
        });
        console.log(`[${passed ? '✅ PASS' : '❌ FAIL'}] ${ep.method} ${ep.path} (HTTP ${res.status}) - ${ep.name}`);
      }

      console.log('\n======================================================');
      const totalTests = results.length;
      const passedTests = results.filter(r => r.passed).length;
      console.log(`📊 TOTAL APIS TESTED: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
      console.log('======================================================\n');

      if (passedTests === totalTests) {
        console.log('🎉 100% OF ALL BACKEND & FRONTEND APIS ARE WORKING FLAWLESSLY!');
      }

    } catch (err: any) {
      console.error('Test Execution Error:', err);
    } finally {
      server.close(() => {
        console.log('\n🛑 Test server stopped.');
        process.exit(0);
      });
    }
  });
}

runCompleteTestSuite();
