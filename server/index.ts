import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { initDatabase, db } from './db/index.js';
import { authRouter } from './routes/auth.js';
import { enrollmentRouter } from './routes/enrollments.js';
import { adminRouter } from './routes/admin.js';
import { adminCurriculumRouter } from './routes/adminCurriculum.js';
import { lmsRouter } from './routes/lms.js';
import { publicRouter } from './routes/public.js';
import { cmsRouter } from './routes/cms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Seeds
initDatabase();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-app-webhook-secret']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static directories
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/lms', lmsRouter);
app.use('/api/admin/curriculum', adminCurriculumRouter);
app.use('/api/admin/cms', cmsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/public', publicRouter);

// Direct Public Endpoint for Storefront Active Pixels
app.get('/api/pixels/active', (_req, res) => {
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

// Root health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'SAMI E-Commerce & Web LMS Backend API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SAMI Backend Server running on http://localhost:${PORT}`);
  console.log(`🎓 Web LMS API ready on http://localhost:${PORT}/api/lms`);
  console.log(`👑 Admin API ready on http://localhost:${PORT}/api/admin`);
});

export default app;
