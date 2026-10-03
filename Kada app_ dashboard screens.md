# Kada App — Vernacular MSME Dashboard & Operations Screens

> **Specification & Screen Flow Document**  
> Source of truth for the Kada mobile and web merchant dashboard interface. Designed mobile-first (375px viewport) adhering strictly to the **Kada Design System** (`kada-design-system.md`): calm, light, premium emerald tones, and vernacular-first clarity.

---

## 📱 Global Navigation & App Shell

Persistent navigation structure across the merchant operations experience.

### Top App Bar (Header)
* **Left**: Brand Mark `[ കട / Kada ]` linking to `#home`
* **Center / Shop Identity**: 
  * Avatar badge: `[A]` (Circle tile, `--soft` background, `--accent-d` bold letter)
  * Shop Name: **Anitha's Tailoring**
  * Sub-badge: *Sample shop* (`--muted`, 0.75rem)
* **Right**: Setup / Profile button (`[A](#setup)`)

### Bottom Dock Navigation (Mobile First)
Persistent 4-tab thumb navigation anchored to viewport bottom with safe-area insets (`env(safe-area-inset-bottom)`):

| Tab Icon & Label | Route Anchor | Active State | Purpose |
|---|---|---|---|
| 🏠 **Home** | `[Home](#home)` | `--soft` pill fill, `--accent-d` text/icon | Today's pulse, KPI stats, urgent triage, bookings |
| 💬 **Inbox** | `[Inbox](#inbox)` | `--soft` pill fill, `--accent-d` text/icon | WhatsApp customer conversations, instant replies |
| 🧾 **Bills** | `[Bills](#bills)` | `--soft` pill fill, `--accent-d` text/icon | Camera receipt reader, clean records, ledger |
| ⚡ **Activity** | `[Activity](#activity)` | `--soft` pill fill, `--accent-d` text/icon | Plain-words agent log & autonomous reflection steps |

---

## Screen 1: Home Dashboard (`#home`)

The daily morning cockpit for the shop owner, designed for quick scanning with one hand.

```
+-------------------------------------------------------+
|  [Kada]           [A] Anitha's Tailoring       [A]     |
|                       Sample shop                     |
+-------------------------------------------------------+
|  നമസ്കാരം, അനിത                                       |
|  Good morning, Anitha                                 |
|  Here is what Kada handled for you today.             |
+-------------------------------------------------------+
|  [⚡ Kada is handling messages]      [TOGGLE: ON]      |
|  Switch off to take control yourself.                 |
+-------------------------------------------------------+
|  +--------------+--------------+                      |
|  | 12           | 5            |                      |
|  | Bookings     | Bills read   |                      |
|  +--------------+--------------+                      |
|  | 38           | 2            |                      |
|  | Chats handled| Need you     |                      |
|  +--------------+--------------+                      |
+-------------------------------------------------------+
|  NEEDS YOU (2)                                        |
|  [!] Bulk order from Rahul                   10:42 >  |
|      40 uniforms by the 15th                          |
|  [!] Rice stock is low                       09:05 >  |
|      20 kg left, reorder drafted                      |
+-------------------------------------------------------+
|  TODAY'S BOOKINGS                                     |
|  [10:30] Suresh, 2 people                   [Booked]  |
|          Fitting, moved to 10:30                      |
|  [16:00] Meera                              [Booked]  |
|          Blouse fitting, 4:00 pm                      |
+-------------------------------------------------------+
|  Sample data for illustration.                        |
+-------------------------------------------------------+
|  [ Home ]      [ Inbox ]      [ Bills ]    [ Activity]|
+-------------------------------------------------------+
```

### 1.1 Header & Greeting
* **Vernacular Salutation**: `നമസ്കാരം, അനിത` (Noto Sans Malayalam, 1.25rem, `--accent-d`)
* **H1 Headline**: `# Good morning, Anitha` (Newsreader 500 serif, 2rem, `--ink`)
* **Subtitle**: `Here is what Kada handled for you today.` (Hanken Grotesk, 0.95rem, `--muted`)

### 1.2 Autonomous Mode Switch (Safety Toggle)
* **Status**: **Kada is handling messages** (Active / Green mode)
* **Subtext**: *Switch off to take control yourself.*
* **Component**: Pill switch (`3.4rem x 2rem`), track `--accent`, white knob. Toggling shifts to: *"You are in control. New messages wait for you."*

### 1.3 Key Operational Metrics (4-Tile KPI Grid)
Grid layout: 2 columns, gaps 12px, cards `--surface` with 1px `--line` and radius 1.2rem.

1. **12** `Bookings` — Confirmed appointments for today
2. **5** `Bills read` — Supplier invoices parsed and balanced
3. **38** `Chats handled` — Routine customer queries autonomously answered
4. **2** `Need you` — High-value leads or stock alerts requiring human decision

### 1.4 "Needs you" Urgent Triage Feed
High-priority items needing immediate merchant review. Cards styled with subtle amber border (`#c58a1f`) and soft amber background (`#f6ecd3`).

* **Item 1: Lead Alert**
  * Icon / Badge: `!` (Amber badge `#c58a1f` on `#f6ecd3`)
  * Title: **Bulk order from Rahul**
  * Detail: `40 uniforms by the 15th`
  * Timestamp: `10:42`
  * Action: Deep link to `[Inbox](#inbox)`
* **Item 2: Stock Alert**
  * Icon / Badge: `!` (Amber badge `#c58a1f` on `#f6ecd3`)
  * Title: **Rice stock is low**
  * Detail: `20 kg left, reorder drafted`
  * Timestamp: `09:05`
  * Action: Deep link to `[Activity](#activity)`

### 1.5 Today's Bookings
Timeline schedule cards:
* **Booking 1**:
  * Time badge: `10:30` (original request 10:00, autonomous collision resolved)
  * Customer & Group: **Suresh, 2 people**
  * Note: *Fitting, moved to 10:30*
  * Status Badge: `Booked` (Soft green pill: `--soft` fill, `--accent-d` text)
* **Booking 2**:
  * Time badge: `4:00 pm` (`16:00`)
  * Customer: **Meera**
  * Note: *Blouse fitting, 4:00 pm*
  * Status Badge: `Booked` (Soft green pill: `--soft` fill, `--accent-d` text)

### 1.6 Transparency Footer
* Footnote: *Sample data for illustration.* (`--muted`, 0.8rem)

---

## Screen 2: WhatsApp Inbox (`#inbox`)

Unified customer communication center with 24/7 automated vernacular replies.

```
+-------------------------------------------------------+
|  [< Home]                  WhatsApp                    |
+-------------------------------------------------------+
|  # Inbox                                              |
|  Every customer message in one place.                 |
+-------------------------------------------------------+
|  [ All (38) ]   [ Needs Reply (2) ]   [ Automated ]   |
+-------------------------------------------------------+
|  [R] Rahul (Uniform Order)                   10:42    |
|      "Need 40 sets school uniform by 15th"   [! Alert]|
|                                                       |
|  [M] Meera                                   10:20    |
|      "Kada: Blouse stitching starts at ₹350"  [✓ Auto]|
|                                                       |
|  [S] Suresh                                  09:50    |
|      "Kada: Confirmed fitting for 2 at 10:30" [✓ Done]|
+-------------------------------------------------------+
|  Select a chat to see the conversation.               |
+-------------------------------------------------------+
|  [ Home ]      [ Inbox ]      [ Bills ]    [ Activity]|
+-------------------------------------------------------+
```

### 2.1 Screen Header
* **Eyebrow**: `WhatsApp` (`--accent`, 0.8rem, uppercase, letter-spacing 0.12em)
* **H1 Title**: `# Inbox` (Newsreader 500 serif)
* **Description**: `Every customer message in one place.`
* **Help Tip**: `Select a chat to see the conversation.`

### 2.2 Key Features & Controls
* **Customer List**:
  * Incoming voice notes and text messages translated and summarized in English and Malayalam.
  * Instant badges: `[Needs you]` (Amber) for orders and custom questions; `[Done]` (Soft green) for automated bookings and pricing inquiries.
* **Autonomous Takeover**: One-tap toggle to reply manually or let Kada continue managing routine FAQs.

---

## Screen 3: Bill Reader (`#bills`)

Vision AI turning paper supplier slips into structured, balanced accounting records.

```
+-------------------------------------------------------+
|  [< Home]                 Bill reader                 |
+-------------------------------------------------------+
|  # Bills                                              |
|  Photograph a bill. Kada saves tidy records.          |
+-------------------------------------------------------+
|  +-------------------------------------------------+  |
|  |           [ CAMERA / UPLOAD AREA ]              |  |
|  |       [+] Take photo of supplier bill           |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
|  RECENT BILLS                                         |
|  +-------------------------------------------------+  |
|  | SREE LAKSHMI TRADERS                 02-10-2026 |  |
|  | Alappuzha · 3 items · Total: ₹4,820     [✓ Balanced|
|  | - Rice 50 kg : ₹2,400                           |  |
|  | - Sugar 25 kg : ₹1,100                          |  |
|  | - Oil 10 L : ₹1,320                             |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
|  [ Home ]      [ Inbox ]      [ Bills ]    [ Activity]|
+-------------------------------------------------------+
```

### 3.1 Screen Header
* **Eyebrow**: `Bill reader`
* **H1 Title**: `# Bills`
* **Description**: `Photograph a bill. Kada saves tidy records.`

### 3.2 Visual Processing Specifications
* **Capture Trigger**: One-tap camera button (min 48px height) optimized for mobile capture.
* **Vision Parsing Result**:
  * Supplier entity: `Sree Lakshmi Traders, Alappuzha`
  * Date: `02-10-2026`
  * Itemized breakdown: Rice (50 kg / ₹2,400), Sugar (25 kg / ₹1,100), Oil (10 L / ₹1,320)
  * Math verification: `total_matches_items: true` (Total: `₹4,820`)
  * Export options: Tidy JSON, CSV, or WhatsApp ledger copy.

---

## Screen 4: Agent Activity Log (`#activity`)

The autonomous reflection trace: plain-language audit trail of every autonomous task, check, and correction.

```
+-------------------------------------------------------+
|  [< Home]                  Agent log                  |
+-------------------------------------------------------+
|  # Activity                                           |
|  What Kada did, in plain words.                       |
+-------------------------------------------------------+
|  ! 10:42  Bulk order enquiry from Rahul               |
|           Lead alert sent to you                      |
|                                                       |
|  ✓ 10:20  Replied to a price question                 |
|           Meera, blouse stitching                     |
|                                                       |
|  ✓ 09:50  Booked fitting for 2                        |
|           Tap to see the checks                       |
|           |-- 1. Draft the booking                    |
|           |-- 2. Check free slots                     |
|           |-- 3. Review: clash found at 10:00         |
|           `-- 4. Fix: moved to 10:30                  |
|                                                       |
|  ✓ 09:30  Read a supplier bill                        |
|           Sree Lakshmi Traders, 4,820                 |
|                                                       |
|  ! 09:05  Rice stock is low                           |
|           Reorder drafted, waiting for you            |
+-------------------------------------------------------+
|  [ Home ]      [ Inbox ]      [ Bills ]    [ Activity]|
+-------------------------------------------------------+
```

### 4.1 Screen Header
* **Eyebrow**: `Agent log`
* **H1 Title**: `# Activity`
* **Description**: `What Kada did, in plain words.`

### 4.2 Reflection Loop Event Stream
Chronological activity timeline with distinct status badges and expandable reflection steps:

1. **10:42** — `!` **Bulk order enquiry from Rahul**
   * *Lead alert sent to you*
   * Type: Alert / Needs attention (Amber indicator `#c58a1f`)

2. **10:20** — `✓` **Replied to a price question**
   * *Meera, blouse stitching*
   * Type: Autonomous execution (Done badge `--soft`/`--accent-d`)

3. **09:50** — `✓` **Booked fitting for 2**
   * *Tap to see the checks* (Reflection Step Disclosure Tree):
     * 🔹 **Draft the booking**: Parsed customer voice note request for 10:00 AM.
     * 🔹 **Check free slots**: Cross-referenced calendar database.
     * ⚠️ **Review: clash found at 10:00**: Existing appointment detected.
     * ✅ **Fix: moved to 10:30**: Autonomous reschedule proposed, customer accepted via WhatsApp.

4. **09:30** — `✓` **Read a supplier bill**
   * *Sree Lakshmi Traders, 4,820*
   * Type: Vision extraction completed and verified.

5. **09:05** — `!` **Rice stock is low**
   * *Reorder drafted, waiting for you*
   * Type: Inventory threshold trigger (Draft purchase order pending approval).

---

## Screen 5: Getting Started / 4-Step Setup (`#setup`)

Zero-friction merchant onboarding completed entirely on a mobile phone in under two minutes.

```
+-------------------------------------------------------+
|  Getting started                                      |
|  # Live in 2 minutes                                  |
|  Step 1 of 4                                          |
|  [====---------------------------------------------]  |
+-------------------------------------------------------+
|  ### Name your shop                                   |
|  Business name: [ Anitha's Tailoring                ] |
+-------------------------------------------------------+
|  ### Set your hours                                   |
|  Opening time: [ 09:00 AM ]  Closing time: [ 08:00 PM]|
+-------------------------------------------------------+
|  ### Add your first service                           |
|  Name: [ Blouse Stitching ]  Price (rupees): [ 350  ] |
+-------------------------------------------------------+
|  ### Send a voice note                                |
|  Tap and say something in Malayalam                   |
|  [  (🎙️) Tap to Speak Malayalam  ]                    |
|  Result: "നാളെ 10 മണിക്ക് മീരയുടെ ബ്ലൗസ് ഫിറ്റിംഗ്"   |
|  ✓                                                    |
+-------------------------------------------------------+
|  ### You are live                                     |
|  Kada is ready to take your customers.                |
|                                                       |
|  [ Go to home -> ]                                    |
+-------------------------------------------------------+
```

### 5.1 Wizard Header
* **Eyebrow**: `Getting started`
* **H1 Title**: `# Live in 2 minutes`
* **Progress Stepper**: `Step 1 of 4` (Progress bar fills 25% per completed stage)

### 5.2 Step-by-Step Configuration Flow
* **Step 1: Name your shop**
  * Input label: `Business name`
  * Placeholder/Value: *Anitha's Tailoring*
* **Step 2: Set your hours**
  * Input labels: `Opening time` & `Closing time`
  * Values: *9:00 AM – 8:00 PM*
* **Step 3: Add your first service**
  * Input labels: `Name` & `Price (rupees)`
  * Values: *Blouse Stitching · ₹350*
* **Step 4: Send a voice note (Vernacular Calibration)**
  * Instruction: *Tap and say something in Malayalam*
  * User Action: Tap mic button, speaks Malayalam command
  * Validation: Recognition confirms `✓`
* **Step 5: Completion State**
  * Success Header: `### You are live`
  * Subtitle: `Kada is ready to take your customers.`
  * CTA Button: `[Go to home](#home)` (Primary pill button, `--accent`, 48px height)

---

## Screen 6: Voice Assistant Overlay (`#listening`)

Modal / Floating bottom sheet triggered by the voice button from any screen or WhatsApp.

```
+-------------------------------------------------------+
|                                                       |
|            ((((    🎙️ LISTENING...    ))))            |
|                                                       |
|  "നാളെ വൈകുന്നേരം നാലുമണിക്ക്                         |
|   മീരയ്ക്ക് ബ്ലൗസ് ഫിറ്റിംഗ് ബുക്ക് ചെയ്യുക"           |
|                                                       |
|  +-------------------------------------------------+  |
|  | Booking saved: Meera, tomorrow 4:00 pm        ✓ |  |
|  +-------------------------------------------------+  |
|                                                       |
+-------------------------------------------------------+
```

### 6.1 State Progression
1. **Trigger**: Floating mic tap or incoming WhatsApp audio note.
2. **Listening State**: Ambient pulsing sage aura (`#c4e8d3` to `#f0f6f1`).
3. **Live Transcript**: Malayalam speech rendered in Noto Sans Malayalam.
4. **Autonomous Resolution Toast**:
   * Text: `Booking saved: Meera, tomorrow 4:00 pm ✓`
   * Badge: Green checkmark pill (`--soft` background, `--accent-d` text).
   * Result: Immediately reflected on `#home` and `#activity`.

---

## Component & Token Reference (Aligned to `kada-design-system.md`)

* **Colors**: Background `--bg` (`#f8fbf8`), Surface `--surface` (`#ffffff`), Inset `--tint` (`#f0f6f1`), Accent `--accent` (`#3f7a5c`), Accent Dark `--accent-d` (`#2c5a43`), Border `--line` (`#dde7df`), Text `--ink` (`#1b2a23`), Muted `--muted` (`#5f7167`).
* **Alert Tokens**: Attention Dot `#c58a1f`, Text `#8a5f0f`, Background `#f6ecd3`.
* **Typography**: Headings in **Newsreader 500**, Body in **Hanken Grotesk**, Malayalam text in **Noto Sans Malayalam**.
* **Touch Targets**: All buttons, links, and cards adhere to minimum 40px–48px hit areas for effortless one-handed thumb interaction.