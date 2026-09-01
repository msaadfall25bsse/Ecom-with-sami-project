import { Router } from 'express';
import { db } from '../db/index.js';

export const publicRouter = Router();

// Public: Get Landing Page Data (Course, 11 Modules, Testimonials, Live Settings)
publicRouter.get('/home', (_req, res) => {
  try {
    const course = db.prepare('SELECT * FROM courses WHERE id = 1').get() as any;
    
    // Get Modules with lessons count
    const modules = db.prepare(`
      SELECT m.id, m.module_number, m.title, m.description,
             (SELECT count(*) FROM lessons WHERE module_id = m.id) as lesson_count
      FROM modules m
      ORDER BY m.sort_order ASC
    `).all();

    // Get Testimonials
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY id ASC').all();

    // Get Platform Settings
    const settingsRows = db.prepare('SELECT key, value FROM settings').all() as any[];
    const settings: Record<string, string> = {};
    settingsRows.forEach(r => { settings[r.key] = r.value; });

    return res.json({
      success: true,
      course: course || {
        title: 'Master UAE & KSA Dropshipping (From Scratch to Scaling)',
        price: 3900,
        original_price: 32500,
        discount_percentage: 88,
        total_lectures: 36,
        duration_hours: 8
      },
      modules,
      testimonials,
      settings
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public: Checkout Configuration (Bank accounts, Easypaisa, Crypto, Urgency timer)
publicRouter.get('/checkout-config', (_req, res) => {
  try {
    const settingsRows = db.prepare('SELECT key, value FROM settings').all() as any[];
    const settings: Record<string, string> = {};
    settingsRows.forEach(r => { settings[r.key] = r.value; });

    return res.json({
      success: true,
      pricePKR: parseInt(settings.course_fee_pkr || '3900', 10),
      priceUSD: parseInt(settings.course_fee_usd || '15', 10),
      originalPKR: parseInt(settings.original_fee_pkr || '32500', 10),
      discountPct: 88,
      seatsLeft: parseInt(settings.seats_left || '12', 10),
      paymentMethods: {
        pakistan: {
          bank: {
            bankName: 'Meezan Bank',
            accountTitle: settings.meezan_bank_title || 'ECOM WITH SAMI (PVT) LTD',
            accountNumber: settings.meezan_bank_account || '53020115677150',
            iban: settings.meezan_bank_iban || 'PK27MEZN0053020115677150'
          },
          easypaisa: {
            accountTitle: settings.easypaisa_title || 'Sami Ur Rehman',
            accountNumber: settings.easypaisa_number || '03315137294'
          }
        },
        international: {
          cardFeeUSD: 15,
          cardCheckoutUrl: 'https://whop.com/checkout/plan_DsfaeyFcXlCwI'
        },
        crypto: {
          binancePayId: settings.binance_pay_id || '243182889',
          binanceName: settings.binance_name || 'Sami2026',
          network: 'BSC / BNB Smart Chain (BEP20)',
          walletAddress: settings.crypto_bep20_wallet || '0xae8da71c3ad92406e69edc24219918ea58c00dac'
        }
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public: Dynamic Active Payment Methods & Receiving Accounts
publicRouter.get('/payment-methods', (_req, res) => {
  try {
    const methods = db.prepare(`
      SELECT id, method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order
      FROM payment_methods
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `).all();

    return res.json({
      success: true,
      methods
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public: Dynamic Contact & WhatsApp Configuration
publicRouter.get('/contact-config', (_req, res) => {
  try {
    const settingsRows = db.prepare('SELECT key, value FROM settings').all() as any[];
    const settings: Record<string, string> = {};
    settingsRows.forEach(r => { settings[r.key] = r.value; });

    const rawWhatsapp = settings.whatsapp_number || '923330093269';
    const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '') || '923330093269';
    const rawAdminWhatsapp = settings.admin_whatsapp || settings.contact_phone || '+92 333 0093269';
    const cleanAdminWhatsapp = rawAdminWhatsapp.replace(/[^0-9]/g, '') || cleanWhatsapp;

    return res.json({
      success: true,
      whatsappNumber: cleanWhatsapp,
      displayPhone: settings.display_phone || settings.contact_phone || '+92 333 0093269',
      adminWhatsApp: rawAdminWhatsapp,
      cleanAdminWhatsApp: cleanAdminWhatsapp,
      whatsappGroupUrl: settings.whatsapp_group_link || 'https://chat.whatsapp.com/sami-mentorship-mastermind',
      email: settings.contact_email || 'support@ecomwithsami.com',
      supportHours: settings.support_hours || 'Mon–Sat, 9:00 AM – 5:00 PM PKT',
      headOffice: settings.head_office || 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
      regionalOffice: settings.regional_office || 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)',
      whatsappDefaultMessage: settings.whatsapp_default_message || 'Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public: Contact & Support Request
publicRouter.post('/contact', (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    // Record in database
    db.prepare(`
      INSERT INTO audit_logs (actor_email, action, details)
      VALUES (?, 'CONTACT_FORM_SUBMIT', ?)
    `).run(email, JSON.stringify({ name, phone, message }));

    return res.json({ success: true, message: 'Thank you! We will reply via WhatsApp/Email shortly.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public: Active Tracking Pixels (for dynamic storefront injection)
publicRouter.get('/pixels/active', (_req, res) => {
  try {
    const pixels = db.prepare(`
      SELECT id, platform_name, pixel_id, custom_code, placement 
      FROM tracking_pixels 
      WHERE is_active = 1
      ORDER BY id ASC
    `).all();
    return res.json({ success: true, pixels });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public: Dynamic CMS Sections Content
publicRouter.get('/cms-content', (_req, res) => {
  try {
    const sections = db.prepare(`
      SELECT section_key, title, content_json, is_visible 
      FROM cms_sections 
      WHERE is_visible = 1
    `).all() as any[];

    const structuredContent: Record<string, any> = {};
    sections.forEach(s => {
      try {
        structuredContent[s.section_key] = JSON.parse(s.content_json);
      } catch {
        structuredContent[s.section_key] = s.content_json;
      }
    });

    const reviews = db.prepare(`
      SELECT * FROM site_reviews 
      WHERE is_featured = 1 
      ORDER BY sort_order ASC, id ASC
    `).all();

    const blogs = db.prepare(`
      SELECT id, title, slug, excerpt, author, image_url, tags, created_at 
      FROM site_blogs 
      WHERE is_published = 1 
      ORDER BY created_at DESC 
      LIMIT 6
    `).all();

    return res.json({
      success: true,
      sections: structuredContent,
      reviews,
      blogs
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public: Blog Detail by Slug
publicRouter.get('/blogs/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const blog = db.prepare('SELECT * FROM site_blogs WHERE slug = ? AND is_published = 1').get(slug);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    return res.json({ success: true, blog });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});


