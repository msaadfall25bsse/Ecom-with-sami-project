import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sami_super_secret_jwt_key_2026_dropshipping';
const BASE_URL = 'http://localhost:5000';

async function runCmsTests() {
  console.log('🧪 Starting Full CMS REST API Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  const adminToken = jwt.sign(
    { id: 1, email: 'admin@samiecom.com', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };

  // Test 1: Public CMS Content API
  try {
    const res = await fetch(`${BASE_URL}/api/public/cms-content`);
    const data = await res.json();
    if (res.status === 200 && data.success && data.sections?.hero && Array.isArray(data.reviews)) {
      console.log('✅ 1. Public CMS Content API (GET /api/public/cms-content) -> PASS');
      passed++;
    } else {
      console.error('❌ 1. Public CMS Content API -> FAIL', data);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ 1. Public CMS Content API Exception:', e.message);
    failed++;
  }

  // Test 2: Admin List Sections
  try {
    const res = await fetch(`${BASE_URL}/api/admin/cms/sections`, { headers: authHeaders });
    const data = await res.json();
    if (res.status === 200 && data.success && data.sections.length >= 9) {
      console.log(`✅ 2. Admin List Sections (GET /api/admin/cms/sections) -> PASS (${data.sections.length} sections found)`);
      passed++;
    } else {
      console.error('❌ 2. Admin List Sections -> FAIL', data);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ 2. Admin List Sections Exception:', e.message);
    failed++;
  }

  // Test 3: Admin Update Section
  try {
    const heroRes = await fetch(`${BASE_URL}/api/admin/cms/sections/hero`, { headers: authHeaders });
    const heroData = await heroRes.json();
    const heroContent = heroData.section.content;
    
    // Update cta_text
    heroContent.cta_text = 'YES! I WANT TO LEARN THIS (TEST)';
    const updateRes = await fetch(`${BASE_URL}/api/admin/cms/sections/hero`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Hero Banner & Video Preview',
        content: heroContent,
        is_visible: 1
      })
    });
    const updateData = await updateRes.json();
    if (updateRes.status === 200 && updateData.success) {
      console.log('✅ 3. Admin Update Section (PUT /api/admin/cms/sections/hero) -> PASS');
      passed++;
    } else {
      console.error('❌ 3. Admin Update Section -> FAIL', updateData);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ 3. Admin Update Section Exception:', e.message);
    failed++;
  }

  // Test 4: Admin Toggle Section Visibility
  try {
    const toggleRes = await fetch(`${BASE_URL}/api/admin/cms/sections/marquee/toggle`, {
      method: 'PATCH',
      headers: authHeaders
    });
    const toggleData = await toggleRes.json();
    if (toggleRes.status === 200 && toggleData.success) {
      console.log(`✅ 4. Admin Toggle Section (PATCH /api/admin/cms/sections/marquee/toggle) -> PASS (${toggleData.message})`);
      // Toggle back to active
      await fetch(`${BASE_URL}/api/admin/cms/sections/marquee/toggle`, { method: 'PATCH', headers: authHeaders });
      passed++;
    } else {
      console.error('❌ 4. Admin Toggle Section -> FAIL', toggleData);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ 4. Admin Toggle Section Exception:', e.message);
    failed++;
  }

  // Test 5: Admin Reviews CRUD
  try {
    // Create
    const createRes = await fetch(`${BASE_URL}/api/admin/cms/reviews`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        student_name: 'Test Student QA',
        city: 'Karachi',
        market: 'UAE Market',
        sales_text: 'AED 3,000 in 2 Days',
        orders_text: '30 Orders',
        quote: 'Amazing practical course!',
        rating: 5
      })
    });
    const createData = await createRes.json();
    const reviewId = createData.reviewId;

    // Delete
    const deleteRes = await fetch(`${BASE_URL}/api/admin/cms/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const deleteData = await deleteRes.json();

    if (createRes.status === 201 && deleteRes.status === 200 && deleteData.success) {
      console.log('✅ 5. Admin Reviews CRUD (POST & DELETE /api/admin/cms/reviews) -> PASS');
      passed++;
    } else {
      console.error('❌ 5. Admin Reviews CRUD -> FAIL');
      failed++;
    }
  } catch (e: any) {
    console.error('❌ 5. Admin Reviews CRUD Exception:', e.message);
    failed++;
  }

  // Test 6: Admin Blogs CRUD
  try {
    // Create Blog
    const createBlogRes = await fetch(`${BASE_URL}/api/admin/cms/blogs`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Test Automated Announcement Article',
        excerpt: 'Test excerpt',
        content: 'This is a test blog post.',
        author: 'Mentor Sami'
      })
    });
    const createBlogData = await createBlogRes.json();
    const blogId = createBlogData.blogId;

    // Delete Blog
    const deleteBlogRes = await fetch(`${BASE_URL}/api/admin/cms/blogs/${blogId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const deleteBlogData = await deleteBlogRes.json();

    if (createBlogRes.status === 201 && deleteBlogRes.status === 200 && deleteBlogData.success) {
      console.log('✅ 6. Admin Blogs CRUD (POST & DELETE /api/admin/cms/blogs) -> PASS');
      passed++;
    } else {
      console.error('❌ 6. Admin Blogs CRUD -> FAIL');
      failed++;
    }
  } catch (e: any) {
    console.error('❌ 6. Admin Blogs CRUD Exception:', e.message);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`🏁 CMS API Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCmsTests();
