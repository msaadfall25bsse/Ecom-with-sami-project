import { Router, Request, Response } from 'express';
import { db } from '../db/index';
import { requireAdmin } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const cmsRouter = Router();

// Configure Multer storage for media asset uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cms');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cms-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit for high-definition video files & media
});

/* ==========================================================
   1. SECTION MANAGEMENT ENDPOINTS
   ========================================================== */

/**
 * GET /api/admin/cms/sections
 * Fetch all CMS sections with status
 */
cmsRouter.get('/sections', requireAdmin, (req: Request, res: Response) => {
  try {
    const sections = db.prepare('SELECT id, section_key, title, content_json, is_visible, updated_at FROM cms_sections ORDER BY id ASC').all() as any[];
    const parsedSections = sections.map(s => ({
      ...s,
      content: JSON.parse(s.content_json)
    }));
    return res.json({ success: true, sections: parsedSections });
  } catch (error: any) {
    console.error('Error fetching CMS sections:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch CMS sections' });
  }
});

/**
 * GET /api/admin/cms/sections/:key
 * Fetch single CMS section
 */
cmsRouter.get('/sections/:key', requireAdmin, (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const section = db.prepare('SELECT * FROM cms_sections WHERE section_key = ?').get(key) as any;
    if (!section) {
      return res.status(404).json({ success: false, message: `Section '${key}' not found` });
    }
    return res.json({
      success: true,
      section: {
        ...section,
        content: JSON.parse(section.content_json)
      }
    });
  } catch (error: any) {
    console.error('Error fetching section:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch section' });
  }
});

/**
 * PUT /api/admin/cms/sections/:key
 * Update section title, content JSON and visibility
 */
cmsRouter.put('/sections/:key', requireAdmin, (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { title, content, is_visible } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content object is required' });
    }

    const contentJson = typeof content === 'string' ? content : JSON.stringify(content);
    const visibleVal = is_visible !== undefined ? (is_visible ? 1 : 0) : 1;

    const check = db.prepare('SELECT id FROM cms_sections WHERE section_key = ?').get(key);
    if (!check) {
      db.prepare(`
        INSERT INTO cms_sections (section_key, title, content_json, is_visible, updated_at)
        VALUES (?, ?, ?, ?, DATETIME('now'))
      `).run(key, title || key, contentJson, visibleVal);
    } else {
      db.prepare(`
        UPDATE cms_sections
        SET title = COALESCE(?, title),
            content_json = ?,
            is_visible = ?,
            updated_at = DATETIME('now')
        WHERE section_key = ?
      `).run(title, contentJson, visibleVal, key);
    }

    // Auto-sync payment_methods table if payment_accounts section is updated
    if (key === 'payment_accounts') {
      try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        if (parsedContent.easypaisa) {
          db.prepare(`UPDATE payment_methods SET account_title = ?, account_number = ?, updated_at = DATETIME('now') WHERE method_key = 'easypaisa'`)
            .run(parsedContent.easypaisa.title || '', parsedContent.easypaisa.number || '');
        }
        if (parsedContent.jazzcash) {
          db.prepare(`UPDATE payment_methods SET account_title = ?, account_number = ?, updated_at = DATETIME('now') WHERE method_key = 'jazzcash'`)
            .run(parsedContent.jazzcash.title || '', parsedContent.jazzcash.number || '');
        }
        if (parsedContent.upaisa) {
          db.prepare(`UPDATE payment_methods SET account_title = ?, account_number = ?, updated_at = DATETIME('now') WHERE method_key = 'upaisa'`)
            .run(parsedContent.upaisa.title || '', parsedContent.upaisa.number || '');
        }
        if (parsedContent.meezan) {
          db.prepare(`UPDATE payment_methods SET account_title = ?, account_number = ?, iban_or_wallet = ?, updated_at = DATETIME('now') WHERE method_key = 'meezan_bank'`)
            .run(parsedContent.meezan.title || '', parsedContent.meezan.account || '', parsedContent.meezan.iban || '');
        }
        if (parsedContent.crypto) {
          db.prepare(`UPDATE payment_methods SET account_title = ?, account_number = ?, iban_or_wallet = ?, updated_at = DATETIME('now') WHERE method_key = 'binance_crypto'`)
            .run(parsedContent.crypto.title || '', parsedContent.crypto.payId || '', parsedContent.crypto.wallet || '');
        }
        if (parsedContent.card) {
          db.prepare(`UPDATE payment_methods SET checkout_url = ?, updated_at = DATETIME('now') WHERE method_key = 'international_card'`)
            .run(parsedContent.card.url || '');
        }
      } catch (syncErr) {
        console.warn('Sync payment_methods from cms_sections:', syncErr);
      }
    }

    return res.json({ success: true, message: `Section '${key}' updated successfully!` });
  } catch (error: any) {
    console.error('Error updating section:', error);
    return res.status(500).json({ success: false, message: 'Failed to update section' });
  }
});

/**
 * PATCH /api/admin/cms/sections/:key/toggle
 * 1-Click visibility toggle on live storefront
 */
cmsRouter.patch('/sections/:key/toggle', requireAdmin, (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const section = db.prepare('SELECT is_visible FROM cms_sections WHERE section_key = ?').get(key) as any;
    if (!section) {
      return res.status(404).json({ success: false, message: `Section '${key}' not found` });
    }

    const newStatus = section.is_visible === 1 ? 0 : 1;
    db.prepare(`
      UPDATE cms_sections 
      SET is_visible = ?, updated_at = DATETIME('now') 
      WHERE section_key = ?
    `).run(newStatus, key);

    return res.json({
      success: true,
      message: `Section '${key}' is now ${newStatus === 1 ? 'ACTIVE (Visible)' : 'PAUSED (Hidden)'}`,
      is_visible: newStatus
    });
  } catch (error: any) {
    console.error('Error toggling section:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle section visibility' });
  }
});

/* ==========================================================
   2. STUDENT VIDEO REVIEWS & PROOFS ENDPOINTS
   ========================================================== */

/**
 * GET /api/admin/cms/reviews
 */
cmsRouter.get('/reviews', requireAdmin, (req: Request, res: Response) => {
  try {
    const reviews = db.prepare('SELECT * FROM site_reviews ORDER BY sort_order ASC, id ASC').all();
    return res.json({ success: true, reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

/**
 * POST /api/admin/cms/reviews
 */
cmsRouter.post('/reviews', requireAdmin, (req: Request, res: Response) => {
  try {
    const { student_name, city, market, sales_text, orders_text, quote, video_url, thumbnail_url, rating, is_featured, sort_order } = req.body;
    if (!student_name || !sales_text || !quote) {
      return res.status(400).json({ success: false, message: 'Student name, sales text and quote are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO site_reviews (student_name, city, market, sales_text, orders_text, quote, video_url, thumbnail_url, rating, is_featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      student_name,
      city || 'Karachi',
      market || 'UAE Market',
      sales_text,
      orders_text || '20 Orders',
      quote,
      video_url || null,
      thumbnail_url || null,
      rating !== undefined ? Number(rating) : 5,
      is_featured !== undefined ? (is_featured ? 1 : 0) : 1,
      sort_order !== undefined ? Number(sort_order) : 0
    );

    return res.status(201).json({
      success: true,
      message: 'Student review added successfully!',
      reviewId: result.lastInsertRowid
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create review' });
  }
});

/**
 * PUT /api/admin/cms/reviews/:id
 */
cmsRouter.put('/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { student_name, city, market, sales_text, orders_text, quote, video_url, thumbnail_url, rating, is_featured, sort_order } = req.body;

    db.prepare(`
      UPDATE site_reviews
      SET student_name = COALESCE(?, student_name),
          city = COALESCE(?, city),
          market = COALESCE(?, market),
          sales_text = COALESCE(?, sales_text),
          orders_text = COALESCE(?, orders_text),
          quote = COALESCE(?, quote),
          video_url = ?,
          thumbnail_url = ?,
          rating = COALESCE(?, rating),
          is_featured = COALESCE(?, is_featured),
          sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `).run(
      student_name,
      city,
      market,
      sales_text,
      orders_text,
      quote,
      video_url !== undefined ? video_url : null,
      thumbnail_url !== undefined ? thumbnail_url : null,
      rating !== undefined ? Number(rating) : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      sort_order !== undefined ? Number(sort_order) : null,
      id
    );

    return res.json({ success: true, message: 'Review updated successfully!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

/**
 * DELETE /api/admin/cms/reviews/:id
 */
cmsRouter.delete('/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM site_reviews WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Review deleted successfully!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

/* ==========================================================
   3. BLOGS & ANNOUNCEMENTS ENDPOINTS
   ========================================================== */

/**
 * GET /api/admin/cms/blogs
 */
cmsRouter.get('/blogs', requireAdmin, (req: Request, res: Response) => {
  try {
    const blogs = db.prepare('SELECT * FROM site_blogs ORDER BY created_at DESC').all();
    return res.json({ success: true, blogs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

/**
 * POST /api/admin/cms/blogs
 */
cmsRouter.post('/blogs', requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, slug, excerpt, content, author, image_url, tags, is_published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    const stmt = db.prepare(`
      INSERT INTO site_blogs (title, slug, excerpt, content, author, image_url, tags, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      generatedSlug,
      excerpt || '',
      content,
      author || 'Mentor Sami',
      image_url || null,
      tags || 'Dropshipping, UAE',
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully!',
      blogId: result.lastInsertRowid,
      slug: generatedSlug
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create blog post' });
  }
});

/**
 * PUT /api/admin/cms/blogs/:id
 */
cmsRouter.put('/blogs/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, author, image_url, tags, is_published } = req.body;

    db.prepare(`
      UPDATE site_blogs
      SET title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          excerpt = COALESCE(?, excerpt),
          content = COALESCE(?, content),
          author = COALESCE(?, author),
          image_url = ?,
          tags = COALESCE(?, tags),
          is_published = COALESCE(?, is_published),
          updated_at = DATETIME('now')
      WHERE id = ?
    `).run(
      title,
      slug,
      excerpt,
      content,
      author,
      image_url !== undefined ? image_url : null,
      tags,
      is_published !== undefined ? (is_published ? 1 : 0) : null,
      id
    );

    return res.json({ success: true, message: 'Blog post updated successfully!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update blog' });
  }
});

/**
 * DELETE /api/admin/cms/blogs/:id
 */
cmsRouter.delete('/blogs/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM site_blogs WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Blog post deleted successfully!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
});

/* ==========================================================
   5. PAYMENT METHODS & RECEIVING ACCOUNTS CRUD
   ========================================================== */

/**
 * GET /api/admin/cms/payment-methods
 */
cmsRouter.get('/payment-methods', requireAdmin, (_req: Request, res: Response) => {
  try {
    let methods = db.prepare(`
      SELECT id, method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order, created_at, updated_at
      FROM payment_methods
      ORDER BY display_order ASC, id ASC
    `).all();

    if (!methods || methods.length === 0) {
      // Auto seed if empty
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

/**
 * POST /api/admin/cms/payment-methods
 */
cmsRouter.post('/payment-methods', requireAdmin, (req: Request, res: Response) => {
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

/**
 * PUT /api/admin/cms/payment-methods/:id
 * Ultra-resilient UPSERT: If record doesn't exist by ID, finds by key/title or inserts new row. Never 404s.
 */
cmsRouter.put('/payment-methods/:id', requireAdmin, (req: Request, res: Response) => {
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
      // UPDATE
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
      // INSERT (UPSERT fallback)
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

/**
 * PATCH /api/admin/cms/payment-methods/:id/toggle
 */
cmsRouter.patch('/payment-methods/:id/toggle', requireAdmin, (req: Request, res: Response) => {
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

/**
 * DELETE /api/admin/cms/payment-methods/:id
 */
cmsRouter.delete('/payment-methods/:id', requireAdmin, (req: Request, res: Response) => {
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

/**
 * POST /api/admin/cms/payment-methods/reset-defaults
 */
cmsRouter.post('/payment-methods/reset-defaults', requireAdmin, (_req: Request, res: Response) => {
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
      'DIRECT IBFT / RAASM',
      'SARDAR SAMIULLAH',
      '0015010112560119',
      'PK94MEZN0015010112560119',
      '',
      'Transfer to Meezan Bank via Raast ID / IBFT and upload confirmation screenshot.',
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
      'Send $15 USDT via Binance Pay ID or BSC / BEP20 Wallet network and attach payment proof.',
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
      'https://whop.com/checkout/plan_0vX2Q4Zz9kK1Z?d2c=true',
      'Overseas & International students can pay directly using any Visa, Mastercard, Apple Pay, or Google Pay.',
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

/* ==========================================================
   6. MEDIA FILE UPLOADER ENDPOINT
   ========================================================== */

/**
 * POST /api/admin/cms/upload
 * Upload media assets (images, badges, video thumbnails)
 */
cmsRouter.post('/upload', requireAdmin, upload.single('mediaFile'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const publicUrl = `/uploads/cms/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'File uploaded successfully!',
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error: any) {
    console.error('Error uploading CMS media:', error);
    return res.status(500).json({ success: false, message: 'File upload failed' });
  }
});
