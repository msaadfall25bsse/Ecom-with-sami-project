import { Router } from 'express';
import { db } from '../db/index.js';
import { uploadReceipt } from '../middleware/upload.js';
import { eventsApiService } from '../services/eventsApiService.js';

export const enrollmentRouter = Router();

// Public: Submit Enrollment with payment screenshot
enrollmentRouter.post('/', uploadReceipt.single('screenshot'), (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      hearSource,
      paymentMethod,
      courseId
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (First Name, Last Name, Email, Phone, City)'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check for recent pending or approved duplicate within last 24h
    const existing = db.prepare(`
      SELECT id, status, enrollment_id FROM enrollment_requests 
      WHERE email = ? AND (status = 'pending' OR status = 'approved')
      ORDER BY id DESC LIMIT 1
    `).get(email) as any;

    if (existing) {
      if (existing.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'An active enrollment already exists for this email. Please check your inbox or login to the app.'
        });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: `An enrollment request (${existing.enrollment_id}) is already pending review for this email. We will process it shortly.`
        });
      }
    }

    // Generate unique enrollment ID
    const countRes = db.prepare('SELECT count(*) as total FROM enrollment_requests').get() as { total: number };
    const nextSeq = String(countRes.total + 1).padStart(4, '0');
    const enrollmentId = `ENR-${new Date().getFullYear()}-${nextSeq}`;

    // Get course fee
    const course = db.prepare('SELECT id, price FROM courses WHERE id = ?').get(courseId || 1) as any;
    const amount = course ? course.price : 3900;

    const screenshotPath = req.file ? `/uploads/receipts/${req.file.filename}` : null;

    // Insert into DB
    const insertStmt = db.prepare(`
      INSERT INTO enrollment_requests (
        enrollment_id, first_name, last_name, email, phone, city,
        hear_source, payment_method, amount, screenshot_path, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = insertStmt.run(
      enrollmentId,
      firstName.trim(),
      lastName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      city.trim(),
      hearSource || 'Website',
      paymentMethod || 'easypaisa',
      amount,
      screenshotPath
    );

    // Also create corresponding Pending Order record for accounting/admin overview
    db.prepare(`
      INSERT INTO orders (
        order_number, enrollment_request_id, amount, payment_method, status, customer_name, customer_email, customer_phone
      ) VALUES (?, ?, ?, ?, 'Pending', ?, ?, ?)
    `).run(
      `ORD-${nextSeq}`,
      result.lastInsertRowid,
      amount,
      paymentMethod || 'Manual Transfer',
      `${firstName.trim()} ${lastName.trim()}`,
      email.trim().toLowerCase(),
      phone.trim()
    );

    // Dispatch Server-side Events API event (async/non-blocking) with matching order event_id
    eventsApiService.trackTikTokServerEvent({
      event: 'CompletePayment',
      event_id: `order_${enrollmentId}`,
      user_email: email,
      user_phone: phone,
      value: amount,
      currency: 'PKR',
      content_id: 'COURSE-UAE-01',
      content_name: 'Master UAE & KSA Dropshipping',
      content_type: 'product',
      ip_address: req.ip || req.socket.remoteAddress,
      user_agent: req.headers['user-agent']
    }).catch(() => {});

    return res.json({
      success: true,
      message: 'Enrollment submitted successfully! Your application is being reviewed.',
      enrollmentId,
      details: {
        name: `${firstName} ${lastName}`,
        email,
        amount,
        currency: 'PKR',
        status: 'pending'
      }
    });

  } catch (err: any) {
    console.error('Error processing enrollment:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to submit enrollment request'
    });
  }
});
