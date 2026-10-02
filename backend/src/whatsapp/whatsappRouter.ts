import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';
import { reflectionEngine } from '../agent/reflectionEngine.js';

export const whatsappRouter = Router();

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'msme_assistant_webhook_secret_2026';

/**
 * GET /api/whatsapp/webhook
 * Meta WhatsApp Cloud API Webhook Verification Challenge
 */
whatsappRouter.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Meta challenge verification successful.');
    return res.status(200).send(challenge);
  } else {
    console.warn('[WhatsApp Webhook] Verification token mismatch.');
    return res.sendStatus(403);
  }
});

/**
 * POST /api/whatsapp/webhook
 * Meta WhatsApp Cloud API Incoming Message Handler
 * Routes incoming customer message / voice note to Agent Reflection Loop
 */
whatsappRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Check if it is a WhatsApp webhook payload
    if (body.object === 'whatsapp_business_account' || body.entry) {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (value?.messages) {
            for (const msg of value.messages) {
              const senderPhone = msg.from;
              const customerName = value.contacts?.[0]?.profile?.name || 'WhatsApp Customer';
              let text = '';
              let isVoice = false;

              if (msg.type === 'text') {
                text = msg.text?.body || '';
              } else if (msg.type === 'audio') {
                isVoice = true;
                text = 'രാവിലെ വന്ന തക്കാളി 15 കിലോ കൂടി സ്റ്റോക്കിൽ ചേർക്കൂ, വില കിലോയ്ക്ക് 40 രൂപ.'; // Mock transcribed note
              }

              // Record message in store
              let conv = store.findConversationByPhone(senderPhone);
              const convId = conv ? conv.id : `conv-${Date.now()}`;
              store.addMessage(convId, {
                sender: 'customer',
                text,
                textMl: text,
                isVoiceNote: isVoice,
                status: 'read'
              });

              // Process automatically via Agent Reflection loop
              if (text) {
                const agentResult = await reflectionEngine.executeWithReflection({
                  inputPrompt: text,
                  inputType: isVoice ? 'voice' : 'webhook',
                  language: 'ml'
                });

                // Reply back on WhatsApp thread
                store.addMessage(convId, {
                  sender: 'agent',
                  text: agentResult.taskLog.outputSummary,
                  textMl: agentResult.taskLog.outputSummaryMl,
                  status: 'delivered'
                });
              }
            }
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }

    return res.status(200).send('IGNORED');
  } catch (error: any) {
    console.error('[WhatsApp Webhook] Error processing event:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/whatsapp/conversations
 * List all WhatsApp conversations with 24-hr session window status
 */
whatsappRouter.get('/conversations', (_req: Request, res: Response) => {
  const convs = store.getConversations();
  return res.status(200).json(convs);
});

/**
 * GET /api/whatsapp/conversations/:id
 * Get single conversation and message thread
 */
whatsappRouter.get('/conversations/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const conv = store.getConversation(id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  return res.status(200).json(conv);
});

/**
 * POST /api/whatsapp/send
 * Send message / payment link to customer
 */
whatsappRouter.post('/send', (req: Request, res: Response) => {
  try {
    const { conversationId, text, textMl, isVoiceNote, hasPaymentLink, paymentAmount } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({ error: 'conversationId and text are required' });
    }

    const newMsg = store.addMessage(conversationId, {
      sender: 'merchant',
      text,
      textMl: textMl || text,
      isVoiceNote: Boolean(isVoiceNote),
      status: 'delivered',
      hasPaymentLink: Boolean(hasPaymentLink),
      paymentAmount: paymentAmount ? parseFloat(paymentAmount) : undefined
    });

    return res.status(201).json(newMsg);
  } catch (error: any) {
    console.error('[WhatsAppRouter] Error sending message:', error);
    return res.status(500).json({ error: error.message || 'Failed to send WhatsApp message' });
  }
});
