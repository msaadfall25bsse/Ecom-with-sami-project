import bcrypt from 'bcryptjs';
import { db } from '../server/db/index.js';

const email = 'admin@samiecom.com';
const newPassword = 'admin123';
const hashedPassword = bcrypt.hashSync(newPassword, 10);

const admin = db.prepare('SELECT * FROM admins LIMIT 1').get() as any;
if (admin) {
  db.prepare(`
    UPDATE admins 
    SET email = ?, password = ?, name = ? 
    WHERE id = ?
  `).run(email, hashedPassword, 'Sami Admin', admin.id);
  console.log('Admin credentials updated successfully:');
  console.log('ID:', admin.id);
  console.log('Email:', email);
  console.log('Password set to:', newPassword);
} else {
  db.prepare(`
    INSERT INTO admins (name, email, password, role)
    VALUES (?, ?, ?, 'admin')
  `).run('Sami Admin', email, hashedPassword);
  console.log('Admin created with email:', email, 'and password:', newPassword);
}

// Log audit action
db.prepare('INSERT INTO audit_logs (actor_email, action, details) VALUES (?, ?, ?)')
  .run(email, 'ADMIN_PASSWORD_RESET', 'Admin password reset to default admin123 by system repair script');

console.log('Verification:');
const checkAdmin = db.prepare('SELECT * FROM admins LIMIT 1').get() as any;
console.log('Admin in DB:', checkAdmin.email);
console.log('Password matches admin123:', bcrypt.compareSync('admin123', checkAdmin.password));
