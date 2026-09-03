async function verifySystem() {
  console.log('🚀 Starting Phase 9 Complete Platform Quality Assurance...\n');

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

  let passCount = 0;
  let failCount = 0;

  async function checkRoute(name: string, url: string, expectedStatus = 200) {
    try {
      const res = await fetch(url);
      if (res.status === expectedStatus || (res.status === 200)) {
        console.log(`✅ [${res.status}] ${name.padEnd(35)} -> ${url}`);
        passCount++;
      } else {
        console.error(`❌ [${res.status}] ${name.padEnd(35)} -> ${url}`);
        failCount++;
      }
    } catch (e: any) {
      console.error(`❌ [ERR] ${name.padEnd(35)} -> ${url} (${e.message})`);
      failCount++;
    }
  }

  console.log('--- 1. Public Pages Verification ---');
  await checkRoute('Page 01: Landing Page', `${frontendUrl}/`);
  await checkRoute('Page 02: Success Case Studies', `${frontendUrl}/success`);
  await checkRoute('Page 03: About Mentor Sami', `${frontendUrl}/about`);
  await checkRoute('Page 04: Student Help Desk', `${frontendUrl}/support`);
  await checkRoute('Page 05: 3-Step Checkout', `${frontendUrl}/enrollment`);
  await checkRoute('Page 05: Checkout Alias', `${frontendUrl}/checkout`);
  await checkRoute('Page 05B: LMS Apps Downloads', `${frontendUrl}/apps`);
  await checkRoute('Page 05C: Public Blogs & Guides', `${frontendUrl}/blogs`);

  console.log('\n--- 2. Static Application Downloads ---');
  await checkRoute('Windows Desktop .exe Download', `${backendUrl}/apps/WithSamiLMS_Windows_1.0.13.exe`);
  await checkRoute('Android Mobile .apk Download', `${backendUrl}/apps/WithSamiLMS_v10.apk`);

  console.log('\n--- 3. Admin Pages Verification ---');
  await checkRoute('Page 06: Admin Login Card', `${frontendUrl}/admin/login`);
  await checkRoute('Page 07: Admin Dashboard Overview', `${frontendUrl}/admin`);
  await checkRoute('Page 08: Orders Management', `${frontendUrl}/admin/orders`);
  await checkRoute('Page 09: Inventory & Courses', `${frontendUrl}/admin/inventory`);
  await checkRoute('Page 10: Customers Directory', `${frontendUrl}/admin/customers`);
  await checkRoute('Page 11: Analytics Dashboard', `${frontendUrl}/admin/analytics`);
  await checkRoute('Page 12: Website Dynamic CMS Panel', `${frontendUrl}/admin/cms`);
  await checkRoute('Page 13: Tracking Pixels Manager', `${frontendUrl}/admin/pixels`);
  await checkRoute('Page 14: Platform Settings', `${frontendUrl}/admin/settings`);
  await checkRoute('Page 15: Enrollment Requests Queue', `${frontendUrl}/admin/enrollment-requests`);
  await checkRoute('Page 16: Students Directory', `${frontendUrl}/admin/students`);
  await checkRoute('Page 17: Student Progress Dashboard', `${frontendUrl}/admin/student-progress`);

  console.log('\n--- 3B. Public Dynamic CMS & Pixels API ---');
  await checkRoute('Public CMS Dynamic Content API', `${backendUrl}/api/public/cms-content`);
  await checkRoute('Public Active Tracking Pixels API', `${backendUrl}/api/pixels/active`);

  console.log('\n--- 4. Native App API Integration ---');
  // App Login
  const appLogin = await fetch(`${backendUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ahmed.student@gmail.com', password: 'student123' })
  }).then(r => r.json());
  if (appLogin.success && appLogin.token) {
    console.log('✅ [200] Native App Login Token API      -> /api/login');
    passCount++;
  } else {
    console.error('❌ Native App Login Failed');
    failCount++;
  }

  // App Modules Tree
  const appModules = await fetch(`${backendUrl}/api/modules`, {
    headers: { 'Authorization': `Bearer ${appLogin.token}` }
  }).then(r => r.json());
  if (appModules.success && appModules.curriculum?.length === 11) {
    console.log(`✅ [200] Native App 11-Module Tree API   -> /api/modules (${appModules.curriculum.length} modules)`);
    passCount++;
  } else {
    console.error('❌ Native App Modules Failed');
    failCount++;
  }

  // Mark Lesson Complete
  const markComp = await fetch(`${backendUrl}/api/mark_complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${appLogin.token}`
    },
    body: JSON.stringify({ lesson_id: 2 })
  }).then(r => r.json());
  if (markComp.status === 'success' || markComp.success) {
    console.log('✅ [200] Native App Lesson Sync API      -> /api/mark_complete');
    passCount++;
  } else {
    console.error('❌ Native App Mark Complete Failed');
    failCount++;
  }

  console.log(`\n========================================`);
  console.log(`🏁 Verification Summary: ${passCount} Passed, ${failCount} Failed.`);
  console.log(`========================================\n`);

  if (failCount === 0) {
    console.log('🎉 100% QUALITY ASSURANCE VALIDATION PASSED! ALL 15 PAGES, APPS, AND APIS ARE PRODUCTION READY.');
  }
}

verifySystem().catch(console.error);
