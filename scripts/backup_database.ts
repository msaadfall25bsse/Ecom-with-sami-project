import fs from 'fs';
import path from 'path';
import { db } from '../server/db/index.js';

async function backupDatabase() {
  console.log('📦 Starting SAMI Database Backup Routine...\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 1. SQLite File Snapshot
  const sourceDb = path.resolve(process.cwd(), 'sami_database.sqlite');
  const targetDb = path.join(backupDir, `sami_database_backup_${timestamp}.sqlite`);
  
  if (fs.existsSync(sourceDb)) {
    fs.copyFileSync(sourceDb, targetDb);
    console.log(`✅ SQLite Snapshot created: ${targetDb}`);
  }

  // 2. Export Orders CSV
  const orders = db.prepare('SELECT * FROM orders').all() as any[];
  const orderHeaders = 'id,order_number,customer_name,customer_email,customer_phone,amount,currency,payment_method,status,created_at\n';
  const orderRows = orders.map(o => `"${o.id}","${o.order_number}","${o.customer_name}","${o.customer_email}","${o.customer_phone || ''}","${o.amount}","${o.currency}","${o.payment_method}","${o.status}","${o.created_at}"`).join('\n');
  const ordersCsvPath = path.join(backupDir, `orders_export_${timestamp}.csv`);
  fs.writeFileSync(ordersCsvPath, orderHeaders + orderRows);
  console.log(`✅ Orders Export CSV (${orders.length} records): ${ordersCsvPath}`);

  // 3. Export Students CSV
  const students = db.prepare("SELECT id, name, email, phone, city, status, created_at, last_active_at FROM users WHERE role = 'student'").all() as any[];
  const studentHeaders = 'id,name,email,phone,city,status,created_at,last_active_at\n';
  const studentRows = students.map(s => `"${s.id}","${s.name}","${s.email}","${s.phone || ''}","${s.city || ''}","${s.status}","${s.created_at}","${s.last_active_at || ''}"`).join('\n');
  const studentsCsvPath = path.join(backupDir, `students_export_${timestamp}.csv`);
  fs.writeFileSync(studentsCsvPath, studentHeaders + studentRows);
  console.log(`✅ Students Export CSV (${students.length} records): ${studentsCsvPath}`);

  console.log('\n🎉 BACKUP COMPLETED SUCCESSFULLY!');
}

backupDatabase().catch(console.error);
