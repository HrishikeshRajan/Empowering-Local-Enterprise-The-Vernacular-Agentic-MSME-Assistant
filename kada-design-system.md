# Kada Design System (LLM-readable spec)

**Purpose:** when asked to build any UI for Kada, read this file first, then build using ONLY these tokens, patterns and rules. Machine-readable twin: `kada-design-tokens.json`.

## 0. Design DNA (paste this into any prompt)

> Kada is a Malayalam-first voice/WhatsApp assistant for small shops (MSMEs). The look is **calm, premium, light mint**: pale green-white backgrounds with soft aurora glows, **frosted-glass cards**, very large rounded corners, deep-green (#2c5a43) hero surfaces, a single green accent (#3f7a5c), amber ONLY for "needs your attention". Type is a tight, modern grotesk (Hanken Grotesk) with Noto Sans Malayalam for Malayalam; the serif (Newsreader) is used only for the wordmark. Shadows are soft, green-tinted, long and low-opacity. Motion is smooth and short, with one signature easing. Everything is mobile-first, thumb-friendly (≥44px targets), and respects reduced motion. It must never look like a default Bootstrap/admin template.

## 1. Product context

| Item | Value |
|---|---|
| Product | Kada, Vernacular MSME Assistant |
| Users | Shop owners in Kerala; Malayalam first, English second |
| Surfaces | Marketing site (hero, features), app dashboard, intro splash, voice sheet |
| Personality | Calm, trustworthy, plain-spoken, quietly premium |
| Theme | Light only (no dark mode yet) |
| Logo | Leaf mark `border-radius:50% 50% 50% 12%` in accent + "Kada" in Newsreader 500 |

## 2. Color

### 2.1 Core tokens
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#f8fbf8` | Page background (dashboard uses `#f6faf7`) |
| `--surface` | `#ffffff` | Solid cards, inputs, phone screen |
| `--tint` | `#f0f6f1` | Subtle fills, segmented-control track, hover |
| `--line` | `#dde7df` | Hairline borders, dividers |
| `--ink` | `#1b2a23` | Primary text, dark buttons (never pure black) |
| `--muted` | `#5f7167` | Secondary text, labels |
| `--accent` | `#3f7a5c` | Brand accent, primary actions, success |
| `--accent-d` | `#2c5a43` | Accent text, hover, active nav, hero base |
| `--soft` | `#e3efe7` | Accent-tinted fills: chips, icon wells, selected tabs |
| `--on` | `#ffffff` | Text on accent / ink |

### 2.2 Status colors
| Role | Text | Fill | Rule |
|---|---|---|---|
| Success / done | `#2c5a43` | `#e3efe7` | Default positive state |
| Warning / needs you | `#8a5f0f` | `#f8efd6` (strong: `#f8e7bd`) | **Amber is only for attention/manual mode** |
| Amber base | `#c58a1f` | | Gradients, manual-mode hero |
| Danger (proposed, not yet used) | `#9c3a2a` | `#f8e1db` | Use sparingly, only for destructive errors |

### 2.3 Brand supporting colors (decor only, never for text)
| Name | Hex | Where |
|---|---|---|
| Mint glow | `#d4eedf` / `#bfe6cf` | Aurora blobs |
| Aqua glow | `#d9eef0` / `#cfeaf0` | Aurora blobs |
| Cream glow | `#f3edcf` / `#f1ebc9` | Aurora blobs |
| Leaf light | `#5fb98d` / `#4fa57e` | Gradient highlights, charts, active dots on dark |
| Teal | `#23a08f` / `#2f8f9d` | Gradient text end stop |
| Forest deep | `#1d4836` / `#1f4d39` | Hero gradient start |
| Intro wash | `#e7f5ec → #f8fbf8 → #eaf5f3` | Splash background |

### 2.4 Gradients
| Name | CSS |
|---|---|
| Hero (auto) | `radial-gradient(110% 150% at 100% 0,#58b087,transparent 55%),linear-gradient(135deg,#1d4836,#2c5a43 55%,#3f7a5c)` |
| Hero (manual) | `radial-gradient(110% 150% at 100% 0,#e2b052,transparent 55%),linear-gradient(135deg,#6f4c0e,#97691a 55%,#c58a1f)` |
| Gradient text | `linear-gradient(95deg,#2c5a43,#3f7a5c 35%,#23a08f 70%,#5fb98d)` with `background-clip:text` |
| Page aurora | `radial-gradient(60vmax 50vmax at 0 0,#d4eedf,transparent 60%),radial-gradient(55vmax 50vmax at 100% 10%,#d9eef0,transparent 60%),radial-gradient(50vmax 40vmax at 50% 110%,#f3edcf,transparent 60%)` over `--bg` |
| Avatar | `linear-gradient(135deg,#bfe6cf,#d3ebef)` |
| Active nav | `linear-gradient(135deg,#2c5a43,#3f7a5c)` |
| Dot grid | `radial-gradient(rgba(63,122,92,.2) 1px,transparent 1.3px)` size `22px 22px`, masked with a radial fade |

### 2.5 Contrast (computed WCAG ratios)
`ink on bg` 14.4 · `muted on white` 5.2 · `muted on bg` 5.0 · `accent on white` 5.1 · `white on accent` 5.1 · `accent-d on soft` 6.7 · `amber text on amber fill` 4.9 · `white on ink` 15.0. All pass AA for body text. Do not put `accent` text on `soft` below 14px without checking.

## 3. Elevation and glass

### 3.1 Shadow tokens
| Token | Value | Use |
|---|---|---|
| `--ring` | `0 0 0 1px rgba(27,42,35,.06)` | Replaces borders on glass cards |
| `--shadow` | `0 1px 2px rgba(27,42,35,.04),0 14px 36px rgba(27,42,35,.07)` | Standard card |
| `--lift` | `0 22px 40px -26px rgba(44,90,67,.35)` | Dashboard cards, tiles (long, low, green) |
| inset highlight | `inset 0 1px 0 #fff` | Top edge shine on glass |
| warning lift | `0 22px 40px -26px rgba(197,138,31,.6)` | Amber tiles |
| hero | `0 34px 50px -30px rgba(44,90,67,.8)` | Green hero card |
| phone | `0 60px 90px -34px rgba(44,90,67,.5),0 0 0 7px rgba(255,255,255,.4)` | Device mockup |
| float card | `0 22px 44px -16px rgba(27,42,35,.3)` | Floating glass chips |
| dark button | `0 14px 30px -10px rgba(27,42,35,.55)` | Primary dark pill |
| nav | `0 24px 44px -14px rgba(27,42,35,.45)` | Floating bottom nav |
| fab | `0 0 0 5px rgba(246,250,247,.95),0 14px 26px -6px rgba(44,90,67,.7)` | Mic button with halo |

**Shadow recipe:** large blur, **negative spread**, green-tinted (`44,90,67`) or ink-tinted (`27,42,35`), alpha .07 to .5. Never grey `rgba(0,0,0,…)` hard shadows.

### 3.2 Glass recipe
`background: rgba(255,255,255,.64–.82); backdrop-filter: blur(10–18px) saturate(1.4–1.6); border: 1px solid rgba(255,255,255,.9) (or --ring); box-shadow: --ring, --lift, inset 0 1px 0 #fff`. Use glass over aurora backgrounds only. On plain surfaces use solid `--surface` with `--line` hairline.

## 4. Shape

| Token | Value | Use |
|---|---|---|
| radius-pill | `999px` | Buttons, chips, badges, switch, tabs |
| radius-xl | `2rem` / `2.2rem` | Bottom sheet, phone |
| radius-lg | `1.5rem` to `1.7rem` | Cards, hero card |
| radius-md | `1.1rem` to `1.3rem` | Tiles, floating cards, rows |
| radius-sm | `.85rem` | Icon wells, dots, nav items |
| leaf | `50% 50% 50% 12%` | Logo mark, decorative blobs |

Rule: corners are always generously rounded; never use square corners or `4px` radii.

## 5. Spacing and layout

- **Scale (rem):** .25 · .5 · .75 · 1 · 1.25 · 1.5 · 2 · 3 · 4 · 6. Common gaps: .6/.7 (tight lists), 1 (card gap), 1.15 to 1.25 (card padding).
- **Section gap:** `clamp(3.5rem, 9vw, 6.5rem)`.
- **Page gutter:** `1.1rem` to `1.25rem` on mobile, `2rem` on desktop.
- **Max width:** marketing `1080px`; dashboard mobile `900px`, desktop fluid beside a `260px` sidebar.
- **Breakpoints:** `380` (tiny phones), `700` (tablet: 4 tiles, 2 cols), `860/900` (sidebar appears, bottom nav hides), `960` (hero splits into 2 cols), `1180` (dashboard right rail, 370px).
- **Touch targets:** minimum 44px, buttons 48px, bottom nav items 52px.
- **Safe areas:** use `env(safe-area-inset-*)` on fixed bars; `viewport-fit=cover`.

## 6. Typography

| Role | Font | Weight | Size / line-height | Tracking |
|---|---|---|---|---|
| Hero H1 | Hanken Grotesk | 600 | `clamp(3rem,8.4vw,5.7rem)` / .97 | -.052em |
| Page H1 (dashboard) | Hanken + Noto Malayalam | 700 | `clamp(1.7rem,5vw,2.5rem)` / 1.2 | -.02em |
| Card title | Hanken | 700 | 1.05rem | -.01em |
| Body | Hanken | 400 | 1rem / 1.6 to 1.65 | 0 |
| Lead | Hanken | 400 | 1.1rem, `--muted` | 0 |
| KPI number | Hanken | 600 | 1.6 to 2rem / 1.1, `tabular-nums` | -.03em |
| Small / meta | Hanken | 400 to 500 | .74 to .86rem, `--muted` | 0 |
| Eyebrow | Hanken | 600 | .78rem, uppercase, .12em | |
| Button | Hanken | 500 to 600 | 1rem (small .85rem) | 0 |
| Wordmark | Newsreader | 500 | 1.5 to 1.6rem (intro 2.8 to 4rem) | -.03em |
| Malayalam | Noto Sans Malayalam | 400 to 700 | same sizes, line-height ≥1.4 | |

Fonts: `Hanken Grotesk` (400/500/600/700), `Newsreader` (500, serif only for wordmark/logo), `Noto Sans Malayalam` (400 to 700). Stack: `'Hanken Grotesk','Noto Sans Malayalam',system-ui,sans-serif`. Malayalam text must never be clipped: avoid fixed heights, use line clamp (2 lines) instead of truncation when text is long.

## 7. Iconography

24×24 viewBox, **stroke only**, `stroke-width:1.8` (2.2 on active/tiny), `stroke-linecap/linejoin: round`, `fill:none`, `currentColor`. Delivered as an SVG `<symbol>` sprite. Sizes: 17 to 18px (inside chips), 20 to 22px (nav), 26 to 30px (mic). Never use emoji as icons.

Existing set: home, chat, doc (bill), pulse (activity), mic, set (sliders), box (stock), cal, check, alert, plus.

## 8. Motion

| Token | Value | Use |
|---|---|---|
| ease-out (signature) | `cubic-bezier(.22,1,.36,1)` | Reveals, cards, sheets |
| ease-in-out | `cubic-bezier(.65,0,.35,1)` | Wipes, tab changes |
| ease-fly | `cubic-bezier(.76,0,.24,1)` | Logo flying to nav |
| ease-spring | `cubic-bezier(.34,1.4,.64,1)` | Pop-in marks, switch knob |
| micro | `.15–.3s` | Hover, press (`scale(.96)`), toggles |
| reveal | `.45–.9s` | Entrances; stagger 60 to 100ms |
| loop | pulse `1.6s`, float `6s`, wave `1s`, halo drift `14s` | Live dots, floating cards, voice bars |
| intro | ≈2.4s total | Mark pops → word wipes → subtitle → flies to nav |

Rules: animate `transform`/`opacity` only; always add `@media (prefers-reduced-motion:reduce)` that disables animation; entrances use `translateY(8–26px)` + fade.

## 9. Component catalog

| Component | Spec |
|---|---|
| **Primary button** | Pill, min-height 48px, bg `--ink`, white text, dark shadow, hover `--accent-d`, optional arrow icon |
| **Accent button** | Pill, bg `--accent`, white text, hover `--accent-d` |
| **Ghost button** | Pill, glass bg `rgba(255,255,255,.7)`, `--line` border, blur 8px |
| **Small action** | Pill, min-height 40px, bg `--ink`, .85rem 600 (e.g., "Reply") |
| **Chip (quick action)** | Pill 48px, glass bg, 1.9rem circular `--soft` icon well, scrolls horizontally on mobile |
| **Badge** | Pill, .74rem 700, `--soft`/`--accent-d` (done) or amber pair (attention) |
| **Card** | Glass recipe, radius 1.5rem, padding 1.15rem, title row = H2 + count/badge |
| **KPI tile** | Radius 1.3rem, icon well 2.4rem (`--soft`), number 1.9rem, label .85rem muted; warning variant = amber gradient + clickable |
| **List item** | Icon dot 2.4rem (radius .85rem) + text (title 600, meta .85rem muted, 2-line clamp) + action/badge, hairline dividers |
| **Timeline slot** | Time column 3.6rem, vertical hairline, accent dot with `--soft` halo |
| **Hero status card** | Deep-green gradient, white text, pulse dot, switch right; turns amber in manual mode |
| **Switch** | 3.6×2.1rem pill, 1.56rem knob, spring easing, `role="switch"` |
| **Segmented tabs** | `--tint` track, selected = white pill with tiny shadow |
| **Sidebar (≥900)** | Floating glass panel, radius 1.8rem, active item = accent gradient + white text |
| **Bottom nav (<900)** | Floating glass bar, radius 1.8rem, 5 slots, centre raised FAB (accent gradient + halo ring) |
| **Bottom sheet** | White, radius 2rem top, slide-up, pulsing mic rings + waveform, dims page with blur |
| **Toast** | Ink pill, white 600 text, slides up, `role="status"` |
| **Phone mockup** | Radius 2.2rem, glossy white frame, soft green shadow, 3D tilt (-9° Y, 3° X) on desktop only |
| **Floating glass card** | Glass, radius 1.15rem, `bob` float, parallax on pointer (desktop only) |

## 10. Page patterns

- **Hero:** 2-col ≥960 (copy left, product right); eyebrow live pill → H1 (gradient 2nd line) → Malayalam tagline with leading rule → lead → dark primary + ghost button → trust row. Mobile: single column, full-width stacked buttons, compact demo card (no phone frame).
- **Dashboard:** greeting header (Malayalam first) → status hero with switch → 4 KPI tiles → "Needs you" (actionable) → quick-action chips → bookings timeline → activity feed. Desktop ≥1180: right rail for attention + bookings.
- **Intro splash:** mark pops, word wipes, Malayalam subtitle, logo flies onto the nav logo; no other text.

## 11. Voice and content

- Malayalam first, English second; plain, warm, short. Sample/placeholder data is always labelled ("Sample data").
- Status copy is calm and reassuring ("Kada is handling messages"), never alarmist.
- Numbers use `tabular-nums` and Indian grouping (₹38,055, ₹18,420).

## 12. Do / Don't

**Do:** one accent; soft green-tinted shadows; big radii; glass over aurora; generous whitespace; hierarchy through size and weight; tabular numerals; 44px+ targets; reduced-motion support.

**Don't:** pure black or grey shadows; thin grey bordered white cards; coloured left-border stripes; dark-grey "admin" sidebars; Bootstrap-like blue/red; more than one saturated hue per screen; amber for decoration; emoji icons; fixed-height boxes around Malayalam text; animating layout properties.

## 13. How an LLM should work (procedure)

1. **Identify the surface** (marketing, dashboard, form, modal, email) and pick the matching pattern in section 10.
2. **Inject tokens:** define the `:root` variables from section 14 verbatim. Never invent new hex values; derive tints from `--accent` or `--amber` only if essential.
3. **Compose with components** from section 9; reuse their sizes, radii and shadows.
4. **Set type:** Hanken for UI, Noto Sans Malayalam for Malayalam, Newsreader only for the wordmark.
5. **Add motion** with the signature easing and a reduced-motion fallback.
6. **Make it responsive** mobile-first using the section 5 breakpoints.
7. **Self-check** with section 15 before answering.

**To analyze an existing Kada codebase:** read `:root` variables first (`--bg --accent --ink …`), then search for `backdrop-filter`, `box-shadow`, `border-radius`, `cubic-bezier`, `@font-face`/Google Fonts links and the icon sprite; compare against this spec and flag deviations.

## 14. Copy-paste CSS foundation

```css
:root{
  color-scheme:light;
  --bg:#f8fbf8; --surface:#fff; --tint:#f0f6f1; --line:#dde7df;
  --ink:#1b2a23; --muted:#5f7167; --accent:#3f7a5c; --accent-d:#2c5a43;
  --soft:#e3efe7; --on:#fff;
  --amber:#c58a1f; --amber-t:#8a5f0f; --amber-bg:#f8efd6;
  --card:rgba(255,255,255,.8);
  --ring:0 0 0 1px rgba(27,42,35,.06);
  --shadow:0 1px 2px rgba(27,42,35,.04),0 14px 36px rgba(27,42,35,.07);
  --lift:0 22px 40px -26px rgba(44,90,67,.35);
  --ease:cubic-bezier(.22,1,.36,1);
  --font:'Hanken Grotesk','Noto Sans Malayalam',system-ui,sans-serif;
  --gap:clamp(3.5rem,9vw,6.5rem);
}
body{font:400 1rem/1.6 var(--font);color:var(--ink);
  background:radial-gradient(60vmax 50vmax at 0 0,#d4eedf,transparent 60%),
             radial-gradient(55vmax 50vmax at 100% 10%,#d9eef0,transparent 60%),
             radial-gradient(50vmax 40vmax at 50% 110%,#f3edcf,transparent 60%),var(--bg);
  background-attachment:fixed;-webkit-font-smoothing:antialiased}
.card{background:var(--card);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);
  border-radius:1.5rem;padding:1.15rem;box-shadow:var(--ring),var(--lift),inset 0 1px 0 #fff}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:48px;
  padding:.8rem 1.6rem;border-radius:999px;background:var(--ink);color:#fff;font-weight:500;
  box-shadow:0 14px 30px -10px rgba(27,42,35,.55);transition:background .25s}
.btn:hover{background:var(--accent-d)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
```

## 15. Self-check before delivering

- [ ] Only tokens from this file; no new colors; no pure black; amber only for attention.
- [ ] Glass cards sit on the aurora; shadows are soft, long, green/ink-tinted.
- [ ] Radii ≥ .85rem everywhere; pills for controls.
- [ ] Malayalam renders in Noto Sans Malayalam with room for taller line-height; no clipping.
- [ ] Touch targets ≥ 44px; safe-area padding on fixed bars; works at 320, 390, 768, 1280.
- [ ] Hover/focus/active states exist; focus ring visible; keyboard works.
- [ ] Reduced-motion fallback present; only transform/opacity animated.
- [ ] Contrast ≥ 4.5:1 for text; icons stroke-based `currentColor`.
- [ ] Does not resemble a default Bootstrap/admin template.
