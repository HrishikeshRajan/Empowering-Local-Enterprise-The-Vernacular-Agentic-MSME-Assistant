# Engineering Guidelines & Coding Standards

This document establishes the core architectural rules for writing code across the **Kada / Vernacular Agentic MSME Assistant** repository. All contributors and AI agents must uphold these four foundational pillars:

---

## 1. 🏗️ Scalability
* **Monorepo Package Isolation**: Strict boundary separation across `frontend/`, `backend/`, and `shared/`. Common types, mathematical validators, and Zod schemas live solely in `@msme/shared`.
* **Stateless & Async-Ready**: Backend route handlers remain stateless; async background tasks (audio transcription, document vision, WhatsApp webhook retries) are dispatched via queues (Redis/BullMQ) rather than blocking the HTTP event loop.
* **Efficient Querying & Pagination**: Avoid unbounded queries. All ledger lists, WhatsApp conversations, and activity logs must support cursor-based or offset pagination.
* **Lean Client Bundles**: Prefer native CSS variables and lightweight utility functions over bulky third-party dependencies. Dynamic imports and lazy loading for heavy visualization modules.

---

## 2. 🧩 Design Patterns
* **Agentic Reflection Pattern (Generate → Execute → Critique → Refine)**:
  * Autonomous operations (voice appointment booking, inventory reconciliation, invoice parsing) execute through iterative evaluation.
  * Every task must adhere to the finite state machine: `Idle → Input Received → Processing → Awaiting Confirmation → Completed / Human Handoff`.
  * Guardrails: Cap reflection retries to 3 before escalating to merchant triage (`! Needs you`).
* **Strategy Pattern**:
  * Decouple external third-party engines (e.g. Speech-to-Text: self-hosted Whisper vs. cloud fallbacks; Vision: Gemini Flash vs. Tesseract) behind common provider interfaces.
* **Repository & Service Layer Pattern**:
  * Route controllers handle HTTP transport and validation only.
  * Business logic resides in dedicated Domain Services (`AppointmentService`, `InvoiceService`).
  * Database access is encapsulated in repositories or typed Prisma models.
* **Design System Token Architecture**:
  * Adhere strictly to the tokens defined in `kada-design-system.md` (`--bg`, `--surface`, `--tint`, `--line`, `--ink`, `--muted`, `--accent`, `--accent-d`, `--soft`). Never introduce ad-hoc colors or unbounded inline styles.

---

## 3. 🧪 Testability
* **Separation of Concerns**: Keep business calculations (e.g., invoice total cross-checks, slot conflict detection, tax calculations) in pure, side-effect-free functions.
* **Dependency Injection**: Accept external dependencies (HTTP clients, database stores, clock/timers) as parameters or injectable services to allow seamless mocking.
* **Deterministic Fixtures**: Maintain realistic Kerala MSME mock data (`mockData.ts`) for invoices, WhatsApp messages, and appointments to drive tests without live API keys.
* **Component Testability**:
  * Keep React UI components presentation-focused.
  * Encapsulate stateful data fetching and WebSocket/SSE connections into custom hooks.
  * Ensure all interactive buttons and inputs have accessible names or unique test IDs.

---

## 4. 📦 Modularity & Maintainability
* **Single Responsibility Principle (SRP)**: Each file, function, and component must serve a single clear purpose. Break complex monolithic screens into focused subcomponents (e.g., `StatTile`, `TriageCard`, `BookingRow`, `ReflectionTree`).
* **Contract-First Development**: Define schemas using Zod in `@msme/shared`. Derive TypeScript types directly from schemas to prevent drift between frontend, backend, and database.
* **Zero Technical Jargon in UI**: Code, logs, and user-facing notifications must clearly distinguish between autonomous actions (`✓ Done`) and merchant triage (`! Needs attention`) in plain vernacular language.
