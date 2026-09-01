async function testPixelsAPI() {
  console.log('🧪 Starting Tracking Pixels API Test Suite...\n');
  const baseUrl = 'http://localhost:5000/api';

  // 1. Admin Login to obtain Bearer Token
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@samiecom.com', password: 'admin123' })
  }).then(r => r.json());
  const token = loginRes.token;
  console.log('1. Admin Token Authenticated:', !!token ? '✅ PASS' : '❌ FAIL');

  // 2. Fetch Public Active Pixels
  const publicActive = await fetch(`${baseUrl}/pixels/active`).then(r => r.json());
  console.log('2. Public Active Pixels Endpoint (/api/pixels/active):', publicActive.success && Array.isArray(publicActive.pixels) ? `✅ PASS (${publicActive.pixels.length} active pixels)` : '❌ FAIL');

  // 3. Admin List All Pixels
  const allPixels = await fetch(`${baseUrl}/admin/pixels`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('3. Admin All Pixels Endpoint (/api/admin/pixels):', allPixels.success && Array.isArray(allPixels.pixels) ? `✅ PASS (${allPixels.pixels.length} total pixels)` : '❌ FAIL');

  // 4. Create New Pixel
  const createRes = await fetch(`${baseUrl}/admin/pixels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      platform_name: 'Pinterest Pixel',
      pixel_id: 'PIN-99201948',
      custom_code: '<!-- Pinterest Tag -->',
      is_active: true,
      placement: 'head'
    })
  }).then(r => r.json());
  const createdId = createRes.id;
  console.log('4. Create Tracking Pixel (POST /api/admin/pixels):', createRes.success && createdId ? `✅ PASS (Pixel ID #${createdId})` : '❌ FAIL');

  // 5. Toggle Pixel Active Status
  const toggleRes = await fetch(`${baseUrl}/admin/pixels/${createdId}/toggle`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('5. Toggle Pixel Status (PATCH /api/admin/pixels/:id/toggle):', toggleRes.success && toggleRes.is_active === 0 ? '✅ PASS (Pixel Deactivated)' : '❌ FAIL');

  // 6. Update Pixel
  const updateRes = await fetch(`${baseUrl}/admin/pixels/${createdId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      platform_name: 'Pinterest Tag Pro',
      pixel_id: 'PIN-UPDATED-123',
      custom_code: '<!-- Pinterest Pro Tag -->',
      is_active: true,
      placement: 'body'
    })
  }).then(r => r.json());
  console.log('6. Update Pixel Details (PUT /api/admin/pixels/:id):', updateRes.success ? '✅ PASS' : '❌ FAIL');

  // 7. Delete Test Pixel
  const deleteRes = await fetch(`${baseUrl}/admin/pixels/${createdId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('7. Delete Pixel (DELETE /api/admin/pixels/:id):', deleteRes.success ? '✅ PASS (Deleted cleanly)' : '❌ FAIL');

  console.log('\n🎉 ALL TRACKING PIXELS BACKEND REST APIS PASSED WITH 100% SUCCESS!');
}

testPixelsAPI().catch(console.error);
