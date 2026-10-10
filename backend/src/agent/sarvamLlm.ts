import type { AgentToolType } from '@msme/shared';
import type { ToolExecutionResponse } from './tools.js';

const SARVAM_CHAT_API_URL = 'https://api.sarvam.ai/v1/chat/completions';
const SARVAM_DEFAULT_MODEL = 'sarvam-105b';

export interface SarvamParsedIntent {
  tool: AgentToolType;
  params: Record<string, any>;
  confidence: number;
  explanation: string;
  explanationMl: string;
  model: string;
}

export interface SarvamCritiqueResult {
  isValid: boolean;
  reason?: string;
  confidence: number;
  critiqueNotes: string;
  model: string;
}

/**
 * Check if the Sarvam API key is configured
 */
export function isSarvamLlmConfigured(): boolean {
  const key = process.env.SARVAM_API_KEY;
  return Boolean(key && key.trim().length > 0 && !key.includes('your_'));
}

/**
 * System prompt instructing Sarvam-105B to act as the autonomous operations agent
 * for a Kerala MSME Kirana & service enterprise.
 */
const INTENT_SYSTEM_PROMPT = `You are the autonomous AI operations agent for a local MSME retail and grocery store (Kada) in Kerala, India.
Your mission is to understand merchant commands spoken or written in Malayalam (മലയാളം), Manglish (Malayalam written in Latin script), or English, and map them with high precision into a structured tool call JSON.

Available Tools:
1. "db_write": Restocking, adding stock, or recording incoming goods.
   Params:
   - "action": "add_stock"
   - "productName": Canonical English product name (e.g. "Lady's Finger (Vendakka)", "Basmati Rice", "Palakkadan Matta Rice", "Pure Cold Pressed Coconut Oil", "Fresh Country Tomato", "Wayanad Black Pepper", "Green Cardamom (A Grade)", "White Crystal Sugar")
   - "productNameMl": Malayalam name (e.g. "വെണ്ടക്ക", "ബാസ്മതി അരി", "പാലക്കാടൻ മട്ട അരി", "വെളിച്ചെണ്ണ", "തക്കാളി")
   - "category": "Vegetables" | "Grains" | "Spices" | "Oils" | "Provisions" | "Flour" | "Pulses"
   - "categoryMl": "പച്ചക്കറികൾ" | "ധാന്യങ്ങൾ" | "സുഗന്ധവ്യഞ്ജനങ്ങൾ" | "എണ്ണകൾ" | "പലവ്യഞ്ജനങ്ങൾ" | "മാവ്" | "പയറുവർഗ്ഗങ്ങൾ"
   - "quantity": number (e.g. 10, 25, 50)
   - "unit": "kg" | "Liters" | "packets" | "sacks"
   - "pricePerUnit"?: number (e.g. 35)

2. "inventory_query": Inquiring about current stock level, balance, or availability.
   Params:
   - "productName": string

3. "whatsapp_send": Sending a customer invoice, order update, balance reminder, or payment link via WhatsApp.
   Params:
   - "recipientPhone": string (Indian phone number)
   - "customerName"?: string
   - "messageText": string
   - "messageTextMl"?: string
   - "amount"?: number
   - "includePaymentLink": boolean

4. "calendar_check": Booking, rescheduling, or checking an appointment slot.
   Params:
   - "customerName": string
   - "phone": string
   - "service": string
   - "date": string (YYYY-MM-DD or relative like "today", "tomorrow")
   - "timeSlot": string (e.g. "10:30 AM")

5. "invoice_parse": Parsing an uploaded supplier invoice or bill.
   Params:
   - "rawText"?: string
   - "invoiceNo"?: string

CRITICAL RULES:
- Output MUST be strictly valid JSON and nothing else.
- Never output markdown formatting or explanatory text outside the JSON object.
- Provide clear, professional bilingual explanations in English and Malayalam.
- Choose canonical names that disambiguate specific varieties (e.g., "Basmati Rice" vs "Palakkadan Matta Rice", not generic "rice" if specific variety is named).

Required Output Schema:
{
  "tool": "db_write" | "inventory_query" | "whatsapp_send" | "calendar_check" | "invoice_parse",
  "params": object,
  "confidence": number (between 70 and 99),
  "explanation": string,
  "explanationMl": string
}`;

/**
 * System prompt instructing Sarvam-105B to critique tool execution for safety,
 * financial correctness, and inventory math invariants.
 */
const CRITIQUE_SYSTEM_PROMPT = `You are the safety & financial guardrail critic for a Kerala MSME enterprise assistant.
You evaluate an agent's proposed or executed tool action against strict business invariants:

Safety Invariants:
1. Price Fluctuation Guardrail: If historical unit price is known, flag if new unit price deviates by more than 50% (e.g. historical ₹30/kg vs new ₹200/kg). New items without history pass this check.
2. Positive Quantity: Quantities and prices must be strictly positive non-zero numbers.
3. Realistic Retail Scale: Flag absurd single-transaction orders (e.g. 50,000 kg of cardamom or ₹1,000,000/kg of tomatoes).
4. Tool Success: If the database execution reported a failure, the critique must fail.

Required Output Schema (JSON only):
{
  "isValid": boolean,
  "reason"?: string,
  "confidence": number (between 70 and 99),
  "critiqueNotes": string (bilingual summary of checks passed or flagged)
}`;

/**
 * Call Sarvam-105B LLM to convert vernacular user commands into structured tool intents
 */
export async function parseIntentWithSarvamLlm(
  input: string,
  attempt = 0,
  merchantContext?: { merchantPhone?: string; businessId?: string }
): Promise<SarvamParsedIntent | null> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

  try {
    const response = await fetch(SARVAM_CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey.trim()
      },
      body: JSON.stringify({
        model: SARVAM_DEFAULT_MODEL,
        messages: [
          { role: 'system', content: INTENT_SYSTEM_PROMPT },
          {
            role: 'user',
            content: attempt === 0
              ? input
              : `${input}\n\n[Note: This is refinement attempt #${attempt + 1}. Please ensure precise parameter extraction and canonical naming.]`
          }
        ],
        temperature: 0.1
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.warn(`[Sarvam LLM] Intent parse HTTP ${response.status}: ${errBody.slice(0, 200)}`);
      return null;
    }

    const data: any = await response.json();
    const rawContent: string = data.choices?.[0]?.message?.content || '';
    if (!rawContent.trim()) {
      return null;
    }

    // Strip markdown code fences if model wrapped response in ```json ... ```
    const cleaned = rawContent
      .replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, '$1')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.tool || !parsed.params) {
      console.warn('[Sarvam LLM] Missing tool or params in JSON response:', parsed);
      return null;
    }

    // Inject merchant context if present
    if (merchantContext?.merchantPhone && !parsed.params.merchantPhone) {
      parsed.params.merchantPhone = merchantContext.merchantPhone;
    }
    if (merchantContext?.businessId && !parsed.params.businessId) {
      parsed.params.businessId = merchantContext.businessId;
    }

    return {
      tool: parsed.tool as AgentToolType,
      params: parsed.params,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 95.0,
      explanation: parsed.explanation || `Executed ${parsed.tool} via Sarvam LLM.`,
      explanationMl: parsed.explanationMl || `സർവം AI വഴി ${parsed.tool} നടപ്പിലാക്കി.`,
      model: SARVAM_DEFAULT_MODEL
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn(`[Sarvam LLM] Intent extraction error (${error?.message || error}), falling back to deterministic catalog.`);
    return null;
  }
}

/**
 * Call Sarvam-105B LLM to critique and validate the execution against safety guardrails
 */
export async function critiqueWithSarvamLlm(
  tool: AgentToolType,
  params: any,
  toolResult: ToolExecutionResponse,
  historicalPrice?: number
): Promise<SarvamCritiqueResult | null> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

  try {
    const evaluationPayload = {
      tool,
      params,
      result: {
        success: toolResult.success,
        summary: toolResult.summary,
        data: toolResult.data
      },
      historicalContext: {
        historicalUnitPrice: historicalPrice || null,
        isNewItem: Boolean(toolResult.data?.isNewItem)
      }
    };

    const response = await fetch(SARVAM_CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey.trim()
      },
      body: JSON.stringify({
        model: SARVAM_DEFAULT_MODEL,
        messages: [
          { role: 'system', content: CRITIQUE_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Evaluate this proposed action:\n${JSON.stringify(evaluationPayload, null, 2)}`
          }
        ],
        temperature: 0.1
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data: any = await response.json();
    const rawContent: string = data.choices?.[0]?.message?.content || '';
    if (!rawContent.trim()) {
      return null;
    }

    const cleaned = rawContent
      .replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, '$1')
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      isValid: typeof parsed.isValid === 'boolean' ? parsed.isValid : true,
      reason: parsed.reason,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 95.0,
      critiqueNotes: parsed.critiqueNotes || (parsed.isValid ? 'Sarvam LLM safety critique passed.' : `Flagged: ${parsed.reason}`),
      model: SARVAM_DEFAULT_MODEL
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn(`[Sarvam LLM] Critique validation error (${error?.message || error}), falling back to programmatic critique.`);
    return null;
  }
}
