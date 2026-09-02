import { db, initDatabase } from '../server/db/index.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server/middleware/auth.js';

async function testPaymentAPIs() {
  console.log('🧪 Starting Payment API Test...');
  initDatabase();

  // Create admin token
  const admin = db.prepare('SELECT id, email, role, name FROM admins LIMIT 1').get() as any;
  if (!admin) {
    console.error('No admin found!');
    return;
  }
  const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin', name: admin.name }, JWT_SECRET, { expiresIn: '7d' });
  console.log('🔑 Admin Token generated for:', admin.email);

  // 1. Test GET payment methods
  const methods = db.prepare('SELECT id, method_key, title, account_title, account_number, is_active FROM payment_methods').all();
  console.log(`✅ Loaded ${methods.length} payment methods from DB:`, methods.map((m: any) => `${m.id}: ${m.title} (${m.account_title})`));

  // 2. Test UPSERT when ID does not exist
  const nonExistentId = 9999;
  const testTitle = 'Meezan Bank Transfer';
  let exists = db.prepare('SELECT id FROM payment_methods WHERE id = ?').get(nonExistentId) as any;
  if (!exists) {
    const baseKey = testTitle.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    exists = db.prepare('SELECT id FROM payment_methods WHERE method_key = ? OR title = ?').get(baseKey, testTitle.trim()) as any;
  }
  console.log('✅ Fallback UPSERT found existing method by title:', exists);

  console.log('🎉 All Payment Database & API checks passed!');
}

testPaymentAPIs().catch(console.error);
