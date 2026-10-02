# 🚀 Empowering Local Enterprise: The Vernacular Agentic MSME Assistant

> **The Hook:** Small businesses are the backbone of local economies, yet they are buried under fragmented communication, manual record-keeping, and language barriers. What if every micro-entrepreneur had an autonomous, multilingual Chief Operating Officer right in their pocket—capable of managing bookings, parsing invoices, and closing customer inquiries on WhatsApp while they sleep?

---

## 🎯 What is This Project?

The **Vernacular Agentic MSME Assistant** is an intelligent, autonomous workflow platform engineered specifically for regional micro-small-medium enterprises (MSMEs). By combining cutting-edge Large Language Models (LLMs), speech-to-text processing, and the **Reflection Design Pattern** (iterative generation, critique, and refinement), this system acts as a 24/7 autonomous operations manager. It understands local languages like Malayalam, automates routine administrative bottlenecks, and ensures high-precision business data processing without requiring technical expertise from the user.

> **Project Scope:** This is a personal project, self-hosted on affordable infrastructure. The architecture prioritizes minimal monthly cost (~₹500–₹1,500/month) while remaining production-capable.

---

## 👤 Target User & Use Case

### Primary Persona
- **Who:** Solo retail shop owner or 1–5 employee service business operator
- **Location:** Kerala Tier-2/3 cities (e.g., Thrissur, Kozhikode, Kollam)
- **Tech comfort:** Comfortable with WhatsApp; limited smartphone app usage
- **Pain points:** Manual billing, missed customer inquiries, no inventory visibility, language barrier with digital tools

### Minimum Viable User
A solo kirana/provision store owner who receives customer orders and supplier invoices via WhatsApp and currently maintains records in a paper ledger or basic spreadsheet.

---

## ✨ Core Features

1. **Multilingual Voice & Text Intelligence:**
   * Supports natural voice notes or text inputs in Malayalam and English.
   * Converts voice commands into structured intent data using **self-hosted Whisper** (whisper.cpp) — zero API cost.
   * Confidence threshold gating: transcriptions below 80% confidence are flagged for manual review.

2. **Autonomous Task & Operations Agent:**
   * Executes multi-step business actions (inventory checks, appointment confirmations, pricing validations) using a simple reflection loop in plain TypeScript.
   * Agent state machine: `Idle → Input Received → Processing → Awaiting Confirmation → Completed / Failed → Human Handoff`
   * Max reflection retries: 3. Beyond that, task is escalated to manual review.

3. **Smart Document & Invoice Parsing:**
   * Leverages Gemini Flash Vision (free tier) to extract data from supplier receipts, bills, and tax documents.
   * Output: clean, standardized JSON entities with field-level confidence scores.
   * Target accuracy: >95% field extraction rate.

4. **Automated WhatsApp Integration:**
   * Built on **Meta WhatsApp Cloud API** (free for first 1,000 conversations/month).
   * Handles the 24-hour session window policy for customer-initiated vs. business-initiated messages.
   * Manages delivery failures, read receipts, and opt-out events via webhook handling.
   * Centralizes incoming customer messages, handles routine inquiries 24/7.

5. **Multilingual Roadmap:**
   * **Phase 1 (MVP):** Malayalam + English
   * **Phase 2:** Hindi, Tamil — via self-hosted IndicWhisper (AI4Bharat) models

---

## 🛠️ Technology Stack (Lean & Low-Cost)

### Core Platform
| Component | Choice | Cost | Why Not The Enterprise Option |
|---|---|---|---|
| **Backend** | NestJS (TypeScript) | Free | Same — this is a solid choice at any scale |
| **Database** | PostgreSQL (single instance) | Free (included in VPS) | Replaces MySQL — better JSON support + pgvector built-in |
| **ORM** | Prisma | Free | Same — type-safe, great DX |
| **Vector Search** | pgvector (Postgres extension) | Free | Replaces Pinecone ($70/month minimum) |
| **Job Queue** | BullMQ + Redis | Free (included in VPS) | Same — but Redis runs on the same VPS |
| **Frontend** | Next.js + Tailwind CSS | Free | Same |
| **Hosting** | Single VPS (Hetzner / DigitalOcean) | ~₹400–₹800/month | Replaces AWS ECS Fargate (~₹5,000+/month) |

### AI & Voice Layer
| Component | Choice | Cost | Why Not The Enterprise Option |
|---|---|---|---|
| **LLM** | Google Gemini 2.0 Flash (free tier) | Free (15 RPM / 1M tokens/day) | Replaces GPT-4o (~₹2–5/1K tokens) |
| **LLM Fallback** | Groq (Llama 3.3 70B — free tier) | Free (30 RPM) | Replaces Anthropic Claude |
| **Voice Transcription** | Self-hosted whisper.cpp (base/small model) | Free (runs on VPS CPU) | Replaces OpenAI Whisper API (~₹0.50/min) |
| **Malayalam Whisper** | AI4Bharat IndicWhisper (self-hosted) | Free (runs on VPS) | Same model, just self-hosted |
| **Document Parsing** | Gemini Flash Vision (free tier) | Free | Replaces GPT-4o Vision + AWS Textract |
| **Agent Orchestration** | Plain TypeScript (custom reflection loop) | Free | Replaces LangGraph — simpler, no dependency |
| **Indian Language NLP** | AI4Bharat IndicTrans2 (self-hosted) | Free | Same |

### Infrastructure
| Component | Choice | Cost | Why Not The Enterprise Option |
|---|---|---|---|
| **VPS** | Hetzner CX32 (4 vCPU, 8GB RAM, 80GB SSD) | ~€7.50/month (~₹700) | Replaces ECS Fargate |
| **File Storage** | Cloudflare R2 (10GB free tier) | Free | Replaces AWS S3 |
| **CDN** | Cloudflare (free tier) | Free | Replaces AWS CloudFront |
| **Domain + SSL** | Cloudflare (free SSL) | ~₹800/year for domain | Replaces ACM |
| **Secrets** | `.env` files + docker secrets | Free | Replaces AWS Secrets Manager |
| **Monitoring** | Uptime Kuma (self-hosted) + Docker logs | Free | Replaces OpenTelemetry + X-Ray + Grafana |
| **CI/CD** | GitHub Actions (free tier) | Free | Same |
| **Reverse Proxy** | Caddy (auto HTTPS) | Free | Replaces NGINX + Certbot |
| **Auth** | Passport.js + custom JWT | Free | Replaces Clerk ($25+/month) |

---

## 💸 Monthly Cost Breakdown

| Item | Monthly Cost |
|---|---|
| Hetzner VPS (CX32 — 4 vCPU, 8GB RAM) | ~₹700 |
| Cloudflare R2 storage (within 10GB free tier) | ₹0 |
| Cloudflare CDN + SSL | ₹0 |
| Domain name (amortized) | ~₹65 |
| Gemini Flash API (free tier) | ₹0 |
| Groq API (free tier fallback) | ₹0 |
| WhatsApp Cloud API (first 1,000 conversations free) | ₹0 |
| Self-hosted Whisper | ₹0 |
| GitHub Actions CI/CD (free tier) | ₹0 |
| **Total (MVP)** | **~₹765/month** |

### If You Outgrow Free Tiers
| Upgrade Trigger | New Cost |
|---|---|
| Gemini free tier exhausted → Gemini Flash paid | +₹100–300/month |
| >1,000 WhatsApp conversations → Meta paid tier | +₹0.30–₹1.50 per conversation |
| Need GPU for faster Whisper → Hetzner CCX33 (8 vCPU, 32GB, shared GPU) | Upgrade to ~₹2,000/month |
| R2 exceeds 10GB free tier | +₹1.20/GB/month |
| **Scaled Total** | **~₹1,500–₹3,000/month** |

---

## 🔐 Security & Data Privacy

### Encryption & Transport
* **Data in transit:** TLS via Caddy auto-HTTPS (Let's Encrypt certificates).
* **Data at rest:** PostgreSQL `pgcrypto` extension for encrypting PII columns (phone numbers, business data).
* **Invoice images:** Stored in Cloudflare R2 private bucket; accessed only via signed URLs.

### Authentication
* **User auth:** Passport.js with local strategy + JWT access tokens (1-hour expiry) + refresh tokens (stored in httpOnly cookies).
* **WhatsApp identity:** Webhook signature verification using Meta's `X-Hub-Signature-256` header.
* **API security:** express-rate-limit middleware (100 req/min per IP).

### Compliance
* **India DPDPA 2023:** User consent collected at onboarding; data deletable on request.
* **Data retention:** Business data retained for 7 years (Indian tax law); customer PII deletable on request.

---

## 🤖 Agentic Architecture (Simplified)

### Reflection Design Pattern
```
User Input (Voice/Text via WhatsApp)
       ↓
[1. TRANSCRIBE]  → whisper.cpp converts voice → text (if voice note)
       ↓
[2. GENERATE]    → Gemini Flash parses intent → structured action JSON
       ↓
[3. EXECUTE]     → Tool function called (DB query / WhatsApp reply / Invoice parse)
       ↓
[4. CRITIQUE]    → Gemini Flash validates output against Zod schema + business rules
       ↓
[5. REFINE]      → If critique fails: retry with corrected prompt (max 3 retries)
       ↓
[SUCCESS] → Send WhatsApp reply  |  [FAIL] → Flag for manual review
```

### Agent Implementation (Plain TypeScript — No Framework)
```typescript
// Simplified agent reflection loop — no LangGraph needed
async function executeWithReflection(
  userInput: string,
  context: BusinessContext,
  maxRetries = 3
): Promise<AgentResult> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // 1. Generate: LLM parses intent
    const action = await gemini.parseIntent(userInput, context);

    // 2. Execute: dispatch tool call
    const result = await tools[action.tool](action.params);

    // 3. Critique: validate output
    const critique = await gemini.validateResult(result, action.expectedSchema);

    if (critique.isValid) {
      return { success: true, data: result, attempts: attempt + 1 };
    }

    // 4. Refine: feed critique back for next attempt
    userInput = `${userInput}\n\nPrevious attempt failed: ${critique.reason}`;
  }

  return { success: false, reason: 'Max retries exceeded', needsHumanReview: true };
}
```

### Agent Tools
| Tool | Description |
|---|---|
| `db_read` | Query inventory, appointments, customer records via Prisma |
| `db_write` | Create/update inventory items, bookings, invoices |
| `whatsapp_send` | Send template or session reply via Meta Cloud API |
| `invoice_parse` | Submit image to Gemini Flash Vision → extract key-value pairs |
| `calendar_check` | Query and update appointment availability |
| `inventory_query` | Check stock levels, trigger reorder alerts |

### Guardrails for Financial Data
* All numeric outputs validated against Zod schemas before DB write.
* Invoice total must match sum of line items ± ₹1 tolerance.
* Price changes >50% from historical average trigger a manual review flag.

### Agent Memory
* **Short-term:** Redis key per conversation thread (TTL: 30 minutes). Stored as simple JSON.
* **Long-term:** pgvector embeddings in PostgreSQL for business context (product catalogue, price history, customer preferences). No external vector DB needed.

---

## 📐 Implementation Plan

### Phase 1: Infrastructure & Backend Foundation
* **Duration:** 2 weeks
* **Goal:** VPS running, NestJS + Postgres + Redis operational.
* **Execution:**
  * Provision Hetzner VPS; install Docker, Caddy, PostgreSQL, Redis.
  * Initialize NestJS project with modules: `auth`, `agent`, `invoice`, `whatsapp`, `inventory`, `business-profile`.
  * Define Prisma schema for all entities; run initial migration.
  * Enable pgvector extension; create embedding table for business context.
  * Set up Passport.js JWT auth with refresh token rotation.
  * Configure BullMQ queues on local Redis instance.
  * Set up GitHub Actions CI/CD → Docker build → SSH deploy to VPS.
* **Success Criteria:** API running on VPS with HTTPS; all CRUD endpoints functional; CI/CD pipeline green.

### Phase 2: AI Engine & Voice Pipeline
* **Duration:** 3 weeks
* **Goal:** Voice-to-action pipeline working end-to-end.
* **Execution:**
  * Compile and deploy whisper.cpp on VPS (use `base` model for speed on CPU; upgrade to `small` if accuracy is insufficient).
  * Build voice note download → WAV conversion → whisper transcription pipeline.
  * Integrate Gemini Flash API for intent parsing with structured JSON output.
  * Implement the TypeScript reflection loop (`generate → execute → critique → refine`).
  * Register all agent tools and wire them to Prisma/Redis.
  * Set up Gemini Flash Vision endpoint for invoice image parsing.
  * Implement Zod schema validation for all agent outputs.
  * Build pgvector embedding pipeline: store product catalogue + price history as embeddings for context retrieval.
* **Success Criteria:** Voice note (Malayalam) → correct structured action in ≥85% of test cases (30 samples); invoice parsing ≥90% field accuracy on 20 test invoices.

### Phase 3: WhatsApp Integration & Automation
* **Duration:** 2 weeks
* **Goal:** Full WhatsApp bot operational.
* **Execution:**
  * Register with Meta WhatsApp Cloud API; configure webhook endpoint on Caddy.
  * Implement webhook signature verification (`X-Hub-Signature-256`).
  * Build message handler: route incoming text/voice/image to appropriate agent pipeline.
  * Submit message templates to Meta for approval (order confirmation, appointment reminder, payment request) — start early, approval takes 3–14 days.
  * Implement 24-hour session window tracking.
  * Handle delivery failures, read receipts, and opt-out webhook events.
  * Add idempotency on message processing (dedup on `message_id`).
* **Success Criteria:** End-to-end: merchant sends voice note on WhatsApp → agent processes → merchant receives structured reply; P95 response time <5 seconds.

### Phase 4: Frontend Dashboard
* **Duration:** 2 weeks
* **Goal:** Merchant dashboard for visibility and manual overrides.
* **Execution:**
  * Build Next.js app with Tailwind CSS; mobile-first responsive design.
  * Pages: Dashboard (agent activity feed), Inventory, Invoices, Customers, Settings.
  * Real-time agent status via Server-Sent Events (simpler than WebSocket for 1 VPS).
  * Manual override: merchant can correct agent actions and approve flagged items.
  * Deploy on same VPS behind Caddy reverse proxy; serve via Cloudflare CDN.
* **Success Criteria:** Dashboard loads in <2 seconds on 4G; merchant can view and correct all agent actions; Lighthouse mobile score ≥80.

### Phase 5: Testing, Hardening & Launch
* **Duration:** 1 week
* **Goal:** Stable enough for personal use and pilot testing.
* **Execution:**
  * Unit tests (Jest): ≥80% coverage on core services.
  * Integration test: full agent workflow with mocked Gemini responses.
  * Malayalam regression test set: 30 voice samples with known correct outputs.
  * Set up Uptime Kuma for VPS monitoring + Telegram alerts on downtime.
  * Docker Compose production config with restart policies and health checks.
  * PostgreSQL automated daily backups (pg_dump → Cloudflare R2).
* **Success Criteria:** All tests green; VPS uptime >99% over 1 week; backup/restore tested.

---

## 🗓️ Timeline

| Milestone | Week | Deliverable |
|---|---|---|
| **Infrastructure** | Week 1–2 | VPS + NestJS + Postgres + CI/CD running |
| **AI Pipeline** | Week 3–5 | Voice → intent → action pipeline working |
| **WhatsApp Bot** | Week 6–7 | Full WhatsApp integration live |
| **Dashboard** | Week 8–9 | Merchant dashboard deployed |
| **Hardening** | Week 10 | Tests, monitoring, backups |
| **Pilot Launch** | Week 10 | Test with 2–3 real merchants |

**Total: ~10 weeks to pilot-ready.**

---

## 📊 Success Metrics

| Metric | Target |
|---|---|
| Invoice parsing field accuracy | >90% |
| Malayalam voice transcription accuracy | >85% (WER <15%) |
| WhatsApp response latency P95 | <5 seconds |
| Agent task completion (no manual review) | >75% |
| Monthly hosting cost | <₹1,500 |
| VPS uptime | >99% |

---

## 💎 UI/UX Design Vision: Premium, Clean & Mobile-First

* **Minimalist Glassmorphism Aesthetic:** Clean cards, subtle gradients, and high-contrast typography. Typography: Inter (UI) + Noto Sans Malayalam (regional script).
* **Thumb-Friendly Navigation:** Action buttons and voice-recording triggers anchored at the bottom of the screen.
* **Zero-Clutter Experience:** Agent internals hidden behind human-readable dashboards with success badges and actionable alerts.
* **Malayalam Script Support:** All UI strings and invoice previews render Malayalam Unicode correctly. Tested on Android Chrome and iOS Safari.

---

## 🔧 Infrastructure Architecture

```
[Merchant Phone]
       │
       ├── WhatsApp ──► [Meta Cloud API Webhook]
       │                        │
       └── Browser  ──►  [Cloudflare CDN]
                                │
                    ┌───────────┴───────────┐
                    │   Hetzner VPS (CX32)  │
                    │                       │
                    │  [Caddy Reverse Proxy] │
                    │     ├── /api/* → NestJS│
                    │     └── /* → Next.js   │
                    │                       │
                    │  [NestJS Backend]      │
                    │   ├── Auth (Passport)  │
                    │   ├── Agent (TS loop)  │
                    │   ├── WhatsApp Module  │
                    │   ├── Invoice Parser   │
                    │   └── BullMQ Workers   │
                    │                       │
                    │  [PostgreSQL + pgvector]│
                    │  [Redis]              │
                    │  [whisper.cpp]         │
                    │                       │
                    │  [Uptime Kuma]         │
                    └───────────────────────┘
                                │
                    [Cloudflare R2 — invoice images]
                    [Gemini Flash API — LLM calls]
                    [Meta Cloud API — WhatsApp send]
```

### Single-VPS Setup (Docker Compose)
```yaml
services:
  app:        # NestJS backend + BullMQ workers
  frontend:   # Next.js (production build)
  postgres:   # PostgreSQL 16 + pgvector
  redis:      # Redis 7 (queues + cache)
  caddy:      # Reverse proxy + auto-HTTPS
  uptime:     # Uptime Kuma monitoring
```

### Backups
* PostgreSQL: daily `pg_dump` → compressed → uploaded to Cloudflare R2 (retention: 7 days).
* Invoice images: already in R2 (durable storage).
* Docker volumes: weekly tar backup to R2.

### Scaling Path (When You Outgrow 1 VPS)
| Trigger | Action |
|---|---|
| CPU >80% sustained | Upgrade VPS to CX42 (8 vCPU, 16GB — ~₹1,400/month) |
| Need GPU for Whisper | Add a Hetzner GPU server for Whisper only (~₹3,000/month) |
| >50 concurrent users | Move Postgres to managed DB (Neon free tier or Supabase) |
| Need multi-region | Move to Railway or Fly.io with edge deployment |
