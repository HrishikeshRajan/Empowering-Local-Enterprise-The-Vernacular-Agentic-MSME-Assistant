# Kada — Vernacular Agentic MSME Assistant

An AI agent that speaks Malayalam and runs the day-to-day of a small shop:
books appointments, reads invoices, answers WhatsApp, and manages stock —
all triggered by voice in the merchant's own language.

---

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  MERCHANT (phone / desktop)                                     │
│                                                                 │
│   Voice (Malayalam) ──► WhatsApp ──► Dashboard                 │
└────────────┬────────────────┬──────────────┬───────────────────┘
             │                │              │
             ▼                ▼              ▼
┌────────────────────────────────────────────────────────────────┐
│  FRONTEND  (React + Vite)   localhost:5173                     │
│                                                                │
│  LandingPage → KadaIntro animation → Dashboard                 │
│                                                                │
│  Pages: Overview | WhatsApp | Invoices | Voice Log             │
│         Inventory | Appointments | Settings                    │
│                                                                │
│  VoiceModal (bottom sheet) — tap mic → Malayalam text          │
│  KadaIconSprite — SVG sprite, loaded once                      │
│  UI primitives (ui/index.tsx) — Card, Tile, Row, Sheet …       │
└────────────────────────┬───────────────────────────────────────┘
                         │  REST API  (fetch, localhost:3001)
                         │  POST /api/agent/process
                         │  GET  /api/agent/logs
                         │  POST /api/voice/transcribe
                         │  POST /api/invoices/parse
                         │  GET|POST /api/whatsapp/webhook
                         │  …
┌────────────────────────▼───────────────────────────────────────┐
│  BACKEND  (Express + TypeScript)   localhost:3001              │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  REFLECTION ENGINE  (the brain)                         │  │
│  │                                                         │  │
│  │  Input (Malayalam text / voice transcript)              │  │
│  │      │                                                  │  │
│  │      ▼                                                  │  │
│  │  1. GENERATE — parse intent, pick tool, set params      │  │
│  │      │                                                  │  │
│  │      ▼                                                  │  │
│  │  2. EXECUTE — run the tool (db_write, whatsapp_send…)   │  │
│  │      │                                                  │  │
│  │      ▼                                                  │  │
│  │  3. CRITIQUE — guardrails: price spike? zero amount?    │  │
│  │      │                                                  │  │
│  │      ├── pass → 4. REFINE → save log → return ✓ Done   │  │
│  │      │                                                  │  │
│  │      └── fail (up to 3×) → ! Needs you (human review)  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Routers:  agent | voice | invoices | whatsapp                 │
│            inventory | appointments | settings | health        │
└────────────────────────┬───────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌──────────────────┐        ┌─────────────────────┐
│  PostgreSQL      │        │  External APIs       │
│  + pgvector      │        │                      │
│                  │        │  Whisper (speech→text)│
│  BusinessProfile │        │  Gemini Flash (vision)│
│  InventoryItem   │        │  WhatsApp Cloud API  │
│  Invoice         │        │  UPI payment links   │
│  Appointment     │        └─────────────────────┘
│  AgentTaskLog    │
│  Embeddings      │
└──────────────────┘
```

---

## How the Agent Works (Simple)

A merchant says in Malayalam:  
**"തക്കാളി 15 കിലോ ₹40 ൽ ചേർക്കൂ"** *(Add 15 kg tomato at ₹40)*

```
Malayalam text
     │
     ▼ GENERATE
     Detect keywords → tool: db_write, qty: 15, product: tomato, price: ₹40
     │
     ▼ EXECUTE
     Add stock to in-memory store (later: Prisma → PostgreSQL)
     │
     ▼ CRITIQUE
     Check: is ₹40 a >30% spike from last price? → No → pass
     │
     ▼ REFINE
     Save to AgentTaskLog, return summary in Malayalam
     │
     ▼ DASHBOARD
     Overview shows "✓ Done — tomato +15 kg added"
```

If the price were suspicious (say ₹400), critique fails → retries 2 more times →  
escalates to **"! Needs you"** card on the Overview page.

---

## User Flow

```
[Merchant opens Kada on phone]
        │
        ▼
   Landing Page
   (intro animation → hero)
        │
        ├── Tap "ആരംഭിക്കൂ" (Get Started)
        │         │
        │         ▼
        │    Dashboard → Overview
        │         │
        │         ├── See today's stats (bookings, bills, chats)
        │         ├── "Needs you" card — items that need approval
        │         ├── "Today's bookings" card
        │         └── Recent agent activity log
        │
        ├── Tap FAB mic button (bottom center)
        │         │
        │         ▼
        │    Voice Sheet opens
        │    Tap mic → speak in Malayalam
        │    Agent processes → shows result
        │    Tap "ചെയ്യൂ" (Execute) → navigates to Voice Activity tab
        │
        ├── WhatsApp tab
        │    View conversations, see agent auto-replies, send manually
        │
        ├── Bills tab
        │    Scan / upload invoice photo → Gemini reads it → shows items
        │
        ├── Stock tab
        │    List all inventory, add/edit items, see low-stock alerts
        │
        ├── Bookings tab
        │    View appointments, confirm pending ones
        │
        └── Setup tab
             Business profile, UPI ID, notification preferences
```

---

## Where to Start (Phase-by-phase plan)

### Phase 1 — Frontend works alone with mock data  ← YOU ARE HERE

Everything in `frontend/src/mockData.ts`. No backend needed. Test in browser.

**How to run:**
```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

**What to verify:**
- [ ] Landing page loads, intro animation plays
- [ ] "Get Started" button opens dashboard
- [ ] Voice modal opens, tap mic, preset command appears, tap Execute
- [ ] All 7 sidebar tabs navigate correctly
- [ ] Overview shows stats, "Needs you" card, activity log
- [ ] Mobile bottom nav works (resize browser to < 900px)

---

### Phase 2 — Backend runs with in-memory store (no database yet)

The backend already has an in-memory `store.ts` — no PostgreSQL needed yet.

**How to run:**
```bash
cd backend
npm install
cp .env.example .env        # no real keys needed for mock mode
npm run dev
# open http://localhost:3001/api
```

**What to verify:**
- [ ] `GET  /api/health` returns `{ status: "healthy" }`
- [ ] `POST /api/agent/process` with body `{ "inputPrompt": "add 15kg tomato", "language": "ml" }` returns a task log
- [ ] `GET  /api/agent/logs` returns the log list
- [ ] `GET  /api/inventory` returns stock items

**Connect frontend to backend:**  
In `frontend/src/api/client.ts`, set `BASE_URL = 'http://localhost:3001'`.  
Then replace mock data calls in components with real `fetch()` calls one tab at a time.

---

### Phase 3 — Add PostgreSQL (real persistence)

1. Install PostgreSQL locally or use Docker:
   ```bash
   docker-compose up -d postgres
   ```
2. Set `DATABASE_URL` in `backend/.env`
3. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma db seed          # loads Kerala MSME sample data
   ```
4. Replace `store.ts` calls in routers with Prisma queries

---

### Phase 4 — Real voice (Whisper)

1. Install [whisper.cpp](https://github.com/ggerganov/whisper.cpp) locally or point to cloud endpoint
2. Set `WHISPER_ENDPOINT` in `.env`
3. `POST /api/voice/transcribe` accepts audio blob → returns Malayalam text
4. Frontend `VoiceModal` sends recorded audio instead of using preset text

---

### Phase 5 — WhatsApp live

1. Create a Meta Developer app, get `WHATSAPP_TOKEN` + `PHONE_NUMBER_ID`
2. Set values in `backend/.env`
3. Expose backend via ngrok: `ngrok http 3001`
4. Register webhook URL in Meta console: `https://your-ngrok.io/api/whatsapp/webhook`
5. Test by messaging the sandbox number

---

### Phase 6 — Invoice vision (Gemini)

1. Get `GEMINI_API_KEY` from Google AI Studio
2. Set in `backend/.env`
3. `POST /api/invoices/parse` accepts base64 image → Gemini Flash reads it → returns structured invoice

---

## Monorepo Structure

```
/
├── frontend/          React + Vite dashboard
│   └── src/
│       ├── components/    UI components
│       ├── components/ui/ KadaCard, KadaTile, KadaRow… reusable primitives
│       ├── styles/        dashboard.css  (design system)
│       ├── mockData.ts    all fake data for Phase 1
│       ├── types.ts       shared frontend types
│       └── api/client.ts  backend fetch wrapper
│
├── backend/           Express + TypeScript API
│   └── src/
│       ├── agent/         ReflectionEngine (brain), tools, schemas
│       ├── voice/         Whisper transcription router
│       ├── invoices/      Gemini vision router
│       ├── whatsapp/      WhatsApp Cloud webhook router
│       ├── inventory/     Stock CRUD router
│       ├── appointments/  Booking router
│       ├── settings/      Profile router
│       ├── data/          In-memory store (Phase 1–2), Prisma (Phase 3+)
│       └── health/        Uptime endpoint
│
├── shared/            @msme/shared — Zod schemas + TypeScript types
│   └── src/
│       ├── types.ts       AgentTaskLog, InvoiceData, etc.
│       └── index.ts       CONFIDENCE_THRESHOLD_REVIEW, MAX_PRICE_DEVIATION_PERCENT
│
└── docker-compose.yml PostgreSQL + Redis for Phase 3+
```

---

## Key Design Rules (from AGENTS.md)

| Rule | What it means in practice |
|------|--------------------------|
| Agent must use Reflection Loop | Every voice command goes Generate → Execute → Critique → Refine, max 3 retries |
| Cap retries at 3 | After 3 failures, show "! Needs you" — never silently drop |
| No LLM for finances | Price sanity and invoice totals use deterministic math, not AI guesses |
| Types from `@msme/shared` | Frontend and backend share the same Zod-derived types — no drift |
| Vernacular first | All user-facing text has both `en` and `ml` strings |
| Mobile first | Every screen works at 375px; desktop layout kicks in at 900px |

---

## Quick Reference — API endpoints

| Method | Path | What it does |
|--------|------|-------------|
| POST | `/api/agent/process` | Run a voice/text command through the reflection loop |
| GET | `/api/agent/logs` | Get all task execution logs |
| POST | `/api/voice/transcribe` | Convert audio blob → Malayalam text |
| GET | `/api/invoices` | List parsed invoices |
| POST | `/api/invoices/parse` | Parse invoice image with Gemini vision |
| GET | `/api/whatsapp/conversations` | All WhatsApp threads |
| POST | `/api/whatsapp/webhook` | Meta webhook receiver |
| GET | `/api/inventory` | All stock items |
| GET | `/api/inventory/alerts` | Low-stock items only |
| GET | `/api/appointments` | All bookings |
| GET | `/api/health` | Service health check |
