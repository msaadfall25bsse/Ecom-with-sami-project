import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const lmsRouter = Router();

const getSetting = (k: string, defaultVal: string = '') => {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(k) as any;
  return row ? row.value : defaultVal;
};

// All routes require student authentication
lmsRouter.use(requireAuth);

/**
 * 1. GET /api/lms/dashboard
 * Return student overview, progress, announcement, downloads, VIP links
 */
lmsRouter.get('/dashboard', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const student = db.prepare(`
      SELECT id, name, email, phone, city, status, security_strikes, suspended_reason, created_at, last_active_at, current_session_token
      FROM users WHERE id = ?
    `).get(userId) as any;

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    // Check if account is suspended due to security strikes (3-strike policy)
    const isSuspended = student.status === 'suspended' || (student.security_strikes || 0) >= 3;
    if (isSuspended) {
      return res.json({
        success: true,
        isSuspended: true,
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          city: student.city
        },
        securityStrikes: student.security_strikes || 5,
        suspendedReason: student.suspended_reason || 'Account blocked due to multiple unauthorized screenshot or screen recording attempts (5/5 strikes)',
        adminWhatsApp: getSetting('admin_whatsapp', getSetting('whatsapp_number', '+92 333 0093269'))
      });
    }

    // Update active timestamp
    db.prepare("UPDATE users SET last_active_at = DATETIME('now'), last_login_ip = ? WHERE id = ?")
      .run(req.ip || '127.0.0.1', userId);

    const totalLessons = (db.prepare('SELECT count(*) as total FROM lessons').get() as any).total || 36;
    const completedRows = db.prepare('SELECT lesson_id, completed_at FROM user_progress WHERE user_id = ?').all(userId) as any[];
    const completedCount = completedRows.length;
    const progressPercentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));

    const adminWhatsApp = getSetting('admin_whatsapp', getSetting('whatsapp_number', '+92 333 0093269'));
    const whatsappGroupUrl = getSetting('whatsapp_group_link', 'https://chat.whatsapp.com/sami-mentorship-mastermind');

    const downloads = [
      {
        id: 'dl-1',
        title: 'VIP Dropshipping Profit Margin & Cash Flow Calculator',
        type: 'Excel Spreadsheet (.xlsx)',
        size: '1.4 MB',
        icon: 'Calculator',
        url: '/downloads/dropshipping-pl-calculator.xlsx'
      },
      {
        id: 'dl-2',
        title: 'Zero to Hero Facebook & TikTok Ads Blueprint (2026 Edition)',
        type: 'E-Book (PDF)',
        size: '8.2 MB',
        icon: 'BookOpen',
        url: '/downloads/fb-tiktok-ads-guide.pdf'
      },
      {
        id: 'dl-3',
        title: 'Verified UAE & KSA Local Courier & Supplier Directory',
        type: 'Resource Guide (PDF)',
        size: '3.1 MB',
        icon: 'FileText',
        url: '/downloads/uae-ksa-suppliers-directory.pdf'
      }
    ];

    const mentorshipLinks = [
      {
        title: 'Join Official VIP WhatsApp Mentorship Mastermind',
        description: 'Direct daily guidance with Sami and community members',
        url: whatsappGroupUrl,
        badge: 'Active Community'
      },
      {
        title: 'Weekly Live Coaching Zoom Room',
        description: 'Every Saturday at 9:00 PM PKT (Store Audits & Live Product Hunting)',
        url: 'https://zoom.us/j/sami-live-coaching',
        badge: 'Weekly Calls'
      }
    ];

    // Find the current/next recommended lesson for the student
    let nextLessonId: number | null = null;
    const completedIds = completedRows.map(r => r.lesson_id);
    const allLessons = db.prepare('SELECT id FROM lessons ORDER BY module_id ASC, sort_order ASC').all() as any[];
    for (const l of allLessons) {
      if (!completedIds.includes(l.id)) {
        nextLessonId = l.id;
        break;
      }
    }
    if (!nextLessonId && allLessons.length > 0) {
      nextLessonId = allLessons[0].id;
    }

    return res.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        city: student.city,
        security_strikes: student.security_strikes || 0,
        status: student.status
      },
      course: {
        id: 1,
        title: 'Master UAE & KSA Dropshipping (From Scratch to Scaling)',
        totalModules: 11,
        totalLectures: totalLessons,
        completedLectures: completedCount,
        progressPercentage,
        nextLessonId
      },
      adminWhatsApp,
      whatsappGroupUrl,
      announcement: getSetting('lms_announcement', '🔥 Welcome to Sami Mentorship! Watch lectures in sequence and join our weekly live coaching mastermind.'),
      downloads,
      mentorshipLinks,
      watermarkEnabled: getSetting('lms_watermark_enabled', '1') === '1',
      devtoolsBlockEnabled: getSetting('lms_devtools_block_enabled', '1') === '1'
    });
  } catch (err: any) {
    console.error('Error fetching LMS dashboard:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 2. GET /api/lms/curriculum
 * Return full 11 modules and lessons with completed states
 */
lmsRouter.get('/curriculum', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const modules = db.prepare('SELECT * FROM modules ORDER BY sort_order ASC').all() as any[];
    const completedRows = db.prepare('SELECT lesson_id FROM user_progress WHERE user_id = ?').all(userId) as any[];
    const completedIds = new Set(completedRows.map(r => r.lesson_id));

    const curriculum = modules.map(m => {
      const lessons = db.prepare(`
        SELECT id, module_id, title, duration, is_preview, sort_order
        FROM lessons 
        WHERE module_id = ? 
        ORDER BY sort_order ASC
      `).all(m.id) as any[];

      const completedInModule = lessons.filter(l => completedIds.has(l.id)).length;

      return {
        id: m.id,
        module_number: m.module_number,
        title: m.title,
        description: m.description,
        totalLessons: lessons.length,
        completedLessons: completedInModule,
        lessons: lessons.map(l => ({
          id: l.id,
          title: l.title,
          duration: l.duration || '15:00',
          is_completed: completedIds.has(l.id),
          is_preview: Boolean(l.is_preview)
        }))
      };
    });

    const totalLessons = (db.prepare('SELECT count(*) as total FROM lessons').get() as any).total || 36;
    const progressPercentage = Math.min(100, Math.round((completedIds.size / totalLessons) * 100));

    return res.json({
      success: true,
      curriculum,
      stats: {
        totalLessons,
        completedLessons: completedIds.size,
        progressPercentage
      }
    });
  } catch (err: any) {
    console.error('Error fetching LMS curriculum:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 3. GET /api/lms/lesson/:id
 * Return full lesson playback details and dynamic watermark payload
 */
lmsRouter.get('/lesson/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const lesson = db.prepare(`
      SELECT l.*, m.title as module_title, m.module_number
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE l.id = ?
    `).get(id) as any;

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const student = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId) as any;

    // Check completed state
    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?').get(userId, id);
    const isCompleted = Boolean(progress);

    // Find previous and next lessons
    const allOrderedLessons = db.prepare(`
      SELECT l.id, l.title, m.id as module_id
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      ORDER BY m.sort_order ASC, l.sort_order ASC
    `).all() as any[];

    const currentIndex = allOrderedLessons.findIndex(item => item.id === Number(id));
    const prevLesson = currentIndex > 0 ? allOrderedLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allOrderedLessons.length - 1 ? allOrderedLessons[currentIndex + 1] : null;

    // Dynamic Anti-Piracy Watermark Data
    const clientIp = req.ip || req.socket.remoteAddress || '192.168.1.1';
    const watermark = {
      studentName: student?.name || 'Authorized Student',
      studentEmail: student?.email || 'student@ecomwithsami.com',
      studentId: `STU-${String(student?.id || 1).padStart(4, '0')}`,
      ip: clientIp.replace('::ffff:', ''),
      timestamp: new Date().toISOString(),
      displayString: `${student?.name} (${student?.email}) • ${clientIp.replace('::ffff:', '')}`
    };

    return res.json({
      success: true,
      lesson: {
        id: lesson.id,
        moduleId: lesson.module_id,
        moduleNumber: lesson.module_number,
        moduleTitle: lesson.module_title,
        title: lesson.title,
        description: lesson.description || '',
        videoType: lesson.video_type || 'bunny',
        bunnyVideoId: lesson.bunny_video_id || '',
        vdocipherId: lesson.vdocipher_id || '',
        duration: lesson.duration || '15:00',
        attachmentPath: lesson.attachment_path,
        notes: lesson.notes || '',
        isCompleted
      },
      navigation: {
        prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
        nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null
      },
      watermark
    });
  } catch (err: any) {
    console.error('Error fetching lesson playback:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 4. POST /api/lms/progress
 * Toggle or mark lesson completion
 */
lmsRouter.post('/progress', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { lessonId, completed = true } = req.body;

    if (!lessonId) {
      return res.status(400).json({ success: false, message: 'lessonId is required' });
    }

    if (completed) {
      db.prepare('INSERT OR IGNORE INTO user_progress (user_id, lesson_id, completed_at) VALUES (?, ?, DATETIME(\'now\'))')
        .run(userId, lessonId);
    } else {
      db.prepare('DELETE FROM user_progress WHERE user_id = ? AND lesson_id = ?')
        .run(userId, lessonId);
    }

    // Update active timestamp
    db.prepare("UPDATE users SET last_active_at = DATETIME('now') WHERE id = ?").run(userId);

    const totalLessons = (db.prepare('SELECT count(*) as total FROM lessons').get() as any).total || 36;
    const completedCount = (db.prepare('SELECT count(*) as count FROM user_progress WHERE user_id = ?').get(userId) as any).count || 0;
    const progressPercentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));

    return res.json({
      success: true,
      message: completed ? 'Lesson completed!' : 'Lesson marked as uncompleted',
      stats: {
        completedLessons: completedCount,
        totalLessons,
        progressPercentage
      }
    });
  } catch (err: any) {
    console.error('Error updating progress:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 5. POST /api/lms/security-strike
 * Record unauthorized screenshot / screen recording attempt, issue strike, and suspend if >= 2
 */
lmsRouter.post('/security-strike', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { eventType = 'screenshot', details = '' } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || req.ip || '127.0.0.1').replace('::ffff:', '');
    const userAgent = (req.headers['user-agent'] as string) || 'Unknown Device';

    const student = db.prepare('SELECT id, name, email, phone, status, security_strikes FROM users WHERE id = ?').get(userId) as any;
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    const newStrikeCount = (student.security_strikes || 0) + 1;
    const willSuspend = newStrikeCount >= 5;
    const reason = willSuspend
      ? 'Account blocked due to multiple unauthorized screenshot or screen recording attempts (5/5 strikes)'
      : `Warning #${newStrikeCount} issued for unauthorized screenshot / screen capture attempt (${newStrikeCount}/5 strikes)`;

    // 1. Update student security strike record in DB
    db.prepare(`
      UPDATE users 
      SET security_strikes = ?, 
          status = CASE WHEN ? >= 5 THEN 'suspended' ELSE status END,
          suspended_reason = CASE WHEN ? >= 5 THEN ? ELSE suspended_reason END,
          last_strike_at = DATETIME('now')
      WHERE id = ?
    `).run(newStrikeCount, newStrikeCount, newStrikeCount, reason, userId);

    // 2. Log incident in security_logs table
    db.prepare(`
      INSERT INTO security_logs (user_id, event_type, strike_count, ip_address, user_agent, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, eventType, newStrikeCount, clientIp, userAgent, details || `Strike ${newStrikeCount} triggered via ${eventType}`);

    console.log(`🚨 [SECURITY STRIKE] User #${userId} (${student.name}) triggered Strike ${newStrikeCount} [${eventType}] from IP ${clientIp}. Suspended: ${willSuspend}`);

    return res.json({
      success: true,
      strikeCount: newStrikeCount,
      isSuspended: willSuspend,
      suspendedReason: reason,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone
      },
      ip: clientIp,
      adminWhatsApp: getSetting('admin_whatsapp', getSetting('whatsapp_number', '+92 333 0093269')),
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error logging security strike:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 6. GET /api/lms/resources
 * Return course downloads, templates, calculators & attachments
 */
lmsRouter.get('/resources', (_req: AuthRequest, res: Response) => {
  try {
    const whatsappGroupUrl = getSetting('whatsapp_group_link', 'https://chat.whatsapp.com/sami-mentorship-mastermind');
    const downloads = [
      {
        id: 'dl-1',
        title: 'VIP Dropshipping Profit Margin & Cash Flow Calculator',
        type: 'Excel Spreadsheet (.xlsx)',
        size: '1.4 MB',
        icon: 'Calculator',
        url: '/downloads/dropshipping-pl-calculator.xlsx'
      },
      {
        id: 'dl-2',
        title: 'Zero to Hero Facebook & TikTok Ads Blueprint (2026 Edition)',
        type: 'E-Book (PDF)',
        size: '8.2 MB',
        icon: 'BookOpen',
        url: '/downloads/fb-tiktok-ads-guide.pdf'
      },
      {
        id: 'dl-3',
        title: 'Verified UAE & KSA Local Courier & Supplier Directory',
        type: 'Resource Guide (PDF)',
        size: '3.1 MB',
        icon: 'FileText',
        url: '/downloads/uae-ksa-suppliers-directory.pdf'
      }
    ];

    return res.json({
      success: true,
      downloads,
      whatsappGroupUrl
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 7. GET /api/lms/progress
 * Return user completion stats & list of completed lesson IDs
 */
lmsRouter.get('/progress', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const completedRows = db.prepare('SELECT lesson_id, completed_at FROM user_progress WHERE user_id = ?').all(userId) as any[];
    const totalLessons = (db.prepare('SELECT count(*) as total FROM lessons').get() as any).total || 36;
    const progressPercentage = Math.min(100, Math.round((completedRows.length / totalLessons) * 100));

    return res.json({
      success: true,
      completedLessons: completedRows.map(r => r.lesson_id),
      stats: {
        totalLessons,
        completedCount: completedRows.length,
        progressPercentage
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 8. GET /api/lms/security-status
 * Return watermark and piracy protection configuration
 */
lmsRouter.get('/security-status', (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const student = db.prepare('SELECT id, name, email, security_strikes, status FROM users WHERE id = ?').get(userId) as any;
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || req.ip || '127.0.0.1').replace('::ffff:', '');

    return res.json({
      success: true,
      strikes: student?.security_strikes || 0,
      isSuspended: student?.status === 'suspended' || (student?.security_strikes || 0) >= 3,
      watermark: {
        name: student?.name || 'Student',
        email: student?.email || 'student@ecomwithsami.com',
        ip: clientIp
      },
      watermarkEnabled: getSetting('lms_watermark_enabled', '1') === '1',
      devtoolsBlockEnabled: getSetting('lms_devtools_block_enabled', '1') === '1'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 9. GET /api/lms/stream/:id
 * Stream helper alias for video playback
 */
lmsRouter.get('/stream/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(id) as any;
    if (!lesson) {
      lesson = db.prepare('SELECT * FROM lessons LIMIT 1').get() as any;
    }
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'No lessons found' });
    }
    return res.json({
      success: true,
      lessonId: lesson.id,
      title: lesson.title,
      videoType: lesson.video_type || 'bunny',
      bunnyVideoId: lesson.bunny_video_id || '',
      streamUrl: lesson.bunny_video_id ? `https://iframe.mediadelivery.net/embed/416410/${lesson.bunny_video_id}` : ''
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});


