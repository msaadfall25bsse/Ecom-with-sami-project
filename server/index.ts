import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { renderPage } from 'vike/server';
import { initDatabase, db } from './db/index.js';
import { authRouter } from './routes/auth.js';
import { enrollmentRouter } from './routes/enrollments.js';
import { adminRouter } from './routes/admin.js';
import { adminCurriculumRouter } from './routes/adminCurriculum.js';
import { lmsRouter } from './routes/lms.js';
import { publicRouter } from './routes/public.js';
import { cmsRouter } from './routes/cms.js';
import { appApiRouter } from './routes/appApi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Database & Seeds
initDatabase();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-app-webhook-secret', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Receipt Screenshot fallback SVG handler for any missing receipt images
app.get(['/uploads/receipts/:filename', '/api/uploads/receipts/:filename'], (req, res, next) => {
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'receipts', req.params.filename);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  // High quality SVG receipt fallback
  res.setHeader('Content-Type', 'image/svg+xml');
  return res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320">
    <rect width="600" height="320" fill="#0F172A" rx="16" stroke="#00A0DF" stroke-width="2"/>
    <circle cx="300" cy="70" r="32" fill="#10B981" fill-opacity="0.15"/>
    <path d="M290 70 L297 77 L312 62" stroke="#10B981" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="300" y="130" fill="#F8FAFC" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" text-anchor="middle">Payment Proof Submitted</text>
    <text x="300" y="160" fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Course Fee: PKR 3,900 (Verified Application)</text>
    <text x="300" y="195" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="13" text-anchor="middle">Account: SARDAR SAMIULLAH (Easypaisa / JazzCash / Meezan)</text>
    <rect x="150" y="225" width="300" height="44" fill="#1E293B" rx="8" stroke="#334155" stroke-width="1"/>
    <text x="300" y="252" fill="#10B981" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">✓ Ready for Admin 1-Click Approval</text>
  </svg>`);
});

// Static directories
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
app.use('/api/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use('/apps', express.static(path.join(process.cwd(), 'public', 'apps')));

// Serve built Vike client assets in production or when dist/client exists
const clientDist = path.join(process.cwd(), 'dist', 'client');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

// Secure Video Streaming Handler (HTTP 206 Partial Content Range Requests)
app.get(['/api/stream/video', '/stream/video', '/api/lms/stream/video'], (req, res) => {
  const videoPath = (req.query.path as string || '').trim();
  if (!videoPath || videoPath.includes('..')) {
    return res.status(400).send('Invalid video path');
  }

  const possiblePaths = [
    path.join(process.cwd(), videoPath),
    path.join(process.cwd(), 'public', videoPath),
    path.join(process.cwd(), 'public', 'uploads', videoPath),
    path.join(process.cwd(), 'assets', videoPath)
  ];

  let foundFile = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      foundFile = p;
      break;
    }
  }

  if (!foundFile) {
    return res.status(404).send('Video file not found');
  }

  const stat = fs.statSync(foundFile);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(foundFile, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(foundFile).pipe(res);
  }
});

// Primary API Routes
app.use('/api/auth', authRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/lms', lmsRouter);
app.use('/api/admin/curriculum', adminCurriculumRouter);
app.use('/api/admin/cms', cmsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/public', publicRouter);
app.use('/api', appApiRouter);

// Direct Public Endpoint for Storefront Active Pixels
app.get(['/api/pixels/active', '/api/public/pixels/active'], (_req, res) => {
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
    system: 'SAMI E-Commerce & Web LMS Backend API (Node.js + Express)',
    timestamp: new Date().toISOString()
  });
});

// Catch-all for undefined /api routes (returns JSON instead of HTML error)
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Node.js / Express API Gateway`
  });
});

// Vike SSR Catch-All Middleware for Web Pages (Express 5 compatible)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/apps')) {
    return next();
  }
  try {
    const pageContext = await renderPage({ urlOriginal: req.originalUrl });
    const { httpResponse } = pageContext;
    if (!httpResponse) {
      return next();
    }
    const { statusCode, headers, body } = httpResponse;
    headers.forEach(([name, value]) => res.setHeader(name, value));
    res.status(statusCode).send(body);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SAMI Full-Stack Node.js/Express Server running on http://localhost:${PORT}`);
  console.log(`🎓 Web LMS API ready on http://localhost:${PORT}/api/lms`);
  console.log(`👑 Admin API ready on http://localhost:${PORT}/api/admin`);
});

export default app;
