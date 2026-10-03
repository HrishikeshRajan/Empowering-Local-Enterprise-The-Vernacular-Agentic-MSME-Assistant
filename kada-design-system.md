# Kada Design System Brief (for an LLM agent)

Use this document as the source of truth when building or extending the Kada landing page or app UI. Kada is a Malayalam and English voice assistant for small businesses in Kerala. The look is **calm, premium, light, and green**.

---

## 0. Instructions to the agent

1. Use only the tokens in this document. Do not invent new colors, fonts, radii or shadows.
2. Light theme only. Do not add dark mode.
3. One accent color (muted emerald). Everything else is white, off-white, sage tints and ink.
4. Design mobile first (375px), then scale up to desktop (1080px container).
5. Show the product working (animated demos) instead of describing it.
6. Never place two pill-shaped elements directly above or below each other on mobile.
7. Respect `prefers-reduced-motion` and keep every interactive target at least 40px high (primary buttons 48px).
8. Label any demo numbers as sample data.

---

## 1. Color palette

### Core tokens

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#f8fbf8` | Page background (off-white with a green tint) |
| `--surface` | `#ffffff` | Cards, nodes, chat bubbles, phone shell |
| `--tint` | `#f0f6f1` | Phone screen, inset panels, stat tiles |
| `--line` | `#dde7df` | All 1px borders and dividers |
| `--ink` | `#1b2a23` | Headings and body text |
| `--muted` | `#5f7167` | Secondary text, captions (about 5:1 on `--bg`) |
| `--accent` | `#3f7a5c` | Primary buttons, links, active states (white text on it is about 5.1:1) |
| `--accent-d` | `#2c5a43` | Hover state, text on soft green, icons |
| `--soft` | `#e3efe7` | Soft green fills: selected tab, chips, icon tiles, code card |
| `--on` | `#ffffff` | Text on `--accent` |

### Aura (ambient background glow)

Three blurred circles on a fixed, non-interactive layer behind the page. Blur is 70px and opacity .55 to .7.

| Name | Hex |
|---|---|
| Mint | `#c4e8d3` |
| Sky teal | `#d3ebef` |
| Warm cream | `#f1ebc9` |

The base gradient behind them runs `#f8fbf8` to `#f1f7f2`.

### Status colors (use sparingly)

| Meaning | Dot / border | Text | Fill |
|---|---|---|---|
| Done, success | `#3f7a5c` | `#2c5a43` | `#e3efe7` |
| Needs attention | `#c58a1f` | `#8a5f0f` | `#f6ecd3` |

### Special surfaces

| Use | Value |
|---|---|
| Workflow canvas background | `#f6faf7` with a dot grid `rgba(63,122,92,.2)`, 22px spacing |
| Workflow idle connector | `#c3d6c9`, dashed |
| Workflow active node | fill `#f2faf5`, border `--accent`, 4px halo `rgba(63,122,92,.14)` |
| Intro splash | gradient `#e7f5ec` to `#f8fbf8` to `#eaf5f3` |
| Closing banner | gradient `#d3ebdc` to `#d6ecef` to `#efeccd` |

### Shadows

| Name | Value |
|---|---|
| Card | `0 1px 2px rgba(27,42,35,.04), 0 14px 36px rgba(27,42,35,.07)` |
| Phone / dashboard (hero objects) | `0 30px 70px rgba(63,122,92,.16 to .18)` |
| Primary button | `0 8px 22px rgba(63,122,92,.25)` |

### Copy-paste tokens

```css
:root{
  color-scheme:light;
  --bg:#f8fbf8; --surface:#ffffff; --tint:#f0f6f1; --line:#dde7df;
  --ink:#1b2a23; --muted:#5f7167;
  --accent:#3f7a5c; --accent-d:#2c5a43; --soft:#e3efe7; --on:#fff;
  --shadow:0 1px 2px rgba(27,42,35,.04),0 14px 36px rgba(27,42,35,.07);
  --gap:clamp(3.5rem,9vw,6.5rem); /* section padding; 2.75rem on mobile */
}
```

---

## 2. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Headings | **Newsreader** (serif) | 500 | Gives the premium, editorial feel. Letter-spacing `-.015em`, line-height 1.1 |
| Body and UI | **Hanken Grotesk** | 400, 500, 600 | Clean sans. Body 1.05rem / 1.65 |
| Malayalam text | **Noto Sans Malayalam** | 400, 500 | Always set as the fallback of headings and use the `.ml` class on Malayalam runs |
| Code / JSON | `ui-monospace` | 400 | Small, in the soft green code card |

### Type scale

| Element | Desktop | Mobile |
|---|---|---|
| Hero H1 | `clamp(3rem, 10.5vw, 5.4rem)`, line-height 1.02 | 2.7rem |
| Malayalam hook line above H1 | `clamp(1.5rem, 4.5vw, 2rem)`, accent color | 1.3rem |
| Section H2 | `clamp(1.9rem, 4.5vw, 2.8rem)` | 1.8rem |
| Card H3 | 1.3 to 1.4rem | 1.2rem |
| Lead paragraph | 1.15rem, `--muted` | 1rem |
| Body | 1.05rem | 1.05rem |
| Small / caption | .85 to .95rem, `--muted` | same |
| Eyebrow label | .8rem, 600, uppercase, letter-spacing .12em, `--accent` | same |
| Code / badges | .78 to .85rem | same |
| Workflow node title / subtitle | `max(12.5px, 1.45cqw)` / `max(10.5px, 1.15cqw)` | `max(14px, 4.2cqw)` / `max(11.5px, 3.3cqw)` |

Rules: one H1 per page. Headings are short and plain. Max line length is about 34rem for paragraphs. Never use gradient-clipped text (it breaks on mobile Safari with Malayalam). Highlight a key phrase by coloring it `--accent` instead.

---

## 3. Layout and spacing

- Container: max-width 1080px, side padding 1.25rem.
- Section padding: `--gap` (3.5 to 6.5rem on desktop, 2.75rem on mobile). Sections are separated by a 1px hairline `rgba(63,122,92,.14)`.
- Grid gaps: 1rem for cards, 3rem between the two hero columns on desktop, 1.6rem on mobile.
- Radii: cards 1.3rem, phone shell 2.2rem, phone screen 1.7rem, chat bubbles 1rem (with a .3rem corner toward the sender), buttons and chips 999px.
- Breakpoints: 860px (layout switch) and 900px (workflow canvas switches between horizontal and vertical).
- Safe areas: apply `env(safe-area-inset-*)` on `:root` and the bottom dock.

---

## 4. Components

| Component | Spec |
|---|---|
| **Primary button** | Pill, `--accent` fill, white text, 48px min height, 1rem / 500. Hover: `--accent-d` |
| **Ghost button** | Pill, white 70% fill, 1px `--line` border, `--ink` text, no shadow |
| **Bottom dock (mobile)** | 4-tab thumb navigation (Home, Inbox, Bills, Activity) or single primary button fixed to bottom with `env(safe-area-inset-bottom)`. Height 64px, `--surface` background, 1px `--line` border |
| **Card** | White at 85 to 92% opacity, 1px `--line`, radius 1.3rem, card shadow. The "soft" variant uses `rgba(227,239,231,.9)` |
| **Icon tile** | 2.7rem square, radius .9rem, `--soft` fill, line icon in `--accent-d`, 1.7px stroke, round caps. Icons are 18 to 22px |
| **Phone mockup** | White 85% shell, 1px `--line`, padding .55rem, screen in `--tint`. Hero phone has a **fixed height of 480px** with hidden overflow so content never changes the layout |
| **Chat bubble (incoming)** | White, 1px `--line`, bottom-left corner .3rem |
| **Chat bubble (outgoing)** | `--accent` fill, white text, bottom-right corner .3rem |
| **Code card** | `--soft` fill, `--accent-d` text, monospace, radius .8rem |
| **Tabs** | Pill group in white with a 1px border. Selected tab: `--soft` fill and `--accent-d` text |
| **Check row** | 1.3rem circle. Green fill with a tick for done, amber fill with "!" for needs attention |
| **Badges** | "Done": `--soft` and `--accent-d`. "Needs you": `#f6ecd3` and `#8a5f0f`. Pill, .75rem, 600 |
| **Switch** | 3.4 by 2rem track, `--accent` when on, white knob. Toggles between autonomous handling and manual merchant control |
| **Workflow node** | White card, radius 1rem, 1px `--line`, soft shadow, icon tile plus title and subtitle. Active state as in the palette section |
| **Eyebrow** | Small uppercase accent label above every section H2 |
| **Stat Tile (KPI Card)** | `--surface` background, 1px `--line`, radius 1.2rem, card shadow. Large numeral (Newsreader/Grotesk 700, 2rem, `--ink`), label (`--muted`, .85rem, 500) |
| **Triage Alert Card** | High-priority item needing merchant review. Background `#f6ecd3`, 1px border `#c58a1f`, radius 1.1rem, amber `!` badge, title in bold `--ink`, timestamp in `--muted` |
| **Booking Row** | Schedule item with time badge (`--soft` background, `--accent-d` text), customer name and service caption, status pill ("Booked" in `--soft`/`--accent-d`) |
| **Reflection Trace Tree** | Vertical step-by-step disclosure showing autonomous checks (Draft -> Check slots -> Review clash -> Auto-fix). 1px vertical connecting line |
| **Onboarding Stepper** | Step X of 4 progress indicator, clean form fields (48px height, 1px `--line`), mic calibration button with affirmative `✓` confirmation |
| **Voice Listening Overlay** | Ambient pulsing green aura (`#c4e8d3`), live Malayalam speech transcription in Noto Sans Malayalam, instant confirmation toast |

---

## 5. Screen & Page Architectures

### 5.A Landing Page structure (in order)

1. **Intro splash** (about 3s): logo mark, "Kada" letters, Malayalam "കട", a short count-up bar, then a curtain slides up.
2. **Hero**: Malayalam hook, large headline, one-line value, live activity line, two buttons, animated phone demo that loops through Voice note, Bill and WhatsApp.
3. **How it works**: a live node-graph workflow (Voice note, Speech to text, Intent, Do the task, Review and fix, Reply sent) with a packet that travels along the connectors.
4. **Features**: 8-card bento grid (two wide cards, six standard).
5. **Bill reader**: sample receipt, scan-line animation, clean JSON output.
6. **Dashboard preview**: stat tiles, activity feed, working Auto/Manual switch. Marked as sample data.
7. **Getting started**: four steps with a progress bar.
8. **Tech stack**: small chips (a single swipeable row on mobile).
9. **Closing banner and footer.**

### 5.B App Dashboard & Operations Screens (in order)

Designed mobile-first (375px viewport) for one-handed operation in local retail/tailoring shops:

1. **Global App Shell & Navigation**
   * Top bar: Brand `[ കട / Kada ]`, shop avatar `[A]`, shop name **Anitha's Tailoring**, *Sample shop* tag, and setup trigger `[A](#setup)`.
   * Bottom dock: Persistent 4-tab thumb bar: `[Home](#home)`, `[Inbox](#inbox)`, `[Bills](#bills)`, `[Activity](#activity)`.
2. **Screen 1: Home Cockpit (`#home`)**
   * Malayalam salutation: `നമസ്കാരം, അനിത` (Noto Sans Malayalam, `--accent-d`).
   * H1 Headline: `Good morning, Anitha` (Newsreader 500, 2rem).
   * Daily status: `Here is what Kada handled for you today.`
   * Autonomous mode switch: `Kada is handling messages` / `Switch off to take control yourself.`
   * 4 KPI Stat Tiles: `12 Bookings`, `5 Bills read`, `38 Chats handled`, `2 Need you`.
   * "Needs you" Triage Feed: `! Bulk order from Rahul (10:42)` -> links to `#inbox`, `! Rice stock is low (09:05)` -> links to `#activity`.
   * Today's Bookings Feed: `10:30 Suresh, 2 people` (Fitting, moved to 10:30), `4:00 pm Meera` (Blouse fitting). Both marked `Booked`.
   * Footer caption: `Sample data for illustration.`
3. **Screen 2: WhatsApp Inbox (`#inbox`)**
   * Eyebrow `WhatsApp`, H1 `# Inbox`.
   * Description: `Every customer message in one place. Select a chat to see the conversation.`
   * Customer threads with lead badges (`! Needs you` vs `✓ Auto-replied`).
   * One-tap manual takeover toggle.
4. **Screen 3: Bill Reader (`#bills`)**
   * Eyebrow `Bill reader`, H1 `# Bills`.
   * Description: `Photograph a bill. Kada saves tidy records.`
   * Primary camera snap / photo upload button (min 48px).
   * Structured invoice record (e.g. Sree Lakshmi Traders, Alappuzha, 3 line items, math reconciliation: `total_matches_items: true`).
5. **Screen 4: Autonomous Activity Log (`#activity`)**
   * Eyebrow `Agent log`, H1 `# Activity`.
   * Description: `What Kada did, in plain words.`
   * Chronological event timeline with status icons (`!` for alerts, `✓` for completed jobs).
   * Expandable Reflection Loop Tree on bookings:
     * 1. Draft the booking
     * 2. Check free slots
     * 3. Review: clash found at 10:00
     * 4. Fix: moved to 10:30
6. **Screen 5: Getting Started Wizard (`#setup`)**
   * Eyebrow `Getting started`, H1 `# Live in 2 minutes`.
   * Stepper: Step 1 of 4.
   * Step 1: `Name your shop` (Business name input).
   * Step 2: `Set your hours` (Opening & closing time).
   * Step 3: `Add your first service` (Name & price in rupees).
   * Step 4: `Send a voice note` (Vernacular speech test: "Tap and say something in Malayalam" -> `✓`).
   * Live completion: `### You are live. Kada is ready to take your customers.` -> `[Go to home](#home)`.
7. **Screen 6: Live Voice Assistant Overlay (`#listening`)**
   * Ambient pulsing aura.
   * State: `### Listening`.
   * Vernacular transcript display and instant confirmation toast: `Booking saved: Meera, tomorrow 4:00 pm ✓`.

---

## 6. Motion

Library: GSAP 3.12.5 and ScrollTrigger from cdnjs. All motion is subtle and meaningful.

| Moment | Behavior |
|---|---|
| Intro | Mark pops in (`back.out(1.6)`), letters rise with .07s stagger, bar fills in .9s, curtain slides up .9s `power4.inOut` |
| Hero entrance | Elements fade up 26px with .1s stagger, .9s `power3.out` |
| Section reveals | Headings, cards and chips fade up 30 to 50px, `power3.out`, trigger at 85 to 92% of the viewport, **once only** |
| Hero phone | Auto-plays three demos in a loop, each followed by a 2.4s pause, then switches tab. Tapping a tab jumps to it and the loop continues |
| Workflow | Nodes pop in one by one with their connector drawing itself. A glowing packet then loops along the path (1.05s per step) and lights each node as it arrives. Pauses when off screen |
| Ambient | Aura blobs drift slowly (24s, alternate). Status dots pulse (1.6s) |
| Reduced motion | Disable all animation and show final states |

Mobile performance rules: no `backdrop-filter` on cards, no pinned scroll sections, `ScrollTrigger.config({ignoreMobileResize:true})`, and use `100svh` rather than `100vh`.

---

## 7. Design principles used

1. **Calm over loud.** One muted green accent, lots of white, no neon. The audience is busy shop owners and the interface should lower stress.
2. **Premium through restraint.** Serif headings, hairline borders, soft shadows, generous spacing, and few effects.
3. **Show, do not tell.** Animated demos and a live workflow explain the product faster than paragraphs.
4. **Local first.** Malayalam appears in the hero, the demos and the replies. Malayalam text uses its own font and is never an afterthought.
5. **Mobile first.** Compact hero, thumb-reachable action at the bottom, short scrolls, and no clutter of chips or floating cards on small screens.
6. **Honest content.** Every number in a demo is labeled as a sample.
7. **Clarity of state.** Green means done, amber means needs you. Nothing else uses amber.
8. **Stable layout.** Fixed-height demo containers and aspect-ratio canvases prevent content from jumping while animations play.
9. **Accessible by default.** At least 5:1 text contrast, visible 2px focus rings with 3px offset, 40 to 48px touch targets, `aria-live` on changing demo content, and reduced-motion support.
10. **Performance.** Light effects only, one animation library, inline SVG icons, and no external images.

---

## 8. Do and do not (lessons learned from user feedback)

| Do | Do not |
|---|---|
| Keep the page light, with a soft aura glow | Add dark mode or heavy dark blocks |
| Use muted greens, with cream and teal as quiet supporting tints | Use saturated or neon greens (lime was rejected as stressful) |
| Use filled soft shapes for background pulses | Use thin outlined ripple lines |
| Keep the workflow canvas clean, with small icons | Let SVG icons inherit canvas sizing rules (scope canvas SVG rules to the direct child) |
| Hide secondary chips and floating cards on mobile | Stack pills vertically on mobile |
| Show the sticky bottom button only after the hero | Duplicate the hero button directly on top of the phone demo |
| Keep the hero phone at a fixed height | Let the demo content resize the phone |
| Keep scroll distances short on mobile | Pin the screen for long scroll distances |
| Keep animation tied to meaning (data flowing through the agent) | Add decorative floating parallax layers or a progress bar under the tabs |
| Keep dashboard screens single-column on mobile with thumb-reachable primary actions | Overload the dashboard with dense analytics, charts, or multiple nested columns |
| Segregate autonomous jobs (green `✓`) from items needing merchant triage (amber `!`) | Use red for stock or urgent alerts (amber is the sole attention color to preserve calm) |
| Disclose autonomous agent reasoning in plain language ("moved to 10:30 due to clash at 10:00") | Expose machine-learning or technical jargon (e.g. "reflection loop retry count 2") to the shop owner |

---

## 9. Voice and copy

- Plain words, short sentences, no jargon (say "reads your bills", not "OCR pipeline").
- Lead with the benefit for the shop owner: "Speak. Kada does the rest."
- Headlines: 3 to 7 words. Section intros: one sentence.
- Use sample data that is realistic for Kerala (Alappuzha supplier, rice, sugar, oil, fitting bookings, amounts in rupees).
- Technical terms (NestJS, Prisma, Redis, Whisper) belong only in the tech stack row.
