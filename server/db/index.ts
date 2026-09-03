import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

export class SqlJsDatabase {
  private rawDb: any;
  private dbPath: string;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor(rawDb: any, dbPath: string) {
    this.rawDb = rawDb;
    this.dbPath = dbPath;
  }

  save() {
    try {
      const data = this.rawDb.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  private debounceSave() {
    this.save();
  }

  exec(sql: string) {
    try {
      this.rawDb.exec(sql);
      this.save();
    } catch (err) {
      console.error('db.exec error:', err);
      throw err;
    }
  }

  pragma(sql: string) {
    try {
      return this.rawDb.exec(`PRAGMA ${sql}`);
    } catch {
      return [];
    }
  }

  prepare(sql: string) {
    const rawDb = this.rawDb;
    const self = this;

    const normalizeParams = (params: any[]) => {
      if (params.length === 1 && Array.isArray(params[0])) {
        return params[0];
      }
      return params;
    };

    return {
      all(...rawParams: any[]): any[] {
        const params = normalizeParams(rawParams);
        const stmt = rawDb.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        const results: any[] = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },

      get(...rawParams: any[]): any {
        const params = normalizeParams(rawParams);
        const stmt = rawDb.prepare(sql);
        if (params.length > 0) {
          stmt.bind(params);
        }
        let result: any = undefined;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        return result;
      },

      run(...rawParams: any[]): { lastInsertRowid: number; changes: number } {
        const params = normalizeParams(rawParams);
        if (params.length > 0) {
          rawDb.run(sql, params);
        } else {
          rawDb.run(sql);
        }
        self.debounceSave();

        let lastInsertRowid = 0;
        let changes = 0;
        try {
          if (typeof rawDb.getRowsModified === 'function') {
            changes = rawDb.getRowsModified();
          }
        } catch {}
        try {
          const rowIdRes = rawDb.exec('SELECT last_insert_rowid() as id');
          if (rowIdRes.length > 0 && rowIdRes[0].values.length > 0) {
            lastInsertRowid = rowIdRes[0].values[0][0];
          }
          if (changes === 0) {
            const changesRes = rawDb.exec('SELECT changes() as c');
            if (changesRes.length > 0 && changesRes[0].values.length > 0) {
              changes = changesRes[0].values[0][0];
            }
          }
        } catch {}

        return { lastInsertRowid, changes: changes || 1 };
      }
    };
  }
}

const SQL = await initSqlJs();
const DB_PATH = path.join(process.cwd(), 'sami_database.sqlite');
let fileBuffer: Buffer | null = null;
if (fs.existsSync(DB_PATH)) {
  fileBuffer = fs.readFileSync(DB_PATH);
}
const rawDb = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
export const db = new SqlJsDatabase(rawDb, DB_PATH);

db.pragma('foreign_keys = ON');

export function initDatabase() {
  console.log('📦 Initializing Database at:', DB_PATH);

  // 1. Admins Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure default master admin exists
  try {
    const existingAdmin = db.prepare('SELECT id FROM admins LIMIT 1').get();
    if (!existingAdmin) {
      const defaultHash = bcrypt.hashSync('SamiMaster@2026', 10);
      db.prepare(`
        INSERT INTO admins (name, email, password, role)
        VALUES (?, ?, ?, 'admin')
      `).run('Sami Ur Rehman', 'sami@ecomwithsami.com', defaultHash);
      console.log('✅ Default master admin seeded: sami@ecomwithsami.com / SamiMaster@2026');
    }
  } catch (err) {
    console.error('Error ensuring master admin:', err);
  }

  // Helper to ensure new columns exist without breaking existing database
  function addColumnIfNotExists(table: string, column: string, typeDef: string) {
    try {
      const tableInfo = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
      const exists = tableInfo.some((col: any) => col.name === column);
      if (!exists) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeDef}`);
        console.log(`+ Added column ${column} to table ${table}`);
      }
    } catch (err) {
      console.error(`Failed checking/adding column ${column} to ${table}:`, err);
    }
  }

  // 2. Users / Students Table (LMS & Student Login)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      city TEXT,
      password TEXT NOT NULL,
      access_code TEXT,
      current_session_token TEXT,
      last_login_ip TEXT,
      device_info TEXT,
      role TEXT DEFAULT 'student',
      status TEXT DEFAULT 'active', -- active, suspended
      external_user_id TEXT,
      last_active_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  addColumnIfNotExists('users', 'access_code', 'TEXT');
  addColumnIfNotExists('users', 'current_session_token', 'TEXT');
  addColumnIfNotExists('users', 'last_login_ip', 'TEXT');
  addColumnIfNotExists('users', 'device_info', 'TEXT');
  addColumnIfNotExists('users', 'security_strikes', 'INTEGER DEFAULT 0');
  addColumnIfNotExists('users', 'suspended_reason', 'TEXT');
  addColumnIfNotExists('users', 'last_strike_at', 'DATETIME');

  // 2.1. Security Logs Table (Anti-Piracy Strike Audit Trail)
  db.exec(`
    CREATE TABLE IF NOT EXISTS security_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      event_type TEXT NOT NULL, -- screenshot, screen_recording, devtools, visibility_blur
      strike_count INTEGER NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Courses Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      price REAL NOT NULL DEFAULT 3900,
      original_price REAL DEFAULT 32500,
      discount_percentage INTEGER DEFAULT 88,
      duration_hours INTEGER DEFAULT 8,
      total_lectures INTEGER DEFAULT 36,
      badge TEXT DEFAULT 'PAKISTAN’S #1 UAE/KSA DROPSHIPPING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Modules Table (11 Modules Curriculum)
  db.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      module_number TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );
  `);

  // 5. Lessons Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      video_type TEXT DEFAULT 'bunny', -- bunny, vdocipher, direct, embed
      bunny_video_id TEXT,
      vdocipher_id TEXT,
      duration TEXT DEFAULT '15:00',
      attachment_path TEXT,
      offline_zip_url TEXT,
      notes TEXT,
      sort_order INTEGER DEFAULT 0,
      is_preview INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    );
  `);

  addColumnIfNotExists('lessons', 'video_type', "TEXT DEFAULT 'bunny'");
  addColumnIfNotExists('lessons', 'vdocipher_id', 'TEXT');
  addColumnIfNotExists('lessons', 'notes', 'TEXT');

  // 6. User Learning Progress Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );
  `);

  // 7. Enrollment Requests Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS enrollment_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollment_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      hear_source TEXT,
      course_id INTEGER DEFAULT 1,
      payment_method TEXT NOT NULL, -- easypaisa, meezan_bank, card, binance_crypto
      amount REAL NOT NULL DEFAULT 3900,
      currency TEXT DEFAULT 'PKR',
      screenshot_path TEXT,
      transaction_id TEXT,
      status TEXT DEFAULT 'pending', -- pending, approved, rejected, on_hold
      admin_note TEXT,
      user_id INTEGER,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    );
  `);

  // 8. Orders Table (E-commerce / Student purchases)
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      course_id INTEGER,
      enrollment_request_id INTEGER,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'PKR',
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'Pending', -- Pending, Paid, Shipped, Cancelled
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY (enrollment_request_id) REFERENCES enrollment_requests(id) ON DELETE SET NULL
    );
  `);

  // 9. Store Products / Inventory Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock_level INTEGER DEFAULT 100,
      stock_status TEXT DEFAULT 'In Stock', -- In Stock, Low Stock, Digital / Unlimited
      image_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Platform Settings & Configurations
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // 11. Testimonials & Student Proofs
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'Student',
      city TEXT DEFAULT 'Karachi',
      earning_text TEXT,
      video_url TEXT,
      screenshot_url TEXT,
      rating INTEGER DEFAULT 5,
      comment TEXT NOT NULL,
      is_featured INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 12. Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 13. Tracking Pixels Table (Meta, Google, TikTok, Snapchat, Custom)
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracking_pixels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform_name TEXT NOT NULL, -- Meta Pixel, Google Analytics 4, TikTok Pixel, Snapchat Pixel, Pinterest Pixel, Custom Script
      pixel_id TEXT,
      custom_code TEXT,
      is_active INTEGER DEFAULT 1, -- 1 = active, 0 = inactive
      placement TEXT DEFAULT 'head', -- 'head' or 'body'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 14. Full-Site Dynamic CMS Sections Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cms_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_key TEXT UNIQUE NOT NULL, -- hero, marquee, metrics, why_dropshipping, mentor, bonuses, faqs, contact, payment_accounts
      title TEXT NOT NULL,
      content_json TEXT NOT NULL, -- Full JSON payload containing all dynamic fields
      is_visible INTEGER DEFAULT 1, -- 1 = active, 0 = hidden on live storefront
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 15. Student Video Reviews & Proofs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Karachi',
      market TEXT NOT NULL DEFAULT 'UAE Market',
      sales_text TEXT NOT NULL, -- e.g. "€662 in 6 Days", "AED 5,000 / Week"
      orders_text TEXT NOT NULL DEFAULT '24 Orders',
      quote TEXT NOT NULL,
      video_url TEXT,
      thumbnail_url TEXT,
      rating INTEGER DEFAULT 5,
      is_featured INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 16. Site Blog Posts & Announcements Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      author TEXT DEFAULT 'Mentor Sami',
      image_url TEXT,
      tags TEXT DEFAULT 'E-Commerce, Dropshipping, UAE',
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 17. Dynamic Payment Methods & Receiving Accounts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      method_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'bank', -- bank, wallet, crypto, card, custom
      badge TEXT DEFAULT '',
      account_title TEXT DEFAULT '',
      account_number TEXT DEFAULT '',
      iban_or_wallet TEXT DEFAULT '',
      checkout_url TEXT DEFAULT '',
      instructions TEXT DEFAULT '',
      price_display TEXT DEFAULT 'PKR 3,900',
      is_active INTEGER DEFAULT 1, -- 1 = active, 0 = disabled / hidden
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // 0. Seed Default Tracking Pixels if table empty
  const pixelCount = db.prepare('SELECT count(*) as count FROM tracking_pixels').get() as { count: number };
  if (pixelCount.count === 0) {
    const insertPixel = db.prepare(`
      INSERT INTO tracking_pixels (platform_name, pixel_id, custom_code, is_active, placement)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertPixel.run('Meta Pixel', '1084920489382109', null, 1, 'head');
    insertPixel.run('TikTok Pixel', 'CTIKTOK992019482', null, 1, 'head');
    insertPixel.run('Google Analytics 4', 'G-SAMI2026ECOM', null, 1, 'head');
    insertPixel.run('Snapchat Pixel', 'SNAP-893012-TRK', null, 0, 'head');
    console.log('📊 Default Tracking Pixels Seeded (Meta, TikTok, GA4, Snapchat).');
  }
  // 1. Seed Admin
  const adminCount = db.prepare('SELECT count(*) as count FROM admins').get() as { count: number };
  if (adminCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO admins (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('Sami Admin', 'admin@samiecom.com', hashedPassword, 'admin');
    console.log('👑 Default Admin Created: admin@samiecom.com / admin123');
  }

  // 2. Seed Settings
  const defaultSettings: Record<string, string> = {
    store_name: 'Ecom With Sami',
    contact_email: 'support@ecomwithsami.com',
    contact_phone: '+92 333 0093269',
    display_phone: '+92 333 0093269',
    whatsapp_number: '923330093269',
    admin_whatsapp: '+92 333 0093269',
    whatsapp_group_link: 'https://chat.whatsapp.com/sami-mentorship-mastermind',
    whatsapp_default_message: 'Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?',
    support_hours: 'Mon–Sat, 9:00 AM – 5:00 PM PKT',
    head_office: 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
    regional_office: 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)',
    base_currency: 'PKR',
    timezone: 'Asia/Karachi',
    course_fee_pkr: '3900',
    course_fee_usd: '15',
    original_fee_pkr: '32500',
    seats_left: '12',
    announcement_text: '🔥 Ramadan Special: UAE & KSA Dropshipping Course 88% OFF - Enroll for PKR 3,900 Today!',
    // Payment Credentials
    meezan_bank_title: 'SARDAR SAMIULLAH',
    meezan_bank_account: '0015010112560119',
    meezan_bank_iban: 'PK94MEZN0015010112560119',
    easypaisa_title: 'SARDAR SAMIULLAH',
    easypaisa_number: '03481095933',
    binance_pay_id: '243182889',
    binance_name: 'Sami2026',
    // LMS & Security Settings
    lms_title: 'Ecom With Sami - VIP Student Portal',
    lms_announcement: '🔥 Welcome to Sami Mentorship! Watch lectures in sequence and join our weekly live coaching mastermind.',
    lms_watermark_enabled: '1',
    lms_devtools_block_enabled: '1',
    // SMTP Email Settings for Student Access Codes
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_secure: '0',
    smtp_from_name: 'Ecom With Sami Admissions',
    smtp_from_email: 'admissions@ecomwithsami.com'
  };

  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(defaultSettings)) {
    insertSetting.run(k, v);
  }

  // 3. Seed Main Course
  const courseCount = db.prepare('SELECT count(*) as count FROM courses').get() as { count: number };
  if (courseCount.count === 0) {
    db.prepare(`
      INSERT INTO courses (id, title, slug, description, price, original_price, discount_percentage)
      VALUES (1, 'Master UAE & KSA Dropshipping (From Scratch to Scaling)', 'uae-ksa-dropshipping', 'Complete step-by-step masterclass covering Shopify store creation, Facebook/TikTok Ads, winning product hunting, verified UAE/KSA local suppliers, COD delivery, and scaling.', 3900, 32500, 88)
    `).run();
  }

  // 4. Seed 11 Curriculum Modules
  const moduleCount = db.prepare('SELECT count(*) as count FROM modules').get() as { count: number };
  if (moduleCount.count === 0) {
    const modulesData = [
      {
        num: '01',
        title: 'The Right Mindset to Actually Succeed',
        desc: 'Common beginner mistakes, business fundamentals, mental resilience, and daily routine.',
        lessons: [
          { title: 'The common mistakes that make beginners quit early', duration: '12:40' },
          { title: 'Treating your store like a real cash-flow business', duration: '18:15' },
          { title: 'Staying consistent and focused through your first week', duration: '14:20' }
        ]
      },
      {
        num: '02',
        title: 'Set Up Your High-Converting Shopify Store',
        desc: 'Theme customization, premium layout, ChatGPT product description prompts, trust elements.',
        lessons: [
          { title: 'Picking a brand name that customers instantly trust', duration: '15:10' },
          { title: 'Installing and customizing your premium Shopify theme', duration: '24:35' },
          { title: 'High-converting product page layout blueprint', duration: '21:50' },
          { title: 'ChatGPT prompts to write persuasive product descriptions', duration: '16:40' }
        ]
      },
      {
        num: '03',
        title: 'Finding Winning Products (No Paid Tools Needed)',
        desc: 'TikTok Creative Center, Facebook Ad Library, organic spy methods, viral criteria.',
        lessons: [
          { title: 'The 3-point winning product criteria for UAE & KSA', duration: '19:45' },
          { title: 'Spying on profitable ads using TikTok Ad Library', duration: '22:15' },
          { title: 'Finding viral products on Instagram Reels and Pinterest', duration: '17:30' }
        ]
      },
      {
        num: '04',
        title: 'Testing Products the Smart Way (Low Budget)',
        desc: '3-step validation framework, testing spreadsheets, knowing when to kill or scale.',
        lessons: [
          { title: 'Setting up low-budget product validation campaigns', duration: '18:50' },
          { title: 'Reading initial metrics: CPC, CTR, and Add-to-Carts', duration: '20:10' },
          { title: 'Product validation tracking sheet walkthrough', duration: '14:05' }
        ]
      },
      {
        num: '05',
        title: 'TikTok Ads — From First Campaign to Pro',
        desc: 'TikTok Agency Ad account setup, Business Center, Pixel integration, campaign architecture.',
        lessons: [
          { title: 'How to get a TikTok Agency Account for free', duration: '16:20' },
          { title: 'Connecting TikTok Pixel to Shopify flawlessly', duration: '19:40' },
          { title: 'Launching your first test campaign step-by-step', duration: '28:15' },
          { title: 'Analyzing TikTok Ad metrics and identifying winning creatives', duration: '23:30' }
        ]
      },
      {
        num: '06',
        title: 'Facebook & Instagram Ads Mastery (2026 Strategy)',
        desc: 'Meta Business Suite, Conversion API setup, audience targeting, creative testing.',
        lessons: [
          { title: 'Setting up Meta Business Suite & avoiding account bans', duration: '25:10' },
          { title: 'Facebook Pixel + Conversions API (CAPI) setup', duration: '21:00' },
          { title: 'Broad vs Interest targeting in UAE & Saudi Arabia', duration: '24:45' },
          { title: 'Retargeting campaigns to recover abandoned checkouts', duration: '18:30' }
        ]
      },
      {
        num: '07',
        title: 'Making Scroll-Stopping Video Ads on Your Phone',
        desc: '3-second hook formula, AI video scripts, CapCut editing templates, voiceovers.',
        lessons: [
          { title: 'The 3-second hook formula that stops the scroll', duration: '15:25' },
          { title: 'Filming and editing engaging UGC video ads on mobile', duration: '22:10' },
          { title: 'Using AI voiceovers and Arabic subtitles for GCC buyers', duration: '17:40' }
        ]
      },
      {
        num: '08',
        title: '5 Proven Scaling Strategies (CBO & Horizontal Scaling)',
        desc: 'Budget doubling rules, lookalike audiences, Advantage+ campaigns, multi-market expansion.',
        lessons: [
          { title: 'Vertical vs Horizontal scaling explained simply', duration: '20:50' },
          { title: 'Advantage+ Campaign Budget Optimization (CBO) scaling', duration: '26:15' },
          { title: 'Expanding winning products from UAE into Saudi Arabia', duration: '19:30' }
        ]
      },
      {
        num: '09',
        title: 'Turning Visitors Into Real Cash Orders (COD Optimization)',
        desc: 'Cash on Delivery checkout optimization, WhatsApp order confirmation, reducing return rates.',
        lessons: [
          { title: 'Building trust for Cash on Delivery (COD) shoppers', duration: '21:15' },
          { title: 'Setting up 1-click COD checkout forms on Shopify', duration: '18:40' },
          { title: 'Automating WhatsApp order confirmation to boost delivery rate to 85%+', duration: '24:00' }
        ]
      },
      {
        num: '10',
        title: 'Verified UAE & Saudi Arabia Suppliers Directory',
        desc: 'Direct supplier contacts, fast shipping fulfillment centers, private packaging agreements.',
        lessons: [
          { title: 'How local dropshipping fulfillment works in Dubai and Riyadh', duration: '23:10' },
          { title: 'Direct supplier contacts directory & negotiation scripts', duration: '27:45' },
          { title: 'Managing cash flow and courier payouts', duration: '19:15' }
        ]
      },
      {
        num: '11',
        title: 'Lifetime Mentorship & Live Support Ecosystem',
        desc: 'Weekly live coaching calls, community networking, troubleshooting ad accounts.',
        lessons: [
          { title: 'Joining the private Discord and WhatsApp mastermind groups', duration: '11:20' },
          { title: 'How to participate in weekly live ad audits with Sami', duration: '14:50' }
        ]
      }
    ];

    const insertModule = db.prepare(`
      INSERT INTO modules (course_id, module_number, title, description, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertLesson = db.prepare(`
      INSERT INTO lessons (module_id, title, duration, sort_order, bunny_video_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    modulesData.forEach((m, mIdx) => {
      const res = insertModule.run(1, m.num, m.title, m.desc, mIdx + 1);
      const modId = res.lastInsertRowid;
      m.lessons.forEach((l, lIdx) => {
        insertLesson.run(modId, l.title, l.duration, lIdx + 1, `videos/lesson_${m.num}_${lIdx + 1}.mp4`);
      });
    });
    console.log('📚 11 Curriculum Modules and 36 Lessons seeded successfully.');
  }

  // 5. Seed Testimonials & Student Proofs
  const testimonialCount = db.prepare('SELECT count(*) as count FROM testimonials').get() as { count: number };
  if (testimonialCount.count === 0) {
    const testimonials = [
      {
        name: 'Raza Ali',
        city: 'Lahore',
        earning_text: '€662 in 6 days',
        comment: 'After getting mentorship and watching the course, I launched my first test and made €662 in sales within 6 days.',
        video_url: '/assets/testimonials/test_1.mp4'
      },
      {
        name: 'Hamza Tariq',
        city: 'Islamabad',
        earning_text: 'AED 5,000 & 56 orders',
        comment: 'AED 5,000 in sales and 56 orders within 5 days in UAE. The WhatsApp support helped me fix my TikTok pixel instantly.',
        video_url: '/assets/testimonials/test_2.mp4'
      },
      {
        name: 'Bilal Farooq',
        city: 'Karachi',
        earning_text: 'AED 1,485 in 3 days',
        comment: 'Total beginner here. AED 1,485 in sales in just 3 days while working full time from home.',
        video_url: '/assets/testimonials/test_3.mp4'
      },
      {
        name: 'Zainab Bibi',
        city: 'Faisalabad',
        earning_text: 'PKR 450,000/mo',
        comment: 'The Arabic packaging supplier list alone is worth more than the course fee. Best investment ever.',
        video_url: '/assets/testimonials/test_4.mp4'
      }
    ];

    const insertTestimonial = db.prepare(`
      INSERT INTO testimonials (name, city, earning_text, comment, video_url)
      VALUES (?, ?, ?, ?, ?)
    `);
    testimonials.forEach(t => {
      insertTestimonial.run(t.name, t.city, t.earning_text, t.comment, t.video_url);
    });
  }

  // 6. Seed Sample Active Students & Progress
  const userCount = db.prepare("SELECT count(*) as count FROM users WHERE role = 'student'").get() as { count: number };
  if (userCount.count === 0) {
    const sampleHashed = bcrypt.hashSync('student123', 10);
    const sampleStudents = [
      { name: 'Muhammad Ahmed', email: 'ahmed.student@gmail.com', phone: '+923001234567', city: 'Karachi' },
      { name: 'Usman Ghani', email: 'usman.dropship@gmail.com', phone: '+923219876543', city: 'Lahore' },
      { name: 'Sara Khan', email: 'sara.k@gmail.com', phone: '+923335557788', city: 'Islamabad' },
      { name: 'Ali Raza', email: 'aliraza.ecom@gmail.com', phone: '+923451122334', city: 'Rawalpindi' },
      { name: 'Farhan Zaheer', email: 'farhan.z@gmail.com', phone: '+923124455667', city: 'Peshawar' }
    ];

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, phone, city, password, role, status, last_active_at)
      VALUES (?, ?, ?, ?, ?, 'student', 'active', DATETIME('now', '-2 hours'))
    `);
    const insertProgress = db.prepare(`
      INSERT OR IGNORE INTO user_progress (user_id, lesson_id) VALUES (?, ?)
    `);

    sampleStudents.forEach((s, idx) => {
      const uRes = insertUser.run(s.name, s.email, s.phone, s.city, sampleHashed);
      const uId = uRes.lastInsertRowid;
      // Mark first 4 to 8 lessons complete for realistic progress
      const lessonsToComplete = 3 + (idx * 3);
      for (let lId = 1; lId <= lessonsToComplete; lId++) {
        insertProgress.run(uId, lId);
      }
    });

    // Seed Sample Enrollment Requests
    const insertEnrollment = db.prepare(`
      INSERT INTO enrollment_requests (enrollment_id, first_name, last_name, email, phone, city, hear_source, payment_method, amount, status, reviewed_by, reviewed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
    `);

    insertEnrollment.run('ENR-2026-001', 'Muhammad', 'Ahmed', 'ahmed.student@gmail.com', '+923001234567', 'Karachi', 'TikTok', 'easypaisa', 3900, 'approved', 'admin@samiecom.com');
    insertEnrollment.run('ENR-2026-002', 'Usman', 'Ghani', 'usman.dropship@gmail.com', '+923219876543', 'Lahore', 'YouTube', 'meezan_bank', 3900, 'approved', 'admin@samiecom.com');
    insertEnrollment.run('ENR-2026-003', 'Sara', 'Khan', 'sara.k@gmail.com', '+923335557788', 'Islamabad', 'Facebook', 'card', 3900, 'approved', 'admin@samiecom.com');
    insertEnrollment.run('ENR-2026-004', 'Kamran', 'Akmal', 'kamran.ak@gmail.com', '+923019988776', 'Multan', 'Instagram', 'easypaisa', 3900, 'pending', null);
    insertEnrollment.run('ENR-2026-005', 'Hassan', 'Nawaz', 'hassan.n@gmail.com', '+923447766554', 'Faisalabad', 'TikTok', 'meezan_bank', 3900, 'pending', null);
    insertEnrollment.run('ENR-2026-006', 'Tariq', 'Mehmood', 'tariq.m@gmail.com', '+923223344556', 'Sialkot', 'YouTube', 'binance_crypto', 3900, 'on_hold', 'admin@samiecom.com');

    // Seed Sample Orders
    const insertOrder = db.prepare(`
      INSERT INTO orders (order_number, amount, payment_method, status, customer_name, customer_email, customer_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run('ORD-9021', 3900, 'Easypaisa', 'Paid', 'Muhammad Ahmed', 'ahmed.student@gmail.com', '+923001234567');
    insertOrder.run('ORD-9022', 3900, 'Meezan Bank', 'Paid', 'Usman Ghani', 'usman.dropship@gmail.com', '+923219876543');
    insertOrder.run('ORD-9023', 3900, 'Credit Card', 'Paid', 'Sara Khan', 'sara.k@gmail.com', '+923335557788');
    insertOrder.run('ORD-9024', 3900, 'Easypaisa', 'Pending', 'Kamran Akmal', 'kamran.ak@gmail.com', '+923019988776');
    insertOrder.run('ORD-9025', 3900, 'Meezan Bank', 'Pending', 'Hassan Nawaz', 'hassan.n@gmail.com', '+923447766554');

    // Seed Sample Products
    const insertProduct = db.prepare(`
      INSERT INTO products (sku, name, category, price, stock_level, stock_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertProduct.run('COURSE-UAE-01', 'UAE & KSA Dropshipping Mastery', 'Online Course', 3900, 999, 'Digital / Unlimited');
    insertProduct.run('THEME-ECOM-PRO', 'Ultra-Fast Dropshipping Shopify Theme', 'Software', 4500, 999, 'Digital / Unlimited');
    insertProduct.run('EBOOK-FB-ADS', 'Facebook Zero-To-Hero Master Guide', 'E-Book', 1500, 999, 'Digital / Unlimited');
    insertProduct.run('TOOL-PL-CALC', 'Dropshipping P&L Margin Calculator Pro', 'Tool', 1200, 999, 'Digital / Unlimited');

    console.log('✅ Sample Students, Orders, Products, and Enrollment requests created.');
  }

  // 6. Seed Dynamic CMS Sections, Reviews & Blogs
  seedCmsData();
}

function seedCmsData() {
  const sectionCount = db.prepare('SELECT count(*) as count FROM cms_sections').get() as { count: number };
  if (sectionCount.count === 0) {
    const insertSection = db.prepare(`
      INSERT INTO cms_sections (section_key, title, content_json, is_visible)
      VALUES (?, ?, ?, 1)
    `);

    // 1. Hero Section
    insertSection.run('hero', 'Hero Banner & Video Preview', JSON.stringify({
      badge: 'PAKISTAN’S #1 UAE & KSA DROPSHIPPING TRAINING',
      title: 'Learn how to start an online dropshipping store in UAE & KSA',
      highlight_text: 'step-by-step training',
      subtitle: 'Beginner friendly practical training from basics to high-profit ad scaling. No expensive software or company registration required.',
      video_title: 'Watch this 128 seconds video to learn how easy it is to start',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      video_thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
      cta_text: 'YES! I WANT TO LEARN THIS',
      cta_subtext: 'Trusted by 9,700+ Pakistani Students',
      original_price: '32,500 PKR',
      discount_price: '3,900 PKR',
      discount_percentage: '88% OFF'
    }));

    // 2. Top Marquee Section
    insertSection.run('marquee', 'Top Announcement Marquee', JSON.stringify({
      is_active: true,
      items: [
        '🔥 Master UAE & KSA Shopify Dropshipping',
        '⚡ 88% OFF Today',
        '💰 Just PKR 3,900',
        '🔒 Lifetime LMS Portal Access',
        '📱 WhatsApp Mentorship (9AM–5PM)',
        '🏆 9,700+ Students Trained',
        '🚀 Verified Suppliers Directory Included',
        '🎁 Free Bonuses Worth Rs 30,000+'
      ]
    }));

    // 3. 4-Metrics Bar
    insertSection.run('metrics_bar', '4-Metric Value Bar', JSON.stringify({
      items: [
        { icon: 'Clock', title: '8 Hours', subtitle: 'Of practical training', color: 'var(--primary)' },
        { icon: 'Tv', title: '36 Lectures', subtitle: 'Ultra-HD video lessons', color: 'var(--accent-green)' },
        { icon: 'Lock', title: 'Lifetime Access', subtitle: 'Web, Windows & APK', color: 'var(--accent-amber)' },
        { icon: 'Users', title: 'Mentorship', subtitle: 'Direct WhatsApp included', color: '#EC4899' }
      ]
    }));

    // 4. Why Dropshipping
    insertSection.run('why_dropshipping', 'Why Dropshipping In 2026', JSON.stringify({
      tag: 'THE BEST OPPORTUNITY IN 2026',
      title: 'Why Dropshipping Is the Smartest Online Business Right Now',
      highlight_word: 'Smartest',
      subtitle: 'No big investment, no office, no inventory risk. Start with minimal capital right from your laptop or phone.',
      items: [
        { icon: 'MapPin', title: 'Work From Anywhere', desc: 'Run your Gulf store from your bedroom in Karachi, a cafe in Lahore, or anywhere in Pakistan.' },
        { icon: 'Building2', title: 'No Company Registration', desc: 'No expensive legal paperwork, trade licenses, or corporate setup needed to begin.' },
        { icon: 'Package', title: 'Zero Inventory, Zero Risk', desc: 'You never buy stock upfront. Your supplier ships only after a customer places an order.' },
        { icon: 'CreditCard', title: 'Get Paid in Local Bank', desc: 'Withdraw your earned profit straight to your Pakistani bank account or Payoneer.' }
      ]
    }));

    // 5. Mentor Profile
    insertSection.run('mentor_profile', 'Mentor Profile & Credentials', JSON.stringify({
      tag: 'YOUR MENTOR',
      name: 'Sami Ur Rehman',
      title: 'Digital E-Commerce & Ads Expert',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'You don’t just need a course — you need direct mentorship and an active community. I will personally guide you through product hunting, supplier negotiations, and high-converting TikTok/Facebook ads.',
      benefits: [
        'Lifetime WhatsApp Support',
        'Private Facebook Mastermind',
        'Verified UAE & KSA Suppliers',
        'Weekly Live Ad Audits'
      ],
      stats: [
        { number: '9,700+', label: 'Students Mentored', color: 'var(--primary)' },
        { number: 'UAE & KSA', label: 'Market Focus', color: 'var(--accent-green)' },
        { number: 'Lifetime', label: 'Access & Updates', color: 'var(--accent-amber)' }
      ]
    }));

    // 6. Free Bonus Stack (Rs 30,000+)
    insertSection.run('bonuses', 'Free Bonus Stack (Rs 30,000+)', JSON.stringify({
      tag: '🎁 FREE BONUSES',
      title: 'Free Bonuses Worth',
      highlight_value: 'Rs 30,000+',
      subtitle: 'Get these exclusive tools, resources, and live guidance absolutely FREE with your enrollment today.',
      total_value_text: 'Total Bonus Value: Rs 30,000+ • Yours FREE Today',
      items: [
        { title: 'Weekly 2-Hour Live Mentorship Class', desc: 'Join live training every week to ask questions, review results & stay on track.', value: 'Rs 8,000' },
        { title: 'Live Ad Campaign Audits', desc: 'Get your TikTok & Meta ad campaigns reviewed live so you never waste ad spend.', value: 'Rs 6,500' },
        { title: 'Facebook Zero-To-Hero Master E-Book', desc: 'Complete visual blueprint taking you from total beginner to confident advertiser.', value: 'Rs 4,500' },
        { title: 'Dropshipping Profit & Loss Margin Calculator', desc: 'Know your real numbers and ROAS before launching ads.', value: 'Rs 3,000' },
        { title: 'Premium Shopify Fast Conversion Themes', desc: 'Ready-to-use high converting themes so your store looks world-class instantly.', value: 'Rs 5,000' },
        { title: '30+ High-Converting AI Ad Prompts Pack', desc: 'Pre-engineered ChatGPT prompts for killer hooks, ad copy & descriptions.', value: 'Rs 3,000' }
      ]
    }));

    // 7. Payment Accounts & Banks
    insertSection.run('payment_accounts', 'Payment Methods & Bank Accounts', JSON.stringify({
      deposit_fee: '3,900',
      easypaisa: {
        account_title: 'SARDAR SAMIULLAH',
        account_number: '03481095933',
        is_recommended: true
      },
      jazzcash: {
        account_title: 'SARDAR SAMIULLAH',
        account_number: '03481095933'
      },
      upaisa: {
        account_title: 'SARDAR SAMIULLAH',
        account_number: '03481095933'
      },
      meezan_bank: {
        account_title: 'SARDAR SAMIULLAH',
        account_number: '0015010112560119',
        iban: 'PK94MEZN0015010112560119'
      },
      international_card: {
        whop_url: 'https://whop.com/checkout/plan_DsfaeyFcXlCwI',
        price_usd: '15'
      },
      binance_crypto: {
        binance_nickname: 'Sami2026',
        binance_pay_id: '243182889',
        bep20_wallet: '0xae8da71c3ad92406e69edc24219918ea58c00dac',
        network: 'BSC / BNB Smart Chain (BEP20)'
      }
    }));

    // 8. Contact & WhatsApp Info
    insertSection.run('contact_info', 'Contact Channels & WhatsApp', JSON.stringify({
      whatsapp_number: '923330093269',
      display_phone: '+92 333 0093269',
      email: 'support@ecomwithsami.com',
      support_hours: 'Mon–Sat, 9:00 AM – 5:00 PM PKT',
      head_office: 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
      regional_office: 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)'
    }));

    // 9. FAQs Section
    insertSection.run('faqs', 'Frequently Asked Questions', JSON.stringify({
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about the mentorship program.',
      items: [
        { q: 'Do I need a lot of money or inventory to start?', a: 'No! With dropshipping, you never buy products in advance. Your verified supplier in the UAE or Saudi Arabia only ships after a customer places an order on your store.' },
        { q: 'I am a complete beginner with zero computer skills. Can I do this?', a: 'Absolutely. The entire 11-module course is created in simple Urdu/Hindi from complete scratch. We show every single click on the screen.' },
        { q: 'How do I receive payments from customers in UAE and Saudi Arabia?', a: 'In the Gulf market, 80%+ of customers order via Cash on Delivery (COD). Local courier companies collect cash at the customer doorstep and transfer your profit directly into your Pakistani bank account.' },
        { q: 'How does the WhatsApp Mentorship work?', a: 'Whenever you get stuck while building your store, finding products, or setting up your TikTok pixel, you can message our dedicated support team on WhatsApp from 9 AM to 5 PM for instant guidance.' },
        { q: 'How do I access the lectures after enrolling?', a: 'As soon as your enrollment is approved, you get instant login access to our web portal and can also download our dedicated Windows Desktop App or Android APK for smooth HD lecture streaming.' }
      ]
    }));

    console.log('📄 Default Dynamic CMS Sections Initialized.');
  }

  // Seed Default Student Video Reviews & Proofs
  const reviewCount = db.prepare('SELECT count(*) as count FROM site_reviews').get() as { count: number };
  if (reviewCount.count === 0) {
    const insertReview = db.prepare(`
      INSERT INTO site_reviews (student_name, city, market, sales_text, orders_text, quote, video_url, thumbnail_url, rating, is_featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);

    insertReview.run('Raza Ali', 'Lahore', 'UAE & Europe', '€662 in 6 Days', '24 Orders', 'Launched my first TikTok test ad campaign following Sami’s hook formula. First sale within 18 hours!', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80', 5, 1);
    insertReview.run('Hamza Tariq', 'Islamabad', 'UAE Market', 'AED 5,000 / Week', '56 Orders', 'The direct supplier contacts in Dubai changed everything. Fast 2-day delivery and cash flow payout on time.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 5, 2);
    insertReview.run('Bilal Farooq', 'Karachi', 'Saudi Arabia', 'AED 1,485 in 3 Days', '19 Orders', 'Started as a total beginner with zero Shopify knowledge. The 11 modules are so easy and step-by-step.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 5, 3);
    insertReview.run('Usman Ghani', 'Rawalpindi', 'KSA Market', 'AED 8,200', '78 Orders', 'Scaled my product using Advantage+ CBO scaling taught in Module 8. Best investment of my life.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', 5, 4);
    insertReview.run('Saad Ahmed', 'Multan', 'UAE Market', 'PKR 320,000 Profit', '42 Orders', 'Verified suppliers with Arabic packaging makes local buyers trust the store. Return rate dropped to 11%.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80', 5, 5);
    insertReview.run('Zainab Bibi', 'Faisalabad', 'UAE & KSA', 'PKR 480,000 / Mo', '110+ Orders', 'The WhatsApp mentorship answered every question I had during my ad setup. Never felt alone.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', 5, 6);

    console.log('🌟 Default Student Video Reviews & Proofs Seeded.');
  }

  // Seed Default Blog Posts / Announcements
  const blogCount = db.prepare('SELECT count(*) as count FROM site_blogs').get() as { count: number };
  if (blogCount.count === 0) {
    const insertBlog = db.prepare(`
      INSERT INTO site_blogs (title, slug, excerpt, content, author, image_url, tags, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertBlog.run(
      'How to Scale UAE Dropshipping Ads to AED 10,000/Month in 2026',
      'how-to-scale-uae-dropshipping-ads-2026',
      'Learn the exact TikTok and Meta ad testing framework to scale profitably in the Gulf region with minimal ad spend.',
      'Dropshipping in the UAE and Saudi Arabia is currently experiencing massive growth due to high purchasing power and low competition compared to Western markets. In this comprehensive guide, we explore product testing, TikTok Spark Ads, and local courier cash collection.',
      'Mentor Sami',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'UAE Dropshipping, TikTok Ads, Scaling'
    );

    insertBlog.run(
      'Top 5 High-Demand Winning Niches for Saudi Arabia (KSA)',
      'top-5-winning-niches-saudi-arabia',
      'Discover the highest ROI product categories for the Saudi Arabian e-commerce market with fast local courier delivery.',
      'Saudi Arabia has one of the highest online transaction averages in the Middle East. When selecting products for KSA, focusing on seasonal lifestyle products, car accessories, and home organization provides unbeatable conversion rates.',
      'Mentor Sami',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
      'Saudi Arabia, Product Hunting, E-Commerce'
    );

    console.log('✍️ Default Blog Posts & News Articles Seeded.');
  }

  // Seed Default Dynamic Payment Methods & Receiving Accounts
  const paymentMethodCount = db.prepare('SELECT count(*) as count FROM payment_methods').get() as { count: number };
  if (paymentMethodCount.count === 0) {
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

    console.log('💳 Default Dynamic Payment Methods Seeded.');
  }

  // Seed Default Student Account
  const studentCount = db.prepare("SELECT count(*) as count FROM users WHERE role = 'student'").get() as { count: number };
  if (studentCount.count === 0) {
    const studentPasswordHash = bcrypt.hashSync('student123', 10);
    db.prepare(`
      INSERT INTO users (name, email, phone, city, password, access_code, role, status)
      VALUES (?, ?, ?, ?, ?, ?, 'student', 'active')
    `).run('Muhammad Hamza', 'student@ecomwithsami.com', '03001234567', 'Lahore', studentPasswordHash, 'SAMI123456');
    console.log('🎓 Default Active Student Seeded (student@ecomwithsami.com / SAMI123456).');
  }
}
