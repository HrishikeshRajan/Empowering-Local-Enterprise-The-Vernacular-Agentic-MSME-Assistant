import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { agentRouter } from './agent/agentRouter.js';
import { voiceRouter } from './voice/voiceRouter.js';
import { invoiceRouter } from './invoices/invoiceRouter.js';
import { whatsappRouter } from './whatsapp/whatsappRouter.js';
import { inventoryRouter } from './inventory/inventoryRouter.js';
import { appointmentsRouter } from './appointments/appointmentsRouter.js';
import { settingsRouter } from './settings/settingsRouter.js';
import { healthRouter } from './health/healthRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Allows local dev and cross-origin dashboard requests
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Root welcome & API info
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'Vernacular Agentic MSME Assistant API',
    version: '1.0.0',
    description: 'Autonomous Vernacular Voice & Workflow Assistant for Indian MSMEs',
    endpoints: {
      agent: '/api/agent (POST /process, GET /logs, POST /override, GET /stream)',
      voice: '/api/voice (POST /transcribe, GET /presets)',
      invoices: '/api/invoices (GET /, POST /parse, POST /:id/verify)',
      whatsapp: '/api/whatsapp (GET|POST /webhook, GET /conversations, POST /send)',
      inventory: '/api/inventory (GET /, GET /alerts, POST /, PUT /:id, DELETE /:id)',
      appointments: '/api/appointments (GET /, POST /, PATCH /:id/status)',
      settings: '/api/settings (GET /, PUT /profile, PUT /preferences)',
      health: '/api/health (GET /)'
    }
  });
});

// Mount modular sub-routers
app.use('/api/agent', agentRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/health', healthRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled API Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

const server = app.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`🚀 Vernacular Agentic MSME Assistant Backend API Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📚 API Root: http://localhost:${PORT}/api`);
  console.log(`🤖 Agent Reflection Loop: http://localhost:${PORT}/api/agent`);
  console.log(`🎙️ Whisper Voice Pipeline: http://localhost:${PORT}/api/voice`);
  console.log(`💬 WhatsApp Cloud Webhook: http://localhost:${PORT}/api/whatsapp/webhook`);
  console.log(`📄 Gemini Invoice Vision: http://localhost:${PORT}/api/invoices`);
  console.log(`❤️ Health & Uptime Kuma: http://localhost:${PORT}/api/health`);
  console.log(`================================================================\n`);
});

// Graceful termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down backend gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down backend gracefully...');
  server.close(() => process.exit(0));
});

export default app;
