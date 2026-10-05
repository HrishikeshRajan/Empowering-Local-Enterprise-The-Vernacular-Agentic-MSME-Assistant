import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import { agentRouter } from './agent/agentRouter.js';
import { voiceRouter } from './voice/voiceRouter.js';
import { invoiceRouter } from './invoices/invoiceRouter.js';
import { whatsappRouter } from './whatsapp/whatsappRouter.js';
import { inventoryRouter } from './inventory/inventoryRouter.js';
import { appointmentsRouter } from './appointments/appointmentsRouter.js';
import { settingsRouter } from './settings/settingsRouter.js';
import { healthRouter } from './health/healthRouter.js';
import { authRouter } from './auth/authRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow fonts/images from same server
  contentSecurityPolicy: false,                           // CSP handled by frontend meta tag
}));

// ── CORS — restrict to known origins only ─────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests (curl, Postman) only in dev
    if (!origin && !IS_PROD) return cb(null, true);
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
// General: 120 requests per minute per IP
app.use('/api', rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' },
}));

// Strict: agent processing — 20 per minute (prevents reflection loop spam)
app.use('/api/agent/process', rateLimit({
  windowMs: 60_000,
  max: 20,
  message: { error: 'Agent rate limit reached. Wait a moment.' },
}));

// Strict: WhatsApp send — 30 per minute
app.use('/api/whatsapp/send', rateLimit({
  windowMs: 60_000,
  max: 30,
  message: { error: 'WhatsApp send rate limit reached.' },
}));

// ── Logging — only in development ────────────────────────────────────────────
if (!IS_PROD) {
  app.use(morgan('dev'));
}

// ── Body parsing — tight global limit, per-route overrides for file uploads ──
// File upload routes (voice, invoice) use multer with their own limits.
// All other JSON endpoints get a strict 100kb cap.
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// ── Root info ─────────────────────────────────────────────────────────────────
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'Vernacular Agentic MSME Assistant API',
    version: '1.0.0',
    endpoints: {
      agent:        '/api/agent (POST /process, GET /logs, POST /override, GET /stream)',
      voice:        '/api/voice (POST /transcribe, GET /presets)',
      invoices:     '/api/invoices (GET /, POST /parse, POST /:id/verify)',
      whatsapp:     '/api/whatsapp (GET|POST /webhook, GET /conversations, POST /send)',
      inventory:    '/api/inventory (GET /, GET /alerts, POST /, PUT /:id, DELETE /:id)',
      appointments: '/api/appointments (GET /, POST /, PATCH /:id/status)',
      settings:     '/api/settings (GET /, PUT /profile, PUT /preferences)',
      health:       '/api/health (GET /)',
    },
  });
});

// ── Routers ───────────────────────────────────────────────────────────────────
app.use('/api/agent',        agentRouter);
app.use('/api/voice',        voiceRouter);
app.use('/api/invoices',     invoiceRouter);
app.use('/api/whatsapp',     whatsappRouter);
app.use('/api/inventory',    inventoryRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/settings',     settingsRouter);
app.use('/api/health',       healthRouter);
app.use('/api/auth',         authRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Global error handler — never leak stack traces in production ───────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = IS_PROD ? 'Something went wrong' : (err.message || 'Internal Server Error');
  if (!IS_PROD) console.error('[Unhandled API Error]:', err);
  res.status(status).json({ error: message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`🚀 Kada Backend running on http://localhost:${PORT}`);
  console.log(`📡 API Root:      http://localhost:${PORT}/api`);
  console.log(`🌍 Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log(`================================================================\n`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  console.log(`[${signal}] Shutting down gracefully…`);
  server.close(() => process.exit(0));
  // Force exit after 10s if connections don't drain
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

export default app;
