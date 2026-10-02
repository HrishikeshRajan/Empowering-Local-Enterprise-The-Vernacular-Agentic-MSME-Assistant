export const APP_VERSION = '1.0.0';

export type Language = 'en' | 'ml';

export type NavTab = 
  | 'overview' 
  | 'voice-agent' 
  | 'invoices' 
  | 'whatsapp' 
  | 'inventory' 
  | 'appointments' 
  | 'settings';

export type AgentStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'critique-pass';

export type AgentToolType = 
  | 'db_write' 
  | 'db_read' 
  | 'whatsapp_send' 
  | 'invoice_parse' 
  | 'inventory_query' 
  | 'calendar_check';

export interface AgentExecutionStep {
  step: 'generate' | 'execute' | 'critique' | 'refine';
  title: string;
  titleMl: string;
  description: string;
  status: AgentStepStatus;
  timestamp: string;
  payload?: any;
  confidence?: number;
  durationMs?: number;
}

export interface AgentTaskLog {
  id: string;
  inputPrompt: string;
  inputPromptMl?: string;
  inputType: 'voice' | 'text' | 'webhook';
  language: 'ml' | 'en';
  toolUsed: AgentToolType;
  status: 'SUCCESS' | 'FLAGGED' | 'FAILED';
  confidence: number;
  executionTimeMs: number;
  timestamp: string;
  steps: AgentExecutionStep[];
  outputSummary: string;
  outputSummaryMl: string;
  needsHumanReview?: boolean;
  reviewReason?: string;
  dataSnapshot?: any;
}

export interface InvoiceItem {
  id: string;
  name: string;
  nameMl: string;
  hsn: string;
  qty: string;
  unit: string;
  rate: number;
  amount: number;
  confidence: number;
}

export interface InvoiceData {
  id: string;
  invoiceNo: string;
  date: string;
  vendorName: string;
  vendorNameMl: string;
  vendorGstin: string;
  vendorAddress: string;
  buyerName: string;
  buyerGstin: string;
  items: InvoiceItem[];
  subTotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  status: 'verified' | 'flagged' | 'pending';
  guardrailsPassed: boolean;
  varianceAmount: number;
  imageUrl: string;
  notes?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'customer' | 'agent' | 'merchant';
  text: string;
  textMl?: string;
  time: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  status?: 'sent' | 'delivered' | 'read';
  hasPaymentLink?: boolean;
  paymentAmount?: number;
  metadata?: any;
}

export interface WhatsAppConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  location: string;
  unreadCount: number;
  lastMessageTime: string;
  isSessionActive: boolean;
  sessionExpiryHours: number;
  messages: WhatsAppMessage[];
}

export interface InventoryItem {
  id: string;
  name: string;
  nameMl: string;
  category: string;
  categoryMl: string;
  currentStock: number;
  unit: string;
  reorderLevel: number;
  unitPrice: number;
  costPrice: number;
  lastRestocked: string;
  hsnCode?: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  serviceMl: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'completed';
  notes: string;
}

export interface StoreProfile {
  name: string;
  nameMl: string;
  owner: string;
  ownerMl: string;
  location: string;
  gstin: string;
  phone: string;
  monthlyRevenue: number;
  cashInHand: number;
  pendingInvoices: number;
  whatsappQueriesToday: number;
  tasksAutoCompleted: number;
}

export interface StoreSettings {
  storeStatus: {
    status: string;
    statusMl: string;
    dataSecurity: string;
    dataSecurityMl: string;
    dailyBackup: string;
    dailyBackupMl: string;
    systemSpeed: string;
    systemSpeedMl: string;
    uptime: string;
  };
  contactPreferences: {
    notifyWhatsapp: boolean;
    notifyLowStock: boolean;
    autoInvoiceGeneration: boolean;
    upiId: string;
    dailySettlementTime: string;
  };
}

export interface VoicePreset {
  id: string;
  title: string;
  titleMl: string;
  malayalamAudioText: string;
  englishTranslation: string;
  duration: string;
  category: string;
  confidence: number;
}

export interface AgentProcessRequest {
  inputPrompt: string;
  inputPromptMl?: string;
  inputType?: 'voice' | 'text' | 'webhook';
  language?: Language;
  presetId?: string;
}

export interface AgentCritiqueResult {
  isValid: boolean;
  confidence: number;
  reason?: string;
  critiqueNotes: string;
  critiqueNotesMl: string;
  financialGuardrailPassed: boolean;
}

export interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  uptimeSeconds: number;
  whisperEngine: {
    type: 'whisper.cpp' | 'mock-simulation';
    status: 'ready' | 'offline';
    latencyMs: number;
  };
  llmEngine: {
    primary: 'Gemini 2.0 Flash';
    fallback: 'Groq Llama 3.3 70B';
    status: 'connected';
  };
  database: {
    type: 'PostgreSQL + pgvector';
    status: 'connected';
    poolSize: number;
  };
  redis: {
    status: 'connected';
    activeJobs: number;
  };
  memoryUsageMb: number;
}
