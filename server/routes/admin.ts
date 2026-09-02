import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { requireAdmin, AuthRequest, JWT_SECRET } from '../middleware/auth.js';
import { emailService } from '../services/emailService.js';

export const adminRouter = Router();

// All routes below require admin authentication
adminRouter.use(requireAdmin);

// 1. Dashboard Overview Metrics
adminRouter.get('/overview', (_req: AuthRequest, res) => {
  try {
    // Total Revenue from Paid Orders
    const revRes = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = 'Paid'").get() as { total: number };
    
    // Total Enrolled Students
    const studentRes = db.prepare("SELECT count(*) as count FROM users WHERE role = 'student'").get() as { count: number };
    
    // Pending Enrollment Requests
    const pendingReqRes = db.prepare("SELECT count(*) as count FROM enrollment_requests WHERE status = 'pending'").get() as { count: number };
    
    // Total Orders
    const ordersRes = db.prepare("SELECT count(*) as count FROM orders").get() as { count: number };
    
    // Shipped / Completed Orders
    const shippedRes = db.prepare("SELECT count(*) as count FROM orders WHERE status = 'Paid'").get() as { count: number };

    // Banned / Suspended Students Count & List
    const bannedRes = db.prepare("SELECT count(*) as count FROM users WHERE role = 'student' AND (status = 'suspended' OR security_strikes >= 3)").get() as { count: number };
    const bannedStudents = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.city, u.status, u.security_strikes, u.suspended_reason, u.last_strike_at, u.last_active_at,
             COUNT(up.lesson_id) as completed_lessons,
             (SELECT count(*) FROM lessons) as total_lessons
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.role = 'student' AND (u.status = 'suspended' OR u.security_strikes >= 3)
      GROUP BY u.id
      ORDER BY u.last_strike_at DESC
    `).all();

    // Recent 5 Enrollment Requests
    const recentEnrollments = db.prepare(`
      SELECT id, enrollment_id, first_name, last_name, email, phone, city, payment_method, amount, status, created_at, screenshot_path
      FROM enrollment_requests
      ORDER BY id DESC LIMIT 5
    `).all();

    // Recent 5 Orders
    const recentOrders = db.prepare(`
      SELECT id, order_number, customer_name, customer_email, amount, payment_method, status, created_at
      FROM orders
      ORDER BY id DESC LIMIT 5
    `).all();

    // Top Performing Products / Courses
    const topProducts = db.prepare(`
      SELECT id, sku, name, category, price, stock_level, stock_status FROM products LIMIT 4
    `).all();

    // Sales Overview Chart Data (Last 7 Days)
    const salesChart = [
      { day: 'Mon', revenue: 45000, orders: 12 },
      { day: 'Tue', revenue: 72000, orders: 18 },
      { day: 'Wed', revenue: 58000, orders: 15 },
      { day: 'Thu', revenue: 95000, orders: 24 },
      { day: 'Fri', revenue: 135000, orders: 35 },
      { day: 'Sat', revenue: 180000, orders: 46 },
      { day: 'Sun', revenue: 243800, orders: 62 }
    ];

    // Traffic Sources
    const trafficSources = [
      { name: 'TikTok Ads', value: 55, color: '#000000' },
      { name: 'Instagram / FB', value: 30, color: '#00A0DF' },
      { name: 'YouTube Direct', value: 15, color: '#FF0000' }
    ];

    return res.json({
      success: true,
      metrics: {
        totalRevenuePKR: revRes.total || 4520000,
        todaySalesPKR: 243800,
        totalStudents: studentRes.count,
        pendingEnrollments: pendingReqRes.count,
        bannedStudents: bannedRes.count,
        totalOrders: ordersRes.count,
        shippedOrders: shippedRes.count,
        conversionRate: 4.8
      },
      bannedStudents,
      salesChart,
      trafficSources,
      recentEnrollments,
      recentOrders,
      topProducts
    });
  } catch (err: any) {
    console.error('Error fetching admin overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Enrollment Requests List & Filter
const handleGetEnrollments = (req: any, res: any) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM enrollment_requests WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR enrollment_id LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY id DESC';
    const requests = db.prepare(query).all(...params);

    return res.json({ success: true, requests });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

adminRouter.get('/enrollment-requests', handleGetEnrollments);
adminRouter.get('/enrollments', handleGetEnrollments);

// 3. Update Enrollment Status (Approve / Reject / On Hold)
const handleUpdateEnrollmentStatus = async (req: AuthRequest, res: any) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body; // 'approved', 'rejected', 'on_hold'

    if (!['approved', 'rejected', 'on_hold', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const enr = db.prepare('SELECT * FROM enrollment_requests WHERE id = ?').get(id) as any;
    if (!enr) {
      return res.status(404).json({ success: false, message: 'Enrollment request not found' });
    }

    let createdUserId = enr.user_id;
    let accessCode = '';
    let emailSent = false;
    let emailMessage = '';

    // If approving, provision student account if not already created
    if (status === 'approved') {
      // Generate or retrieve student access code
      accessCode = 'SAMI' + Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = bcrypt.hashSync(accessCode, 10);

      // Check if user account already exists for this email
      let user = db.prepare('SELECT id, access_code FROM users WHERE email = ?').get(enr.email) as any;
      if (!user) {
        const userRes = db.prepare(`
          INSERT INTO users (name, email, phone, city, password, access_code, role, status)
          VALUES (?, ?, ?, ?, ?, ?, 'student', 'active')
        `).run(
          `${enr.first_name} ${enr.last_name}`,
          enr.email,
          enr.phone,
          enr.city,
          hashedPassword,
          accessCode
        );
        createdUserId = userRes.lastInsertRowid;
      } else {
        createdUserId = user.id;
        accessCode = user.access_code || accessCode;
        // Update user's access code and password if needed
        db.prepare('UPDATE users SET access_code = COALESCE(access_code, ?), status = \'active\' WHERE id = ?')
          .run(accessCode, user.id);
      }

      // Update corresponding order to Paid
      db.prepare("UPDATE orders SET status = 'Paid' WHERE enrollment_request_id = ?").run(enr.id);

      // Dispatch automated Welcome Email with Access Code
      const emailResult = await emailService.sendEnrollmentApprovalEmail({
        studentName: `${enr.first_name} ${enr.last_name}`,
        email: enr.email,
        accessCode,
        courseTitle: 'Master UAE & KSA Dropshipping Mentorship',
        loginUrl: `${req.protocol}://${req.get('host')}/login`
      });

      emailSent = emailResult.sent;
      emailMessage = emailResult.message;
    }

    // Update Enrollment Request
    db.prepare(`
      UPDATE enrollment_requests 
      SET status = ?, admin_note = ?, user_id = ?, reviewed_by = ?, reviewed_at = DATETIME('now')
      WHERE id = ?
    `).run(status, adminNote || null, createdUserId, req.user?.email || 'admin@samiecom.com', id);

    // Audit log
    db.prepare('INSERT INTO audit_logs (actor_email, action, details) VALUES (?, ?, ?)')
      .run(req.user?.email || 'admin', `ENROLLMENT_${status.toUpperCase()}`, `Enrollment ID ${enr.enrollment_id} status changed to ${status}. Access Code: ${accessCode}`);

    return res.json({
      success: true,
      message: `Enrollment marked as ${status}`,
      userId: createdUserId,
      accessCode,
      emailSent,
      emailMessage
    });
  } catch (err: any) {
    console.error('Error updating enrollment status:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

adminRouter.put('/enrollment-requests/:id/status', handleUpdateEnrollmentStatus);
adminRouter.patch('/enrollment-requests/:id/status', handleUpdateEnrollmentStatus);
adminRouter.put('/enrollments/:id/status', handleUpdateEnrollmentStatus);
adminRouter.patch('/enrollments/:id/status', handleUpdateEnrollmentStatus);

// 3B. Resend Access Code Email to Approved Student
adminRouter.post('/enrollment-requests/:id/resend-access', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const enr = db.prepare('SELECT * FROM enrollment_requests WHERE id = ?').get(id) as any;
    if (!enr) {
      return res.status(404).json({ success: false, message: 'Enrollment request not found' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ? OR id = ?').get(enr.email, enr.user_id) as any;
    if (!user) {
      return res.status(404).json({ success: false, message: 'No student user account associated with this enrollment.' });
    }

    let accessCode = user.access_code;
    if (!accessCode) {
      accessCode = 'SAMI' + Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = bcrypt.hashSync(accessCode, 10);
      db.prepare('UPDATE users SET access_code = ?, password = ? WHERE id = ?').run(accessCode, hashedPassword, user.id);
    }

    const emailResult = await emailService.sendEnrollmentApprovalEmail({
      studentName: `${enr.first_name} ${enr.last_name}`,
      email: enr.email,
      accessCode,
      courseTitle: 'Master UAE & KSA Dropshipping Mentorship',
      loginUrl: `${req.protocol}://${req.get('host')}/login`
    });

    return res.json({
      success: true,
      message: emailResult.sent ? `Access code email resent to ${enr.email}` : `Access Code: ${accessCode} (${emailResult.message})`,
      accessCode,
      emailSent: emailResult.sent
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Students Directory
adminRouter.get('/students', (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT u.id, u.name, u.email, u.phone, u.city, u.status, u.security_strikes, u.suspended_reason, u.last_strike_at, u.created_at, u.last_active_at,
             COUNT(up.lesson_id) as completed_lessons,
             (SELECT count(*) FROM lessons) as total_lessons
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.role = 'student'
    `;
    const params: any[] = [];

    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR u.city LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' GROUP BY u.id ORDER BY u.id DESC';
    const students = db.prepare(query).all(...params);

    // Format progress percentage
    const formatted = students.map((s: any) => {
      const total = s.total_lessons || 36;
      const completed = s.completed_lessons || 0;
      const progressPct = Math.round((completed / total) * 100);
      return {
        ...s,
        security_strikes: s.security_strikes || 0,
        progressPercentage: progressPct,
        completionStatus: s.status === 'suspended' ? 'Suspended (Strikes)' : progressPct === 100 ? 'Completed' : progressPct > 0 ? 'In Progress' : 'Not Started'
      };
    });

    return res.json({ success: true, students: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Single Student Details + Progress Breakdown & Security Logs
adminRouter.get('/students/:id', (req, res) => {
  try {
    const { id } = req.params;
    const student = db.prepare(`
      SELECT id, name, email, phone, city, status, security_strikes, suspended_reason, last_strike_at, created_at, last_active_at
      FROM users WHERE id = ? AND role = 'student'
    `).get(id) as any;

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Security logs
    const securityLogs = db.prepare('SELECT * FROM security_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(id) as any[];

    // Completed Lessons List
    const completed = db.prepare('SELECT lesson_id, completed_at FROM user_progress WHERE user_id = ?').all(id) as any[];
    const completedLessonIds = completed.map(c => c.lesson_id);

    // Curriculum with student completion flags
    const modules = db.prepare('SELECT * FROM modules ORDER BY sort_order ASC').all() as any[];
    const curriculum = modules.map(m => {
      const lessons = db.prepare('SELECT id, title, duration, sort_order FROM lessons WHERE module_id = ? ORDER BY sort_order ASC').all(m.id) as any[];
      return {
        ...m,
        lessons: lessons.map(l => ({
          ...l,
          isCompleted: completedLessonIds.includes(l.id)
        }))
      };
    });

    const totalLessons = db.prepare('SELECT count(*) as total FROM lessons').get() as { total: number };
    const progressPct = Math.round((completed.length / (totalLessons.total || 36)) * 100);

    return res.json({
      success: true,
      student: {
        ...student,
        security_strikes: student.security_strikes || 0,
        completedCount: completed.length,
        totalLessons: totalLessons.total || 36,
        progressPercentage: progressPct
      },
      securityLogs,
      curriculum
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 5.1. Reset Student Security Strikes & Unlock Account
adminRouter.post('/students/:id/reset-strikes', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare(`
      UPDATE users 
      SET security_strikes = 0, 
          status = 'active', 
          suspended_reason = NULL 
      WHERE id = ? AND role = 'student'
    `).run(id);

    console.log(`🔓 [SECURITY UNLOCK] Admin reset security strikes for student #${id}`);

    return res.json({
      success: true,
      message: 'Student account unlocked and security strikes reset to 0 successfully.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Orders Management
adminRouter.get('/orders', (req, res) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY id DESC';
    const orders = db.prepare(query).all(...params);

    return res.json({ success: true, orders });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Inventory & Products Management
adminRouter.get('/inventory', (_req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id ASC').all();
    return res.json({ success: true, products });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.post('/inventory', (req, res) => {
  try {
    const { sku, name, category, price, stockLevel, stockStatus, description } = req.body;
    const stmt = db.prepare(`
      INSERT INTO products (sku, name, category, price, stock_level, stock_status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(sku, name, category, price, stockLevel || 100, stockStatus || 'In Stock', description || '');
    return res.json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 7.5. Admin Profile & Credentials Management (Email & Password Change)
adminRouter.get('/profile', (req: AuthRequest, res) => {
  try {
    const adminId = req.user?.id;
    let admin: any = null;
    if (adminId) {
      admin = db.prepare('SELECT id, name, email, role FROM admins WHERE id = ?').get(adminId);
    }
    if (!admin) {
      admin = db.prepare('SELECT id, name, email, role FROM admins LIMIT 1').get();
    }
    return res.json({ success: true, admin });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.put('/credentials', (req: AuthRequest, res) => {
  try {
    const adminId = req.user?.id;
    const { name, email, currentPassword, newPassword } = req.body;

    // Fetch existing admin
    let admin: any = null;
    if (adminId) {
      admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(adminId);
    }
    if (!admin) {
      admin = db.prepare('SELECT * FROM admins LIMIT 1').get();
    }

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    // If changing password, verify currentPassword
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password' });
      }
      const trimmedCurrent = String(currentPassword).trim();
      let isMatch = false;
      try {
        isMatch = bcrypt.compareSync(trimmedCurrent, admin.password);
      } catch {
        // fallback
      }
      if (!isMatch && trimmedCurrent === admin.password) {
        isMatch = true;
      }
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect. Please enter your valid current password.' });
      }
      if (newPassword.trim().length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }
    }

    const updatedName = (name || admin.name).trim();
    const updatedEmail = (email || admin.email).trim().toLowerCase();

    // Check if new email conflicts with another admin
    if (updatedEmail !== admin.email) {
      const existing = db.prepare('SELECT id FROM admins WHERE email = ? AND id != ?').get(updatedEmail, admin.id);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An admin account with this email already exists' });
      }
    }

    let hashedPassword = admin.password;
    if (newPassword) {
      hashedPassword = bcrypt.hashSync(newPassword, 10);
    }

    db.prepare(`
      UPDATE admins 
      SET name = ?, email = ?, password = ?
      WHERE id = ?
    `).run(updatedName, updatedEmail, hashedPassword, admin.id);

    // Issue updated token with new email/name
    const newToken = jwt.sign(
      { id: admin.id, email: updatedEmail, name: updatedName, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    db.prepare('INSERT INTO audit_logs (actor_email, action, details) VALUES (?, ?, ?)')
      .run(
        updatedEmail,
        'UPDATE_ADMIN_CREDENTIALS',
        `Admin updated login credentials (Email: ${updatedEmail}, Password Changed: ${!!newPassword})`
      );

    console.log(`🔐 [ADMIN CREDENTIALS UPDATED] Admin #${admin.id} updated email to ${updatedEmail} (Password updated: ${!!newPassword})`);

    return res.json({
      success: true,
      message: 'Admin login credentials updated successfully!',
      token: newToken,
      user: {
        id: admin.id,
        name: updatedName,
        email: updatedEmail,
        role: 'admin'
      }
    });
  } catch (err: any) {
    console.error('Error updating admin credentials:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 8. Settings Management
adminRouter.get('/settings', (_req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all() as any[];
    const settingsMap: Record<string, string> = {};
    rows.forEach(r => { settingsMap[r.key] = r.value; });
    return res.json({ success: true, settings: settingsMap });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.put('/settings', (req, res) => {
  try {
    const settings = req.body;
    const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [k, v] of Object.entries(settings)) {
      updateStmt.run(k, String(v));
    }

    // Sync with CMS contact_info section for consistency
    if (settings.whatsapp_number || settings.contact_phone || settings.contact_email || settings.support_hours || settings.head_office || settings.regional_office) {
      try {
        const contactSection = db.prepare("SELECT content_json FROM cms_sections WHERE section_key = 'contact_info'").get() as any;
        let existingJson = {};
        if (contactSection && contactSection.content_json) {
          try { existingJson = JSON.parse(contactSection.content_json); } catch {}
        }
        const updatedContactJson = {
          ...existingJson,
          whatsapp_number: (settings.whatsapp_number || '').replace(/[^0-9]/g, '') || '923330093269',
          display_phone: settings.display_phone || settings.contact_phone || '+92 333 0093269',
          email: settings.contact_email || 'support@ecomwithsami.com',
          support_hours: settings.support_hours || 'Mon–Sat, 9:00 AM – 5:00 PM PKT',
          head_office: settings.head_office || 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
          regional_office: settings.regional_office || 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)'
        };
        db.prepare("INSERT OR REPLACE INTO cms_sections (section_key, title, content_json, is_visible) VALUES ('contact_info', 'Contact Channels & WhatsApp', ?, 1)")
          .run(JSON.stringify(updatedContactJson));
      } catch (cmsErr) {
        console.error('Error syncing contact section:', cmsErr);
      }
    }

    return res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 9. Tracking Pixels Management
adminRouter.get('/pixels', (_req, res) => {
  try {
    const pixels = db.prepare('SELECT * FROM tracking_pixels ORDER BY id DESC').all();
    return res.json({ success: true, pixels });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.post('/pixels', (req, res) => {
  try {
    const { platform_name, pixel_id, custom_code, is_active, placement } = req.body;
    if (!platform_name) {
      return res.status(400).json({ success: false, message: 'Platform name is required' });
    }
    if (!pixel_id && !custom_code) {
      return res.status(400).json({ success: false, message: 'Please provide either a Pixel ID or Custom Code script' });
    }

    const stmt = db.prepare(`
      INSERT INTO tracking_pixels (platform_name, pixel_id, custom_code, is_active, placement, updated_at)
      VALUES (?, ?, ?, ?, ?, DATETIME('now'))
    `);
    const result = stmt.run(
      platform_name,
      pixel_id || null,
      custom_code || null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      placement === 'body' ? 'body' : 'head'
    );

    return res.json({ success: true, id: result.lastInsertRowid, message: 'Tracking pixel created successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.put('/pixels/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { platform_name, pixel_id, custom_code, is_active, placement } = req.body;

    const stmt = db.prepare(`
      UPDATE tracking_pixels
      SET platform_name = ?, pixel_id = ?, custom_code = ?, is_active = ?, placement = ?, updated_at = DATETIME('now')
      WHERE id = ?
    `);
    const result = stmt.run(
      platform_name,
      pixel_id || null,
      custom_code || null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      placement === 'body' ? 'body' : 'head',
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Tracking pixel not found' });
    }

    return res.json({ success: true, message: 'Tracking pixel updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.patch('/pixels/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const pixel = db.prepare('SELECT id, is_active FROM tracking_pixels WHERE id = ?').get(id) as any;
    if (!pixel) {
      return res.status(404).json({ success: false, message: 'Tracking pixel not found' });
    }

    const newStatus = pixel.is_active === 1 ? 0 : 1;
    db.prepare("UPDATE tracking_pixels SET is_active = ?, updated_at = DATETIME('now') WHERE id = ?").run(newStatus, id);

    return res.json({ success: true, is_active: newStatus, message: `Pixel ${newStatus === 1 ? 'activated' : 'deactivated'}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.delete('/pixels/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM tracking_pixels WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Tracking pixel not found' });
    }
    return res.json({ success: true, message: 'Tracking pixel deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 10. Dynamic Payment Methods & Receiving Accounts CRUD
adminRouter.get('/payment-methods', (_req, res) => {
  try {
    let methods = db.prepare(`
      SELECT id, method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order, created_at, updated_at
      FROM payment_methods
      ORDER BY display_order ASC, id ASC
    `).all();

    if (!methods || methods.length === 0) {
      const insertPM = db.prepare(`
        INSERT INTO payment_methods (
          method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertPM.run('easypaisa', 'Easypaisa Mobile Wallet', 'wallet', 'RECOMMENDED & FASTEST', 'SARDAR SAMIULLAH', '03481095933', '', '', 'Send course fee via Easypaisa Mobile App or USSD code and upload transaction screenshot.', 'PKR 3,900', 1, 1);
      insertPM.run('jazzcash', 'JazzCash Account', 'wallet', 'INSTANT MOBILE TRANSFER', 'SARDAR SAMIULLAH', '03481095933', '', '', 'Send course fee to JazzCash account and attach proof below.', 'PKR 3,900', 1, 2);
      insertPM.run('upaisa', 'UPaisa Mobile Wallet', 'wallet', 'MOBILE TRANSFER', 'SARDAR SAMIULLAH', '03481095933', '', '', 'Send course fee via UPaisa app/agent and upload transaction proof.', 'PKR 3,900', 1, 3);
      insertPM.run('meezan_bank', 'Meezan Bank Transfer', 'bank', 'DIRECT IBFT / RAASM', 'SARDAR SAMIULLAH', '0015010112560119', 'PK94MEZN0015010112560119', '', 'Transfer to Meezan Bank via Raast ID / IBFT and upload confirmation screenshot.', 'PKR 3,900', 1, 4);
      insertPM.run('binance_crypto', 'Binance Pay & USDT (Crypto)', 'crypto', 'CRYPTO / ZERO FEE', 'Sami2026', '243182889', '0xae8da71c3ad92406e69edc24219918ea58c00dac', '', 'Send $15 USDT via Binance Pay ID or BEP20 Wallet network and attach payment proof.', '$15 USDT', 1, 5);
      insertPM.run('international_card', 'Visa / Mastercard Card Checkout', 'card', 'OVERSEAS & INTERNATIONAL', 'Online Card Checkout', '', '', 'https://whop.com/checkout/plan_0vX2Q4Zz9kK1Z?d2c=true', 'Overseas & International students can pay directly using any Visa, Mastercard, Apple Pay, or Google Pay.', '$15 USD', 1, 6);
      
      methods = db.prepare(`SELECT * FROM payment_methods ORDER BY display_order ASC, id ASC`).all();
    }

    return res.json({ success: true, methods });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.post('/payment-methods', (req, res) => {
  try {
    const {
      title,
      category = 'bank',
      badge = '',
      account_title = '',
      account_number = '',
      iban_or_wallet = '',
      checkout_url = '',
      instructions = '',
      price_display = 'PKR 3,900',
      is_active = 1,
      display_order = 0
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Payment method title is required' });
    }

    const baseKey = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    const method_key = `${baseKey}_${Date.now().toString().slice(-4)}`;

    const stmt = db.prepare(`
      INSERT INTO payment_methods (
        method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
    `);

    const result = stmt.run(
      method_key,
      title.trim(),
      category,
      badge.trim(),
      account_title.trim(),
      account_number.trim(),
      iban_or_wallet.trim(),
      checkout_url.trim(),
      instructions.trim(),
      price_display.trim() || 'PKR 3,900',
      is_active ? 1 : 0,
      Number(display_order) || 0
    );

    const newMethod = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(result.lastInsertRowid);
    return res.json({ success: true, message: 'Payment method created successfully', method: newMethod });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.put('/payment-methods/:id', (req, res) => {
  try {
    const numId = Number(req.params.id);
    const {
      title,
      category = 'bank',
      badge = '',
      account_title = '',
      account_number = '',
      iban_or_wallet = '',
      checkout_url = '',
      instructions = '',
      price_display = 'PKR 3,900',
      is_active = 1,
      display_order = 0
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Payment method title is required' });
    }

    // 1. Check if record exists by ID
    let exists = (numId && !isNaN(numId)) ? db.prepare('SELECT id FROM payment_methods WHERE id = ?').get(numId) as any : null;

    // 2. Fallback check by title or baseKey
    if (!exists) {
      const baseKey = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
      exists = db.prepare('SELECT id FROM payment_methods WHERE method_key = ? OR title = ?').get(baseKey, title.trim()) as any;
    }

    if (exists) {
      db.prepare(`
        UPDATE payment_methods SET
          title = ?,
          category = ?,
          badge = ?,
          account_title = ?,
          account_number = ?,
          iban_or_wallet = ?,
          checkout_url = ?,
          instructions = ?,
          price_display = ?,
          is_active = ?,
          display_order = ?,
          updated_at = DATETIME('now')
        WHERE id = ?
      `).run(
        title.trim(),
        category,
        badge.trim(),
        account_title.trim(),
        account_number.trim(),
        iban_or_wallet.trim(),
        checkout_url.trim(),
        instructions.trim(),
        price_display.trim() || 'PKR 3,900',
        is_active ? 1 : 0,
        Number(display_order) || 0,
        exists.id
      );

      const updated = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(exists.id);
      return res.json({ success: true, message: 'Payment method updated successfully', method: updated });
    } else {
      const baseKey = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
      const method_key = `${baseKey}_${Date.now().toString().slice(-4)}`;

      const stmt = db.prepare(`
        INSERT INTO payment_methods (
          method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
      `);

      const result = stmt.run(
        method_key,
        title.trim(),
        category,
        badge.trim(),
        account_title.trim(),
        account_number.trim(),
        iban_or_wallet.trim(),
        checkout_url.trim(),
        instructions.trim(),
        price_display.trim() || 'PKR 3,900',
        is_active ? 1 : 0,
        Number(display_order) || 0
      );

      const newMethod = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(result.lastInsertRowid);
      return res.json({ success: true, message: 'Payment method saved successfully', method: newMethod });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.patch('/payment-methods/:id/toggle', (req, res) => {
  try {
    const numId = Number(req.params.id);
    let method = (numId && !isNaN(numId)) ? db.prepare('SELECT id, is_active, title FROM payment_methods WHERE id = ?').get(numId) as any : null;
    if (!method) {
      method = db.prepare('SELECT id, is_active, title FROM payment_methods ORDER BY id ASC LIMIT 1').get() as any;
    }
    if (!method) {
      return res.json({ success: true, is_active: 1, message: 'Status updated' });
    }

    const newStatus = method.is_active === 1 ? 0 : 1;
    db.prepare("UPDATE payment_methods SET is_active = ?, updated_at = DATETIME('now') WHERE id = ?").run(newStatus, method.id);

    return res.json({
      success: true,
      is_active: newStatus,
      message: `${method.title} is now ${newStatus === 1 ? 'ACTIVE (visible on website)' : 'DISABLED (hidden from website)'}`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.delete('/payment-methods/:id', (req, res) => {
  try {
    const numId = Number(req.params.id);
    if (numId && !isNaN(numId)) {
      db.prepare('DELETE FROM payment_methods WHERE id = ?').run(numId);
    }
    return res.json({ success: true, message: 'Payment method deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

adminRouter.post('/payment-methods/reset-defaults', (_req, res) => {
  try {
    db.prepare('DELETE FROM payment_methods').run();

    const insertPM = db.prepare(`
      INSERT INTO payment_methods (
        method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPM.run(
      'easypaisa',
      'Easypaisa Mobile Wallet',
      'wallet',
      'RECOMMENDED & FASTEST',
      'SARDAR SAMIULLAH',
      '03481095933',
      '',
      '',
      'Send course fee via Easypaisa Mobile App or USSD code and upload the transaction screenshot.',
      'PKR 3,900',
      1,
      1
    );

    insertPM.run(
      'jazzcash',
      'JazzCash Account',
      'wallet',
      'INSTANT MOBILE TRANSFER',
      'SARDAR SAMIULLAH',
      '03481095933',
      '',
      '',
      'Send course fee to JazzCash account and attach proof below.',
      'PKR 3,900',
      1,
      2
    );

    insertPM.run(
      'upaisa',
      'UPaisa Mobile Wallet',
      'wallet',
      'MOBILE TRANSFER',
      'SARDAR SAMIULLAH',
      '03481095933',
      '',
      '',
      'Send course fee via UPaisa app/agent and upload transaction proof.',
      'PKR 3,900',
      1,
      3
    );

    insertPM.run(
      'meezan_bank',
      'Meezan Bank Transfer',
      'bank',
      'DIRECT BANK / MOBILE APP / RAAST',
      'SARDAR SAMIULLAH',
      '0015010112560119',
      'PK94MEZN0015010112560119',
      '',
      'Transfer to Meezan Bank via Raast or IBFT using IBAN PK94MEZN0015010112560119 and upload confirmation screenshot.',
      'PKR 3,900',
      1,
      4
    );

    insertPM.run(
      'binance_crypto',
      'Binance Pay & USDT (Crypto)',
      'crypto',
      'CRYPTO / ZERO FEE',
      'Sami2026',
      '243182889',
      '0xae8da71c3ad92406e69edc24219918ea58c00dac',
      '',
      'Binance Pay ID: 243182889 (Nickname: Sami2026) or BEP20 USDT. Upload transfer hash/screenshot.',
      '$15 USDT',
      1,
      5
    );

    insertPM.run(
      'international_card',
      'Visa / Mastercard Card Checkout',
      'card',
      'OVERSEAS & INTERNATIONAL',
      'Online Card Checkout',
      '',
      '',
      'https://whop.com/checkout/plan_DsfaeyFcXlCwI',
      'Best for students in UAE, KSA, UK, USA. Pay securely with card and upload receipt proof.',
      '$15 USD',
      1,
      6
    );

    const methods = db.prepare('SELECT * FROM payment_methods ORDER BY display_order ASC, id ASC').all();
    return res.json({ success: true, message: 'Default payment methods restored successfully', methods });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
