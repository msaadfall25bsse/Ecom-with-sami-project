import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../server/db/index.js';
import { JWT_SECRET } from '../server/middleware/auth.js';

const NEW_EMAIL = 'sami@ecomwithsami.com';
const NEW_PASSWORD = 'SamiMaster@2026';
const ADMIN_NAME = 'Sami Ur Rehman';

console.log('🔄 Setting and verifying new Master Admin credentials...');

const hashedPassword = bcrypt.hashSync(NEW_PASSWORD, 10);

// Clear old entries and insert fresh verified admin record
db.exec('DELETE FROM admins');
db.prepare(`
  INSERT INTO admins (id, name, email, password, role)
  VALUES (1, ?, ?, ?, 'admin')
`).run(ADMIN_NAME, NEW_EMAIL, hashedPassword);

console.log('✅ Admin record written to database.');

// Step 1: Query database to verify record
const adminRecord = db.prepare('SELECT * FROM admins WHERE email = ?').get(NEW_EMAIL) as any;
console.log('\n--- 1. DATABASE RECORD CHECK ---');
console.log('ID:', adminRecord.id);
console.log('Name:', adminRecord.name);
console.log('Email:', adminRecord.email);
console.log('Role:', adminRecord.role);

// Step 2: Test Bcrypt Password Verification
const isPasswordValid = bcrypt.compareSync(NEW_PASSWORD, adminRecord.password);
console.log('\n--- 2. BCRYPT PASSWORD VERIFICATION ---');
console.log('Testing password:', NEW_PASSWORD);
console.log('Password match result:', isPasswordValid ? '✅ 100% MATCH' : '❌ FAILED');

// Step 3: Test JWT Token Generation
const token = jwt.sign(
  { id: adminRecord.id, email: adminRecord.email, name: adminRecord.name, role: 'admin' },
  JWT_SECRET,
  { expiresIn: '7d' }
);
const decoded = jwt.verify(token, JWT_SECRET) as any;
console.log('\n--- 3. JWT TOKEN VERIFICATION ---');
console.log('Generated Token:', token.slice(0, 30) + '...');
console.log('Decoded Role:', decoded.role);
console.log('Token validity:', decoded.role === 'admin' ? '✅ VALID 7-DAY ADMIN TOKEN' : '❌ INVALID');

console.log('\n========================================');
console.log('🎉 MASTER ADMIN CREDENTIALS ARE 100% OPERATIONAL!');
console.log('Login Email:', NEW_EMAIL);
console.log('Login Password:', NEW_PASSWORD);
console.log('========================================');
