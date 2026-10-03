# Kada Backend — Architecture, APIs & Use Cases

> Express + TypeScript server running on `localhost:3001`.
> No database or API keys needed for Phase 1 — everything runs in-memory
> with JSON file persistence.

---

## How to Run

```bash
cd backend
npm install
cp .env.example .env    # no keys to fill yet
npm run dev             # starts on :3001, hot-reload via ts-node
```

Verify it works:
```
GET http://localhost:3001/api
→ returns JSON list of all endpoints
```

---

## Architecture Overview

```
backend/src/
│
├── index.ts                  ← Express app, CORS, mounts all routers
│
├── agent/
│   ├── agentRouter.ts        ← HTTP routes for /api/agent/*
│   ├── reflectionEngine.ts   ← The brain — Generate→Execute→Critique→Refine
│   ├── tools.ts              ← 6 agent tools (db_write, whatsapp_send, etc.)
│   └── schemas.ts            ← Zod schemas for tool input validation
│
├── voice/
│   └── voiceRouter.ts        ← /api/voice/transcribe, /api/voice/presets
│
├── invoices/
│   └── invoiceRouter.ts      ← /api/invoices (list, parse, verify)
│
├── whatsapp/
│   └── whatsappRouter.ts     ← /api/whatsapp (webhook, conversations, send)
│
├── inventory/
│   └── inventoryRouter.ts    ← /api/inventory (CRUD + low-stock alerts)
│
├── appointments/
│   └── appointmentsRouter.ts ← /api/appointments (list, book, confirm)
│
├── settings/
│   └── settingsRouter.ts     ← /api/settings (profile, preferences)
│
├── health/
│   └── healthRouter.ts       ← /api/health (uptime check)
│
└── data/
    ├── store.ts              ← InMemoryStore class (Phase 1 persistence)
    ├── initialData.ts        ← Kerala MSME mock seed data
    └── ../../data/
        └── store-snapshot.json  ← Auto-saved on every write (survives restarts)
```

---

## Data Layer — InMemoryStore

`store.ts` is a singleton class that holds all state in memory and
auto-saves to `data/store-snapshot.json` on every write operation.

```
InMemoryStore
  ├── profile         StoreProfile       (shop name, owner, GSTIN, phone)
  ├── settings        StoreSettings      (UPI ID, WhatsApp alerts toggle)
  ├── presets         VoicePreset[]      (Malayalam voice command templates)
  ├── inventory       InventoryItem[]    (products, stock, reorder levels)
  ├── invoices        InvoiceData[]      (parsed bills + verification status)
  ├── conversations   WhatsAppConversation[] (threads + messages)
  ├── appointments    Appointment[]      (bookings, timeslots, status)
  └── taskLogs        AgentTaskLog[]     (every agent action with steps)
```

**Key methods:**

| Method | What it does |
|---|---|
| `findInventoryByName(name)` | Fuzzy match by English or Malayalam name |
| `addMessage(convId, msg)` | Appends to conversation, creates conv if new |
| `verifyInvoice(id, status)` | Marks invoice verified/flagged |
| `overrideTaskLog(id, status)` | Merchant manually approves/rejects flagged task |
| `persist()` | Writes full state to store-snapshot.json |

**Phase 3 upgrade path:** Replace each store method call with a
Prisma query. The router code doesn't change — only what `store.*`
calls underneath.

---

## The Reflection Engine

`reflectionEngine.ts` — the core agent brain. Every voice/text command
runs through a 4-step loop, max 3 retries before human escalation.

### The Loop

```
Input: "കൈലാസ് പ്രൊവിഷൻസിന് ₹38,055 ബിൽ WhatsApp വഴി അയക്കൂ"
  │
  ▼ STEP 1: GENERATE
  Keyword matching on Malayalam + English terms
  → picks tool: whatsapp_send
  → params: { recipientPhone, customerName, amount: 38055, includePaymentLink: true }
  → confidence: 98.9%
  │
  ▼ STEP 2: EXECUTE
  Calls agentTools['whatsapp_send'](params)
  → Zod validates params against WhatsAppSendPayloadSchema
  → Writes message to store.addMessage()
  → Returns { success: true, summary: "Delivered to Kailas…", data: message }
  │
  ▼ STEP 3: CRITIQUE
  Checks guardrails:
  - amount > 0?               → ✓ pass
  - price spike on inventory? → N/A for WhatsApp tool
  → isValid: true, confidence: 98.5%
  │
  ▼ STEP 4: REFINE
  Saves AgentTaskLog with all 4 steps, confidence, timing
  → status: SUCCESS
  → Returns taskLog to caller
```

### Failure path (3 retries exhausted)

```
Attempt 1 → critique fails (e.g. price spike 400% detected)
Attempt 2 → refined input, still fails
Attempt 3 → still fails
  ↓
status: FLAGGED
needsHumanReview: true
reviewReason: "Exceeded maximum 3 reflection retries"
  ↓
Dashboard → "! Needs you" card
Merchant taps → POST /api/agent/override
```

### Intent detection (current implementation)

Malayalam + English keyword matching in `generateIntent()`:

| Keywords | Tool selected |
|---|---|
| തക്കാളി / tomato / സ്റ്റോക്ക് / stock / കിലോ / kg | `db_write` (add stock) |
| വാട്സ്ആപ്പ് / bill / ബിൽ / send / reminder | `whatsapp_send` |
| appointment / ബുക്കിംഗ് / നാളെ / tomorrow | `calendar_check` |
| പരിശോധിക്കൂ / check / എത്രയുണ്ട് | `inventory_query` |
| (fallback) | `invoice_parse` |

> **Phase 2 upgrade:** Replace keyword matching with a real LLM call
> (Gemini Flash) for intent extraction. The loop structure stays identical.

---

## Agent Tools

Six tools the reflection engine can call. Each is Zod-validated.

### `db_write` — Update inventory stock

**Input schema:**
```ts
{
  action: 'add_stock',
  productName: string,   // matched fuzzy against store inventory
  quantity: number,      // must be > 0
  unit?: string,         // 'kg' | 'Liters' | 'packet'
  pricePerUnit?: number  // optional — triggers price guardrail check
}
```

**What it does:**
- Finds existing item by name (English or Malayalam)
- Adds quantity to `currentStock`
- Updates `unitPrice` if provided
- Creates a new item if not found

**Use case:**
> Merchant says: "15 കിലോ തക്കാളി ₹40ൽ ചേർക്കൂ"
> → stock: 30 → 45 kg, price updated to ₹40/kg

---

### `whatsapp_send` — Send message / payment link

**Input schema:**
```ts
{
  recipientPhone: string,
  customerName?: string,
  messageText: string,
  messageTextMl?: string,
  includePaymentLink: boolean,
  amount?: number          // must be > 0 if includePaymentLink is true
}
```

**What it does:**
- Finds conversation by phone number (fuzzy match)
- Creates new conversation if not found
- Appends message with sender: 'agent'
- Marks `hasPaymentLink: true` and stores `paymentAmount`

**Use case:**
> "കൈലാസ് പ്രൊവിഷൻസിന് ₹38,055 ബിൽ WhatsApp വഴി അയക്കൂ"
> → message + UPI payment link sent to conversation thread

---

### `invoice_parse` — Parse a vendor bill

**Input schema:**
```ts
{
  invoiceNo?: string,
  imageUrl?: string
}
```

**What it does (Phase 1):** Returns a mock parsed invoice with 5 line items,
calculated GST totals, and guardrail check.

**Phase 2:** Sends image to Gemini Flash Vision API, gets structured JSON back,
runs `calculateInvoiceTotals()` and `validateInvoiceGuardrails()` from `@msme/shared`.

---

### `calendar_check` — Book an appointment

**Input schema:**
```ts
{
  customerName: string,
  phone: string,
  service: string,
  date: string,
  timeSlot: string
}
```

**What it does:**
- Creates appointment in store with status: 'confirmed'
- Returns full appointment object

**Use case:**
> "സുരേഷ് കുമാറിന് നാളെ 2 മണിക്ക് അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യൂ"
> → appointment created, shows in Bookings tab

---

### `inventory_query` — Check stock level

**Input schema:**
```ts
{
  productName: string
}
```

**What it does:**
- Fuzzy finds item by name
- Returns stock level, price, reorder level in both languages

**Use case:**
> "ഏലക്ക എത്രയുണ്ട്?"
> → "Green Cardamom: 45 kg available at ₹1450/kg (reorder: 20 kg)"

---

### `db_read` — Query store data

**Input:**
```ts
{ entity: 'inventory' | 'invoices' | 'profile' }
```

Returns the full list/object for that entity.

---

## Financial Guardrails

Two hard rules enforced at the critique step (from `@msme/shared`):

### 1. Price spike guardrail (`MAX_PRICE_DEVIATION_PERCENT = 30`)

When `db_write` includes a `pricePerUnit`:
- Finds existing item's last known price
- If new price is >30% different → critique fails → retry or flag

```
Example:
  Pepper current price: ₹680/kg
  Voice command says:   ₹6800/kg   ← typo or fraud
  Change: 900% — exceeds 30% limit
  → FLAGGED, not written to store
  → Merchant sees "! Needs you" with reason
```

### 2. Zero-amount payment guardrail

If `whatsapp_send` has `includePaymentLink: true` but `amount <= 0`:
→ critique fails immediately, no message sent

### Invoice math guardrail (`validateInvoiceGuardrails`)

From `@msme/shared`:
- Recalculates subtotal from all line items
- Compares to vendor's claimed total
- If variance > ₹1 → `guardrailsPassed: false`, invoice flagged

---

## Full API Reference

### Agent — `/api/agent`

---

**`POST /api/agent/process`**

Run any text or voice transcript through the reflection loop.

Request:
```json
{
  "inputPrompt": "Add 15 kg tomato at ₹40",
  "inputPromptMl": "15 കിലോ തക്കാളി ₹40ൽ ചേർക്കൂ",
  "inputType": "voice",
  "language": "ml"
}
```

Response:
```json
{
  "taskLog": {
    "id": "task-1234",
    "status": "SUCCESS",
    "toolUsed": "db_write",
    "confidence": 96.8,
    "outputSummary": "Updated Country Tomato: +15 kg (Total: 45 kg).",
    "outputSummaryMl": "തക്കാളി സ്റ്റോക്ക് പുതുക്കി: +15 kg (ആകെ: 45 kg).",
    "executionTimeMs": 42,
    "steps": [ ...4 steps with timing ]
  },
  "attempts": 1
}
```

Also accepts `presetId` instead of `inputPrompt` to run a named preset.

---

**`GET /api/agent/logs`**

Returns all task execution logs, newest first.

Response: `AgentTaskLog[]`

---

**`GET /api/agent/logs/:id`**

Returns one log with full step breakdown.

---

**`POST /api/agent/override`**

Merchant manually approves or rejects a FLAGGED task.

Request:
```json
{
  "id": "task-1234",
  "status": "SUCCESS",
  "reason": "Price confirmed by merchant"
}
```

---

**`GET /api/agent/stream`**

Server-Sent Events stream. Connect once and receive real-time events:
```
data: {"type":"TASK_COMPLETED","task":{...},"attempts":1}
data: {"type":"TASK_OVERRIDDEN","task":{...}}
```

Frontend usage:
```ts
const es = new EventSource('http://localhost:3001/api/agent/stream');
es.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

### Voice — `/api/voice`

---

**`GET /api/voice/presets`**

Returns all Malayalam voice command presets.

Response:
```json
[
  {
    "id": "preset-1",
    "title": "Add Tomato Stock",
    "titleMl": "തക്കാളി ചേർക്കൂ",
    "malayalamAudioText": "15 കിലോ തക്കാളി ₹40ൽ ചേർക്കൂ",
    "englishTranslation": "Add 15 kg tomato at ₹40/kg",
    "confidence": 96.8,
    "category": "inventory"
  }
]
```

---

**`POST /api/voice/transcribe`**

Accepts audio file, preset ID, or raw text. Runs through Whisper (Phase 2)
or mock transcription (Phase 1). Auto-pipes to Reflection Engine.

Form-data options (send one):
- `audio` — actual audio file (WAV/MP3/OGG, max 15 MB)
- `presetId` — string ID of a voice preset
- `rawText` — plain text to treat as transcript

Body params:
- `language` — `"ml"` or `"en"` (default: `"ml"`)
- `autoExecute` — `"true"` (default) runs reflection loop immediately

Response (with `autoExecute=true`):
```json
{
  "transcription": {
    "transcript": "Add 15 kg of tomato...",
    "transcriptMl": "15 കിലോ തക്കാളി...",
    "confidence": 96.8,
    "engine": "whisper.cpp (base-v3-indic)"
  },
  "agentExecution": {
    "taskLog": { ... },
    "attempts": 1
  }
}
```

---

### Invoices — `/api/invoices`

---

**`GET /api/invoices`** — List all invoices

**`GET /api/invoices/:id`** — Get one invoice

---

**`POST /api/invoices/parse`**

Upload a vendor bill photo. Gemini Flash reads it (Phase 2) or mock
data is returned (Phase 1).

Form-data:
- `invoiceImage` — image file (JPEG/PNG, max 10 MB)
- `claimedTotal` — number (the printed total on the paper bill)
- `vendorName` — optional string

Response:
```json
{
  "success": true,
  "invoice": {
    "id": "inv-1234",
    "invoiceNo": "MS/24-25/3271",
    "vendorName": "MALABAR SPICES & GENERAL MERCHANT",
    "grandTotal": 37908.4,
    "status": "verified",
    "guardrailsPassed": true,
    "varianceAmount": 0,
    "items": [ ...5 items with HSN codes ]
  },
  "guardrail": { "passed": true, "variance": 0 }
}
```

If claimed total doesn't match calculated total:
```json
{
  "guardrail": { "passed": false, "variance": 146.60 }
}
```
→ invoice `status: "flagged"`, shows in "! Needs you"

---

**`POST /api/invoices/:id/verify`**

Merchant approves or flags a parsed invoice.

Request:
```json
{
  "status": "verified",
  "notes": "Confirmed with supplier",
  "syncInventory": true
}
```

When `syncInventory: true` and `status: "verified"`:
- For each line item in the invoice, finds matching inventory item
- Adds the invoice qty to `currentStock` automatically

---

**`POST /api/invoices`** — Create invoice manually (full `InvoiceData` body)

---

### WhatsApp — `/api/whatsapp`

---

**`GET /api/whatsapp/conversations`** — All conversation threads

**`GET /api/whatsapp/conversations/:id`** — Single thread with messages

---

**`POST /api/whatsapp/send`**

Send a message from merchant to customer.

Request:
```json
{
  "conversationId": "conv-001",
  "text": "Your order is ready for pickup.",
  "textMl": "താങ്കളുടെ ഓർഡർ തയ്യാറായി.",
  "hasPaymentLink": true,
  "paymentAmount": 1200
}
```

---

**`GET /api/whatsapp/webhook`** — Meta verification challenge (needed for live setup)

**`POST /api/whatsapp/webhook`** — Meta sends incoming messages here.

When a customer message arrives:
1. Message saved to conversation thread
2. Reflection engine runs automatically
3. Agent reply saved to thread (sender: 'agent')

No token needed for Phase 1 — webhook only activates when Meta calls it.

---

### Inventory — `/api/inventory`

---

**`GET /api/inventory`** — Full stock list

**`GET /api/inventory/alerts`** — Only items at or below reorder level

Response:
```json
{
  "count": 3,
  "items": [
    { "name": "Rice", "currentStock": 8, "reorderLevel": 20, "unit": "kg" }
  ]
}
```

---

**`POST /api/inventory`** — Add new item

Required fields: `name`, `currentStock`, `unitPrice`

---

**`PUT /api/inventory/:id`** — Update item

Includes price guardrail: if price changes >30%, response includes:
```json
{
  "item": { ...updated },
  "warning": "Price changed by 45.2% (exceeds 30% safety guardrail)"
}
```

---

**`DELETE /api/inventory/:id`** — Remove item

---

### Appointments — `/api/appointments`

---

**`GET /api/appointments`** — All bookings

**`POST /api/appointments`** — Create booking

Required: `customerName`, `phone`, `service`, `date`, `timeSlot`

---

**`PATCH /api/appointments/:id/status`**

Request:
```json
{ "status": "confirmed" }
```

Valid values: `"confirmed"` | `"pending"` | `"completed"`

---

### Settings — `/api/settings`

---

**`GET /api/settings`** — Returns `{ profile, settings }`

**`PUT /api/settings/profile`** — Update shop name, owner, GSTIN, phone, etc.

**`PUT /api/settings/preferences`** — Update toggles and UPI ID

Request:
```json
{
  "upiId": "malabar@ybl",
  "notifyWhatsapp": true,
  "notifyLowStock": true,
  "autoInvoiceGeneration": false
}
```

---

### Health — `/api/health`

**`GET /api/health`**

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-04T10:00:00Z",
  "uptimeSeconds": 3600,
  "whisperEngine": { "type": "whisper.cpp", "status": "ready", "latencyMs": 142 },
  "llmEngine": { "primary": "Gemini 2.0 Flash", "status": "connected" },
  "database": { "type": "PostgreSQL + pgvector", "status": "connected" },
  "redis": { "status": "connected", "activeJobs": 0 },
  "memoryUsageMb": 85.4
}
```

---

## Environment Variables

File: `backend/.env` (copy from `.env.example`)

| Variable | Needed for | Phase |
|---|---|---|
| `PORT` | Server port (default 3001) | Phase 1 |
| `GEMINI_API_KEY` | Invoice vision parsing | Phase 2 |
| `GROQ_API_KEY` | LLM fallback for intent | Phase 2 |
| `WHISPER_CPP_PATH` | Real voice transcription | Phase 2 |
| `WHATSAPP_API_TOKEN` | Live WhatsApp messages | Phase 3 |
| `WHATSAPP_PHONE_NUMBER_ID` | Live WhatsApp messages | Phase 3 |
| `WHATSAPP_VERIFY_TOKEN` | Meta webhook verify | Phase 3 |
| `DATABASE_URL` | PostgreSQL (Prisma) | Phase 3 |
| `REDIS_URL` | BullMQ job queues | Phase 3 |

**Phase 1 needs none of these.** The server starts with defaults.

---

## Shared Package — `@msme/shared`

Lives in `/shared/src/`. Both frontend and backend import from here.

Key exports:
```ts
// Pure math — no side effects, fully testable
calculateInvoiceTotals(items, gstRate)     // → { subTotal, cgst, sgst, grandTotal }
validateInvoiceGuardrails(claimed, actual) // → { passed, variance }

// Constants
CONFIDENCE_THRESHOLD_REVIEW = 80  // below this → FLAGGED
MAX_PRICE_DEVIATION_PERCENT = 30   // price change limit

// Zod schemas (types derived from these — never drift)
AgentTaskLogSchema
InvoiceDataSchema
InventoryItemSchema
// … etc
```

---

## Common Use Cases End-to-End

### Voice → Stock update

```
Merchant speaks Malayalam
   ↓ POST /api/voice/transcribe  (with audio or presetId)
   ↓ Reflection engine: GENERATE → EXECUTE → CRITIQUE → REFINE
   ↓ db_write tool: finds "Country Tomato", adds 15 kg
   ↓ AgentTaskLog saved, status: SUCCESS
   ↓ GET /api/agent/logs → Overview shows "✓ Done"
```

### WhatsApp bill request → payment sent

```
Customer WhatsApp: "ബിൽ അയക്കൂ"
   ↓ POST /api/whatsapp/webhook  (Meta calls this)
   ↓ Reflection engine: detects "bill" / "send"
   ↓ whatsapp_send tool: finds customer conversation, adds payment link message
   ↓ GET /api/whatsapp/conversations → WhatsApp tab shows new message
```

### Invoice photo → inventory auto-sync

```
Merchant uploads supplier bill photo
   ↓ POST /api/invoices/parse  (image file)
   ↓ Gemini reads items + totals (Phase 2) / mock data (Phase 1)
   ↓ validateInvoiceGuardrails: claimed ₹38,000 vs calculated ₹37,908 → PASS
   ↓ Invoice saved, status: verified
   ↓ POST /api/invoices/:id/verify  { syncInventory: true }
   ↓ Each line item qty added to inventory automatically
   ↓ GET /api/inventory → stock updated
```

### Flagged task → merchant override

```
Voice command: price ₹6800/kg (was ₹680) — 900% spike
   ↓ Reflection engine → critique fails → 3 retries → FLAGGED
   ↓ Overview shows "! Needs you" card
   ↓ Merchant taps → sees reason: "Price spike 900%"
   ↓ POST /api/agent/override  { id, status: "SUCCESS", reason: "New market price" }
   ↓ db_write re-runs with merchant approval
   ↓ Stock updated, log updated to SUCCESS
```
