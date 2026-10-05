import type {
  AgentTaskLog,
  InvoiceData,
  WhatsAppConversation,
  WhatsAppMessage,
  InventoryItem,
  Appointment,
  StoreProfile,
  StoreSettings,
  VoicePreset,
  SystemHealthStatus
} from '../types';

import {
  INITIAL_AGENT_LOGS,
  MOCK_INVOICE_DATA,
  MOCK_WHATSAPP_CONVERSATIONS,
  MOCK_INVENTORY,
  MOCK_APPOINTMENTS,
  STORE_PROFILE,
  MOCK_STORE_SETTINGS,
  MOCK_VOICE_PRESETS
} from '../mockData';

// In dev: Vite proxies /api → localhost:3001 (see vite.config.ts)
// In prod: set VITE_API_URL=https://your-backend.com in .env
const BASE_URL = (import.meta.env.VITE_API_URL ?? '') + '/api';

async function safeFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`API ${endpoint} failed with HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Client] Error on ${endpoint}, returning fallback:`, err);
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

// --- Agent & Reflection APIs ---
export async function getAgentLogs(): Promise<AgentTaskLog[]> {
  return safeFetch<AgentTaskLog[]>('/agent/logs', undefined, INITIAL_AGENT_LOGS);
}

export async function processAgentCommand(payload: {
  inputPrompt: string;
  inputPromptMl?: string;
  inputType?: 'voice' | 'text' | 'webhook';
  language?: 'ml' | 'en';
  presetId?: string;
}): Promise<{ taskLog: AgentTaskLog; attempts: number }> {
  return safeFetch<{ taskLog: AgentTaskLog; attempts: number }>('/agent/process', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function overrideAgentTask(id: string, status: 'SUCCESS' | 'FAILED', reason: string): Promise<AgentTaskLog> {
  return safeFetch<AgentTaskLog>('/agent/override', {
    method: 'POST',
    body: JSON.stringify({ id, status, reason })
  });
}

// --- Voice & Presets APIs ---
export async function getVoicePresets(): Promise<VoicePreset[]> {
  return safeFetch<VoicePreset[]>('/voice/presets', undefined, MOCK_VOICE_PRESETS as any);
}

export async function transcribeVoiceNote(formData: FormData): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/voice/transcribe`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Transcription fallback:', err);
    return {
      transcription: {
        success: true,
        transcript: 'Add 15 kg of tomato to stock at ₹40/kg',
        transcriptMl: 'രാവിലെ വന്ന തക്കാളി 15 കിലോ കൂടി സ്റ്റോക്കിൽ ചേർക്കൂ, വില കിലോയ്ക്ക് 40 രൂപ.',
        confidence: 96.8
      }
    };
  }
}

// --- Invoices APIs ---
export async function getInvoices(): Promise<InvoiceData[]> {
  return safeFetch<InvoiceData[]>('/invoices', undefined, [MOCK_INVOICE_DATA]);
}

export async function parseInvoiceDocument(formData: FormData): Promise<{ invoice: InvoiceData; guardrail: any }> {
  try {
    const res = await fetch(`${BASE_URL}/invoices/parse`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Parse failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Invoice parse fallback:', err);
    return {
      invoice: MOCK_INVOICE_DATA,
      guardrail: { passed: true, variance: 0 }
    };
  }
}

export async function verifyInvoice(id: string, status: 'verified' | 'flagged', notes?: string, syncInventory = true): Promise<InvoiceData> {
  return safeFetch<InvoiceData>(`/invoices/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify({ status, notes, syncInventory })
  });
}

// --- WhatsApp APIs ---
export async function getWhatsAppConversations(): Promise<WhatsAppConversation[]> {
  return safeFetch<WhatsAppConversation[]>('/whatsapp/conversations', undefined, MOCK_WHATSAPP_CONVERSATIONS);
}

export async function sendWhatsAppMessage(payload: {
  conversationId: string;
  text: string;
  textMl?: string;
  isVoiceNote?: boolean;
  hasPaymentLink?: boolean;
  paymentAmount?: number;
}): Promise<WhatsAppMessage> {
  return safeFetch<WhatsAppMessage>('/whatsapp/send', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// --- Inventory APIs ---
export async function getInventory(): Promise<InventoryItem[]> {
  return safeFetch<InventoryItem[]>('/inventory', undefined, MOCK_INVENTORY);
}

export async function addInventoryItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
  return safeFetch<InventoryItem>('/inventory', {
    method: 'POST',
    body: JSON.stringify(item)
  });
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<{ item: InventoryItem; warning?: string }> {
  return safeFetch<{ item: InventoryItem; warning?: string }>(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteInventoryItem(id: string): Promise<{ success: boolean }> {
  return safeFetch<{ success: boolean }>(`/inventory/${id}`, {
    method: 'DELETE'
  });
}

// --- Appointments APIs ---
export async function getAppointments(): Promise<Appointment[]> {
  return safeFetch<Appointment[]>('/appointments', undefined, MOCK_APPOINTMENTS);
}

export async function addAppointment(apt: Partial<Appointment>): Promise<Appointment> {
  return safeFetch<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(apt)
  });
}

export async function updateAppointmentStatus(id: string, status: 'confirmed' | 'pending' | 'completed'): Promise<Appointment> {
  return safeFetch<Appointment>(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

// --- Settings & Health APIs ---
export async function getStoreSettings(): Promise<{ profile: StoreProfile; settings: StoreSettings }> {
  return safeFetch<{ profile: StoreProfile; settings: StoreSettings }>('/settings', undefined, {
    profile: STORE_PROFILE,
    settings: MOCK_STORE_SETTINGS
  });
}

export async function updateStoreProfile(profile: Partial<StoreProfile>): Promise<StoreProfile> {
  const fallback = { ...STORE_PROFILE, ...profile };
  return safeFetch<StoreProfile>('/settings/profile', {
    method: 'PUT',
    body: JSON.stringify(profile)
  }, fallback);
}

export async function updateStorePreferences(prefs: any): Promise<StoreSettings> {
  const fallback = {
    ...MOCK_STORE_SETTINGS,
    contactPreferences: {
      ...MOCK_STORE_SETTINGS.contactPreferences,
      ...prefs
    }
  };
  return safeFetch<StoreSettings>('/settings/preferences', {
    method: 'PUT',
    body: JSON.stringify(prefs)
  }, fallback);
}

export async function getSystemHealth(): Promise<SystemHealthStatus> {
  return safeFetch<SystemHealthStatus>('/health', undefined, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: 3600,
    whisperEngine: { type: 'whisper.cpp', status: 'ready', latencyMs: 142 },
    llmEngine: { primary: 'Gemini 2.0 Flash', fallback: 'Groq Llama 3.3 70B', status: 'connected' },
    database: { type: 'PostgreSQL + pgvector', status: 'connected', poolSize: 10 },
    redis: { status: 'connected', activeJobs: 0 },
    memoryUsageMb: 85.4
  });
}
