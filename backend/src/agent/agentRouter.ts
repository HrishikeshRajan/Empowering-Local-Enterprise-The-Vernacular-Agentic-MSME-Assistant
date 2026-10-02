import { Router, type Request, type Response } from 'express';
import { reflectionEngine } from './reflectionEngine.js';
import { store } from '../data/store.js';

export const agentRouter = Router();

// Store active SSE clients
const sseClients: Response[] = [];

export function broadcastAgentEvent(data: any) {
  sseClients.forEach(client => {
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      // client disconnected
    }
  });
}

/**
 * POST /api/agent/process
 * Run prompt through the Reflection Loop
 */
agentRouter.post('/process', async (req: Request, res: Response) => {
  try {
    const { inputPrompt, inputPromptMl, inputType = 'voice', language = 'ml', presetId } = req.body;

    if (!inputPrompt && !presetId) {
      return res.status(400).json({ error: 'inputPrompt or presetId is required' });
    }

    let finalPrompt = inputPrompt;
    let finalPromptMl = inputPromptMl;

    if (presetId) {
      const preset = store.getVoicePresets().find(p => p.id === presetId);
      if (preset) {
        finalPrompt = preset.englishTranslation;
        finalPromptMl = preset.malayalamAudioText;
      }
    }

    const result = await reflectionEngine.executeWithReflection({
      inputPrompt: finalPrompt,
      inputPromptMl: finalPromptMl,
      inputType,
      language
    });

    // Notify connected SSE stream subscribers
    broadcastAgentEvent({
      type: 'TASK_COMPLETED',
      task: result.taskLog,
      attempts: result.attempts
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[AgentRouter] Error processing request:', error);
    return res.status(500).json({ error: error.message || 'Internal agent error' });
  }
});

/**
 * GET /api/agent/logs
 * Retrieve task execution logs
 */
agentRouter.get('/logs', (_req: Request, res: Response) => {
  const logs = store.getTaskLogs();
  return res.status(200).json(logs);
});

/**
 * GET /api/agent/logs/:id
 * Retrieve specific task execution log with its steps
 */
agentRouter.get('/logs/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const log = store.getTaskLog(id);
  if (!log) {
    return res.status(404).json({ error: 'Task log not found' });
  }
  return res.status(200).json(log);
});

/**
 * POST /api/agent/override
 * Manual override for flagged agent actions
 */
agentRouter.post('/override', (req: Request, res: Response) => {
  const { id, status, reason = 'Approved manually by merchant' } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: 'id and status are required' });
  }

  const updated = store.overrideTaskLog(id, status, reason);
  if (!updated) {
    return res.status(404).json({ error: 'Task log not found' });
  }

  broadcastAgentEvent({
    type: 'TASK_OVERRIDDEN',
    task: updated
  });

  return res.status(200).json(updated);
});

/**
 * GET /api/agent/stream
 * Server-Sent Events (SSE) for real-time agent execution step updates
 */
agentRouter.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Agent SSE stream ready' })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) {
      sseClients.splice(idx, 1);
    }
  });
});
