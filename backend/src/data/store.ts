import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  StoreProfile,
  StoreSettings,
  VoicePreset,
  AgentTaskLog,
  InvoiceData,
  WhatsAppConversation,
  WhatsAppMessage,
  InventoryItem,
  Appointment
} from '@msme/shared';
import {
  INITIAL_STORE_PROFILE,
  INITIAL_STORE_SETTINGS,
  INITIAL_VOICE_PRESETS,
  INITIAL_INVENTORY,
  INITIAL_INVOICES,
  INITIAL_CONVERSATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_TASK_LOGS
} from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store-snapshot.json');

export class InMemoryStore {
  private profile: StoreProfile = { ...INITIAL_STORE_PROFILE };
  private settings: StoreSettings = { ...INITIAL_STORE_SETTINGS };
  private presets: VoicePreset[] = [...INITIAL_VOICE_PRESETS];
  private inventory: InventoryItem[] = [...INITIAL_INVENTORY];
  private invoices: InvoiceData[] = [...INITIAL_INVOICES];
  private conversations: WhatsAppConversation[] = [...INITIAL_CONVERSATIONS];
  private appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
  private taskLogs: AgentTaskLog[] = [...INITIAL_TASK_LOGS];

  constructor() {
    this.loadFromSnapshot();
  }

  private loadFromSnapshot() {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.inventory) this.inventory = parsed.inventory;
        if (parsed.invoices) this.invoices = parsed.invoices;
        if (parsed.conversations) this.conversations = parsed.conversations;
        if (parsed.appointments) this.appointments = parsed.appointments;
        if (parsed.taskLogs) this.taskLogs = parsed.taskLogs;
        if (parsed.profile) this.profile = parsed.profile;
        if (parsed.settings) this.settings = parsed.settings;
      }
    } catch (err) {
      console.warn('[Store] Snapshot load warning, using initial in-memory dataset:', err);
    }
  }

  public persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = {
        profile: this.profile,
        settings: this.settings,
        inventory: this.inventory,
        invoices: this.invoices,
        conversations: this.conversations,
        appointments: this.appointments,
        taskLogs: this.taskLogs
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[Store] Failed to persist snapshot:', err);
    }
  }

  // --- Profile & Settings ---
  public getProfile(): StoreProfile {
    return { ...this.profile };
  }

  public updateProfile(updates: Partial<StoreProfile>): StoreProfile {
    this.profile = { ...this.profile, ...updates };
    this.persist();
    return { ...this.profile };
  }

  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.settings = { ...this.settings, ...updates };
    this.persist();
    return { ...this.settings };
  }

  public getVoicePresets(): VoicePreset[] {
    return [...this.presets];
  }

  // --- Inventory ---
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public getInventoryItem(id: string): InventoryItem | undefined {
    return this.inventory.find(item => item.id === id);
  }

  public findInventoryByName(name: string): InventoryItem | undefined {
    const query = name.toLowerCase().trim();
    return this.inventory.find(item => 
      item.name.toLowerCase().includes(query) || 
      item.nameMl.toLowerCase().includes(query)
    );
  }

  public addInventoryItem(item: Omit<InventoryItem, 'id' | 'lastRestocked'> & { id?: string }): InventoryItem {
    const newItem: InventoryItem = {
      id: item.id || `inv-${Date.now()}`,
      lastRestocked: 'Just now',
      ...item
    };
    this.inventory.unshift(newItem);
    this.persist();
    return newItem;
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.inventory[index] = { ...this.inventory[index], ...updates };
    this.persist();
    return { ...this.inventory[index] };
  }

  public deleteInventoryItem(id: string): boolean {
    const initialLen = this.inventory.length;
    this.inventory = this.inventory.filter(item => item.id !== id);
    if (this.inventory.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Invoices ---
  public getInvoices(): InvoiceData[] {
    return [...this.invoices];
  }

  public getInvoice(id: string): InvoiceData | undefined {
    return this.invoices.find(inv => inv.id === id);
  }

  public addInvoice(invoice: InvoiceData): InvoiceData {
    this.invoices.unshift(invoice);
    this.profile.pendingInvoices = this.invoices.filter(i => i.status !== 'verified').length;
    this.persist();
    return invoice;
  }

  public verifyInvoice(id: string, status: 'verified' | 'flagged', notes?: string): InvoiceData | null {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (!invoice) return null;
    invoice.status = status;
    if (notes) invoice.notes = notes;
    this.profile.pendingInvoices = this.invoices.filter(i => i.status !== 'verified').length;
    this.persist();
    return invoice;
  }

  // --- WhatsApp ---
  public getConversations(): WhatsAppConversation[] {
    return [...this.conversations];
  }

  public getConversation(id: string): WhatsAppConversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  public findConversationByPhone(phone: string): WhatsAppConversation | undefined {
    const clean = phone.replace(/[\s+-]/g, '');
    return this.conversations.find(c => c.customerPhone.replace(/[\s+-]/g, '').includes(clean));
  }

  public addMessage(conversationId: string, message: Omit<WhatsAppMessage, 'id' | 'time'>): WhatsAppMessage {
    let conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) {
      conv = {
        id: conversationId,
        customerName: 'WhatsApp Customer',
        customerPhone: conversationId,
        location: 'Kerala',
        unreadCount: 0,
        lastMessageTime: 'Just now',
        isSessionActive: true,
        sessionExpiryHours: 24,
        messages: []
      };
      this.conversations.unshift(conv);
    }

    const newMsg: WhatsAppMessage = {
      id: `m-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...message
    };
    conv.messages.push(newMsg);
    conv.lastMessageTime = newMsg.time;
    this.persist();
    return newMsg;
  }

  // --- Appointments ---
  public getAppointments(): Appointment[] {
    return [...this.appointments];
  }

  public getAppointment(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  public addAppointment(appointment: Omit<Appointment, 'id'> & { id?: string }): Appointment {
    const newApt: Appointment = {
      id: appointment.id || `apt-${Date.now()}`,
      ...appointment
    };
    this.appointments.unshift(newApt);
    this.persist();
    return newApt;
  }

  public updateAppointmentStatus(id: string, status: 'confirmed' | 'pending' | 'completed'): Appointment | null {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt) return null;
    apt.status = status;
    this.persist();
    return apt;
  }

  // --- Task Logs ---
  public getTaskLogs(): AgentTaskLog[] {
    return [...this.taskLogs];
  }

  public getTaskLog(id: string): AgentTaskLog | undefined {
    return this.taskLogs.find(log => log.id === id);
  }

  public addTaskLog(log: AgentTaskLog): AgentTaskLog {
    this.taskLogs.unshift(log);
    this.persist();
    return log;
  }

  public overrideTaskLog(id: string, status: 'SUCCESS' | 'FAILED', reason: string): AgentTaskLog | null {
    const log = this.taskLogs.find(l => l.id === id);
    if (!log) return null;
    log.status = status;
    log.needsHumanReview = false;
    log.reviewReason = `Overridden by merchant: ${reason}`;
    this.persist();
    return log;
  }
}

export const store = new InMemoryStore();
