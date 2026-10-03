# Kada — API Wiring Plan

How to connect each dashboard component from mock data → real backend.
The `api/client.ts` is already written with fallbacks — components just need
to call it instead of importing from `mockData.ts` directly.

**Rule for every component:**
1. Remove the direct `mockData` import for data arrays
2. Add `useEffect` that calls the API function on mount
3. Replace the `useState(MOCK_*)` initializer with `useState([])`
4. Keep a loading state if the fetch takes time

---

## Step 1 — Overview.tsx

**File:** `frontend/src/components/Overview.tsx`

**Remove:**
```ts
import { STORE_PROFILE, INITIAL_AGENT_LOGS } from '../mockData';
```

**Add at top:**
```ts
import { getAgentLogs } from '../api/client';
import { STORE_PROFILE } from '../mockData'; // keep — profile has no API yet
import type { AgentTaskLog } from '../types';
```

**Change inside the component:**
```tsx
// Before
const flagged = INITIAL_AGENT_LOGS.filter(l => l.status === 'FLAGGED').slice(0, 2);
const recent  = INITIAL_AGENT_LOGS.filter(l => l.status === 'SUCCESS').slice(0, 3);

// After
const [logs, setLogs] = useState<AgentTaskLog[]>([]);

useEffect(() => {
  getAgentLogs().then(setLogs);
}, []);

const flagged = logs.filter(l => l.status === 'FLAGGED').slice(0, 2);
const recent  = logs.filter(l => l.status === 'SUCCESS').slice(0, 3);
```

**Stat tile — bookings count:** pull from logs length instead of hardcoded `STORE_PROFILE.tasksAutoCompleted`:
```tsx
// Before
<KadaTile value={STORE_PROFILE.tasksAutoCompleted} label="Bookings" />

// After
<KadaTile value={logs.filter(l => l.status === 'SUCCESS').length} label="Bookings" />
```

---

## Step 2 — VoiceAgent.tsx

**File:** `frontend/src/components/VoiceAgent.tsx`

This is the only component already using `api/client`. Check it imports correctly:

```ts
import { getAgentLogs, processAgentCommand } from '../api/client';
```

When the merchant taps "Execute" after speaking, call:
```ts
const result = await processAgentCommand({
  inputPrompt: transcript,        // the Malayalam text from VoiceModal
  inputType: 'voice',
  language: 'ml',
});
// result.taskLog is the new AgentTaskLog — prepend it to the logs list
setLogs(prev => [result.taskLog, ...prev]);
```

---

## Step 3 — VoiceModal.tsx

**File:** `frontend/src/components/VoiceModal.tsx`

**Remove:**
```ts
import { MOCK_VOICE_PRESETS } from '../mockData';
```

**Add:**
```ts
import { getVoicePresets, processAgentCommand } from '../api/client';
import type { VoicePreset } from '../types';
```

**Change inside the component:**
```tsx
// Before
// Uses MOCK_VOICE_PRESETS directly

// After
const [presets, setPresets] = useState<VoicePreset[]>([]);

useEffect(() => {
  getVoicePresets().then(setPresets);
}, []);
```

Replace every `MOCK_VOICE_PRESETS` reference with `presets`.

**When Execute is tapped, call the agent:**
```tsx
const handleExecute = async () => {
  if (!transcript) return;
  await processAgentCommand({
    inputPrompt: transcript,
    inputType: 'voice',
    language: language === 'ml' ? 'ml' : 'en',
  });
  onSelectCommand(transcript);
  onClose();
};
```

---

## Step 4 — WhatsAppHub.tsx

**File:** `frontend/src/components/WhatsAppHub.tsx`

**Remove:**
```ts
import { MOCK_WHATSAPP_CONVERSATIONS } from '../mockData';
```

**Add:**
```ts
import { getWhatsAppConversations, sendWhatsAppMessage } from '../api/client';
import type { WhatsAppConversation } from '../types';
```

**Change state init + fetch:**
```tsx
// Before
const [conversations, setConversations] = useState(MOCK_WHATSAPP_CONVERSATIONS);

// After
const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);

useEffect(() => {
  getWhatsAppConversations().then(data => {
    setConversations(data);
    if (data.length > 0) setSelectedChat(data[0]);
  });
}, []);
```

**When merchant sends a reply:**
```tsx
const handleSend = async () => {
  if (!replyText.trim()) return;
  const msg = await sendWhatsAppMessage({
    conversationId: selectedChat.id,
    text: replyText,
  });
  // Append msg to selectedChat.messages
  setSelectedChat(prev => ({
    ...prev,
    messages: [...prev.messages, msg],
  }));
  setReplyText('');
};
```

---

## Step 5 — InvoiceParser.tsx

**File:** `frontend/src/components/InvoiceParser.tsx`

**Remove:**
```ts
import { MOCK_INVOICE_DATA } from '../mockData';
```

**Add:**
```ts
import { getInvoices, parseInvoiceDocument, verifyInvoice } from '../api/client';
import type { InvoiceData } from '../types';
```

**Change state + fetch:**
```tsx
// Before
const [invoice, setInvoice] = useState(MOCK_INVOICE_DATA);

// After
const [invoices, setInvoices] = useState<InvoiceData[]>([]);
const [invoice, setInvoice]   = useState<InvoiceData | null>(null);

useEffect(() => {
  getInvoices().then(data => {
    setInvoices(data);
    if (data.length > 0) setInvoice(data[0]);
  });
}, []);
```

**When a photo is uploaded:**
```tsx
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('invoice', file);
  const { invoice: parsed } = await parseInvoiceDocument(formData);
  setInvoice(parsed);
};
```

**When merchant taps Verify:**
```tsx
const handleVerify = async () => {
  if (!invoice) return;
  const updated = await verifyInvoice(invoice.id, 'verified', '', true);
  setInvoice(updated);
};
```

---

## Step 6 — InventoryManager.tsx

**File:** `frontend/src/components/InventoryManager.tsx`

**Remove:**
```ts
import { MOCK_INVENTORY } from '../mockData';
```

**Add:**
```ts
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../api/client';
import type { InventoryItem } from '../types';
```

**Change state + fetch:**
```tsx
// Before
const [items, setItems] = useState(MOCK_INVENTORY);

// After
const [items, setItems] = useState<InventoryItem[]>([]);

useEffect(() => {
  getInventory().then(setItems);
}, []);
```

**Add item:**
```tsx
const handleAdd = async (newItem: Partial<InventoryItem>) => {
  const created = await addInventoryItem(newItem);
  setItems(prev => [created, ...prev]);
};
```

**Update item:**
```tsx
const handleUpdate = async (id: string, updates: Partial<InventoryItem>) => {
  const { item } = await updateInventoryItem(id, updates);
  setItems(prev => prev.map(i => i.id === id ? item : i));
};
```

**Delete item:**
```tsx
const handleDelete = async (id: string) => {
  await deleteInventoryItem(id);
  setItems(prev => prev.filter(i => i.id !== id));
};
```

---

## Step 7 — Appointments.tsx

**File:** `frontend/src/components/Appointments.tsx`

**Remove:**
```ts
import { MOCK_APPOINTMENTS } from '../mockData';
```

**Add:**
```ts
import { getAppointments, updateAppointmentStatus } from '../api/client';
import type { Appointment } from '../types';
```

**Change state + fetch:**
```tsx
// Before
const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

// After
const [appointments, setAppointments] = useState<Appointment[]>([]);

useEffect(() => {
  getAppointments().then(setAppointments);
}, []);
```

**When merchant confirms a booking:**
```tsx
const handleConfirm = async (id: string) => {
  const updated = await updateAppointmentStatus(id, 'confirmed');
  setAppointments(prev => prev.map(a => a.id === id ? updated : a));
};
```

---

## Step 8 — StoreSettings.tsx

**File:** `frontend/src/components/StoreSettings.tsx`

**Remove:**
```ts
import { MOCK_STORE_SETTINGS, STORE_PROFILE } from '../mockData';
```

**Add:**
```ts
import { getStoreSettings, updateStoreProfile, updateStorePreferences } from '../api/client';
```

**Change state + fetch:**
```tsx
// Before
const [upiId, setUpiId] = useState(MOCK_STORE_SETTINGS.contactPreferences.upiId);
const [notifyWhatsapp, setNotifyWhatsapp] = useState(MOCK_STORE_SETTINGS.contactPreferences.notifyWhatsapp);

// After
const [upiId, setUpiId]                     = useState('');
const [notifyWhatsapp, setNotifyWhatsapp]   = useState(true);
const [notifyLowStock, setNotifyLowStock]   = useState(true);

useEffect(() => {
  getStoreSettings().then(({ profile, settings }) => {
    setUpiId(settings.contactPreferences.upiId);
    setNotifyWhatsapp(settings.contactPreferences.notifyWhatsapp);
    setNotifyLowStock(settings.contactPreferences.notifyLowStock);
  });
}, []);
```

**When merchant saves:**
```tsx
const handleSave = async () => {
  await updateStorePreferences({
    upiId,
    notifyWhatsapp,
    notifyLowStock,
  });
  setIsSaved(true);
  setTimeout(() => setIsSaved(false), 2500);
};
```

---

## Step 9 — SystemHealth.tsx

**File:** `frontend/src/components/SystemHealth.tsx`

**Remove:**
```ts
import { MOCK_SYSTEM_HEALTH } from '../mockData';
```

**Add:**
```ts
import { getSystemHealth } from '../api/client';
import type { SystemHealthStatus } from '../types';
```

**Change state + fetch:**
```tsx
// Before
const [health] = useState(MOCK_SYSTEM_HEALTH);

// After
const [health, setHealth] = useState<SystemHealthStatus | null>(null);

useEffect(() => {
  getSystemHealth().then(setHealth);
  // Refresh every 30 seconds
  const id = setInterval(() => getSystemHealth().then(setHealth), 30_000);
  return () => clearInterval(id);
}, []);

if (!health) return <p>Loading…</p>;
```

---

## Where `BASE_URL` points

`frontend/src/api/client.ts` line 25:

```ts
const BASE_URL = '/api';
```

This works when Vite proxies `/api` → `localhost:3001`.

**Add the proxy to `frontend/vite.config.ts`:**
```ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

Without this, change `BASE_URL` to `'http://localhost:3001/api'` for local dev.

---

## Order to do this

Do one step, test it, move on. The fallback in `safeFetch` means if the
backend is offline, mock data still loads — nothing breaks.

```
Step 1  Overview        ← most visible, validates the agent logs flow
Step 2  VoiceAgent      ← already partially done
Step 3  VoiceModal      ← wires voice → agent → result
Step 4  WhatsApp        ← conversations + send
Step 5  Invoices        ← parse + verify
Step 6  Inventory       ← full CRUD
Step 7  Appointments    ← confirm/update
Step 8  Settings        ← save preferences
Step 9  SystemHealth    ← status polling (do last, least critical)
```
