import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Language } from '../types';
import { KadaIntro } from './KadaIntro';
import AgentWorkflow from './AgentWorkflow';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLaunchApp: () => void;
  onOpenVoiceModal: () => void;
}

// ─── Hero: Demo phone scenes ─────────────────────────────────────────────────
type SceneItem = [string, string | [string, string][]];
const SCENES: SceneItem[][] = [
  [['in', 'voice'], ['in ml', 'നാളെ രാവിലെ 10 മണിക്ക് 2 പേർക്ക് ഫിറ്റിംഗ് വേണം'],
   ['code', '{ "intent": "booking",\n  "time": "tomorrow 10:00",\n  "guests": 2 }'], ['out', 'Booked for tomorrow, 10:00 ✓']],
  [['in', 'Photo: supplier receipt'],
   ['bill', [['Rice 50 kg', '₹2,400'], ['Sugar 25 kg', '₹1,100'], ['Oil 10 L', '₹1,320']]],
   ['out', 'Bill logged. Rice stock updated.']],
  [['in', 'Do you stitch blouses by Saturday? Price?'],
   ['out', 'Yes. Blouse stitching is ₹450, ready in 3 days. Shall I book a fitting?'],
   ['in', 'Yes, tomorrow 4 pm'], ['code', 'Lead alert sent to owner'], ['out', 'Booked for tomorrow, 4:00 pm ✓']],
];
const TABS = ['Voice note', 'Bill', 'WhatsApp'];
const LIVE_ITEMS = [
  'Booking a fitting for tomorrow, 10:00',
  'Reading a supplier bill: 4,820',
  'Replying to a price question on WhatsApp',
  'Rice stock is low. Reorder drafted.',
  'Lead alert sent to the owner',
];

function Msg({ t, v }: { t: string; v: string | [string, string][] }) {
  if (t === 'code') return <div className="dm-code dm-pop">{v as string}</div>;
  if (t === 'bill') {
    const rows = v as [string, string][];
    return (
      <div className="dm-bill dm-pop">
        {rows.map(([a, b]) => <div key={a}><span>{a}</span><span>{b}</span></div>)}
        <div className="tot"><span>Total</span><span>₹4,820</span></div>
      </div>
    );
  }
  if (v === 'voice') return (
    <div className="dm in dm-pop">
      <div className="dm-voice">▶ <span className="dm-wave">{Array.from({ length: 10 }, (_, i) => <s key={i} />)}</span> 0:07</div>
    </div>
  );
  return <div className={`dm ${t} dm-pop`}>{v as string}</div>;
}

function Demo() {
  const [tab, setTab] = useState(0);
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = SCENES[tab].length;
    if (reduce) { setShown(n); return; }
    setShown(0);
    const t: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < n; i++) t.push(setTimeout(() => setShown(i + 1), 250 + i * 1000));
    t.push(setTimeout(() => { setTab((x) => (x + 1) % SCENES.length); setRun((r) => r + 1); }, 250 + n * 1000 + 2400));
    return () => t.forEach(clearTimeout);
  }, [tab, run]);
  return (
    <div className="hx-phone"><div className="hx-screen">
      <div className="hx-tabs" role="tablist" aria-label="Try a demo">
        {TABS.map((l, i) => (
          <button key={l} role="tab" aria-selected={tab === i} className="hx-tab"
            onClick={() => { setTab(i); setRun((r) => r + 1); }}>{l}</button>
        ))}
      </div>
      <div className="hx-scene" aria-live="polite">
        {SCENES[tab].slice(0, shown).map(([t, v], i) => <Msg key={`${tab}-${run}-${i}`} t={t} v={v} />)}
      </div>
      <button className="hx-replay" onClick={() => setRun((r) => r + 1)}>Replay</button>
    </div></div>
  );
}

function HeroSection({ ready, onLaunchApp }: { ready: boolean; onLaunchApp: () => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [liveIdx, setLiveIdx] = useState(0);
  const [liveFading, setLiveFading] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      const id = setInterval(() => setLiveIdx((x) => (x + 1) % LIVE_ITEMS.length), 2800);
      return () => clearInterval(id);
    }
    const id = setInterval(() => {
      setLiveFading(true);
      setTimeout(() => { setLiveIdx((x) => (x + 1) % LIVE_ITEMS.length); setLiveFading(false); }, 260);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ok = matchMedia('(hover:hover) and (min-width:960px)').matches &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const h = heroRef.current, st = stageRef.current;
    if (!ok || !h || !st) return;
    const ph = st.querySelector<HTMLElement>('.hx-phone');
    const move = (e: PointerEvent) => {
      const r = h.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      st.style.setProperty('--px', x.toFixed(3)); st.style.setProperty('--py', y.toFixed(3));
      ph?.style.setProperty('--ry', (-9 + x * 10).toFixed(2) + 'deg');
      ph?.style.setProperty('--rx', (3 - y * 8).toFixed(2) + 'deg');
    };
    const leave = () => {
      ['--px', '--py'].forEach((p) => st.style.removeProperty(p));
      ph && ['--ry', '--rx'].forEach((p) => ph.style.removeProperty(p));
    };
    h.addEventListener('pointermove', move); h.addEventListener('pointerleave', leave);
    return () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerleave', leave); };
  }, []);

  const d = (i: number): React.CSSProperties => ({ '--i': i } as React.CSSProperties);
  return (
    <header ref={heroRef} className={`hero${ready ? ' in' : ''}`} id="top">
      <div className="hx-copy">
        <div className="hx-live hh" style={d(0)} aria-live="polite"><i /><span className={liveFading ? 'lv out' : 'lv'}>{LIVE_ITEMS[liveIdx]}</span></div>
        <h1 className="hh" style={d(1)}>Speak.<br /><span>Kada does the rest.</span></h1>
        <p className="hx-ml hh" style={d(2)}>പറഞ്ഞാൽ മതി.</p>
        <p className="hx-lead hh" style={d(3)}>Send a voice note in Malayalam. Your shop books customers, reads bills and answers WhatsApp, day and night.</p>
        <div className="hx-cta hh" style={d(4)}>
          <button className="kb kb-dark" data-testid="cta-hero" onClick={onLaunchApp}>
            Start free setup
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <a className="kb kb-ghost" href="#how">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
            Watch how it works
          </a>
        </div>
        <ul className="hx-trust hh" style={d(5)}><li>WhatsApp</li><li>Malayalam + English</li><li>GST bills</li><li>24/7</li></ul>
      </div>
      <div ref={stageRef} className="hx-stage hh" style={d(3)}>
        <div className="hx-card c1">
          <div className="hx-wv">{[0, 120, 240, 60, 180].map((x) => <i key={x} style={{ animationDelay: x + 'ms' }} />)}</div>
          <div><b className="ml">ഇന്ന് എത്ര വിറ്റു?</b><small>Voice note · 0:04</small></div>
        </div>
        <div className="hx-card c2">
          <small>Today's sales</small>
          <div className="hx-num">₹18,420 <em>▲ 12%</em></div>
          <svg viewBox="0 0 120 36" width="132" height="40" aria-hidden="true"><path d="M2 29C18 27 22 14 38 16S60 31 76 19 98 4 118 6" fill="none" stroke="#3f7a5c" strokeWidth="2.6" strokeLinecap="round" pathLength="1" /></svg>
        </div>
        <div className="hx-card c3"><span className="hx-ok">✓</span><div><b>Booking confirmed</b><small>Tomorrow · 10:00</small></div></div>
        <Demo />
      </div>
    </header>
  );
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [heroReady, setHeroReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Mobile Dock Visibility ── */
    const dk = document.querySelector<HTMLElement>('.dock');
    function dockCheck() {
      dk?.classList.toggle('on', window.scrollY > window.innerHeight * 0.85);
    }
    window.addEventListener('scroll', dockCheck, { passive: true });
    dockCheck();

    /* ── Dashboard Interactive Mode Switch ── */
    const sw = document.getElementById('sw');
    const dash = document.querySelector<HTMLElement>('.dash');
    sw?.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') === 'true';
      sw.setAttribute('aria-checked', String(!on));
      dash?.classList.toggle('manual', on);
    });

    /* ── GSAP Scroll Animations ── */
    if (reduce) {
      return () => window.removeEventListener('scroll', dockCheck);
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.config({ ignoreMobileResize: true });

      const st = (t: string, o = 88) => ({ trigger: t, start: `top ${o}%`, once: true });
      gsap.utils.toArray('.t').forEach((el: any) => {
        gsap.from(el, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      gsap.from('.stack span', { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.05, scrollTrigger: { trigger: '.stack', start: 'top 92%', once: true } });
      gsap.from('.bc', { y: 44, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: st('.bento') });

      /* Bill Reader Scan Animation Loop */
      const scanLoop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });
      scanLoop
        .set('.scan', { top: '0%', autoAlpha: 1 })
        .to('.scan', { top: '98%', duration: 1.5, ease: 'power1.inOut' })
        .to('.scan', { autoAlpha: 0, duration: 0.25 });

      gsap.timeline({ scrollTrigger: { trigger: '.inv-grid', start: 'top 85%', once: true }, onComplete() { scanLoop.play(); } })
        .from('.paper', { y: 30, rotate: -6, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
        .fromTo('.scan', { top: '0%', autoAlpha: 1 }, { top: '98%', duration: 1.5, ease: 'power1.inOut' }, '-=.2')
        .to('.scan', { autoAlpha: 0, duration: 0.25 })
        .from('.jl', { autoAlpha: 0, x: -14, duration: 0.35, stagger: 0.09 }, '-=1.2');

      ScrollTrigger.create({
        trigger: '.inv-grid', start: 'top bottom', end: 'bottom top',
        onToggle(self: any) { if (self.isActive) scanLoop.play(); else scanLoop.pause(); },
      });

      gsap.from('.dash', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: st('.dash') });
      gsap.from('.feed .row', { x: -22, autoAlpha: 0, duration: 0.5, stagger: 0.12, scrollTrigger: st('.feed', 92) });
      gsap.from('.ticks li', { x: -16, autoAlpha: 0, duration: 0.5, stagger: 0.1, scrollTrigger: st('.ticks', 92) });
      gsap.from('.ob li', { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.12, scrollTrigger: st('.ob', 90) });
      gsap.fromTo('.ob-bar b', { width: '0%' }, { width: '100%', duration: 1.6, ease: 'power2.out', scrollTrigger: st('.ob-bar', 92) });
      gsap.from('.final', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.final', start: 'top 92%', once: true } });

      ScrollTrigger.refresh();
    }, containerRef);

    window.addEventListener('load', () => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', dockCheck);
    };
  }, [heroReady]);

  return (
    <div className="landing-root kada-page" ref={containerRef}>
      {/* Intro Splash */}
      <KadaIntro navSelector=".logo" onHero={() => setHeroReady(true)} />

      <div className="wrap">
        {/* Navigation */}
        <nav className="kada-nav">
          <a className="logo" href="#top"><i />Kada</a>
          <div className="links">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="/dashboard" onClick={(e) => { e.preventDefault(); onLaunchApp(); }}>Dashboard</a>
          </div>
          <button className="kb kb-ghost" data-testid="cta-nav" onClick={onLaunchApp}>Get early access</button>
        </nav>

        {/* Hero Section */}
        <HeroSection ready={heroReady} onLaunchApp={onLaunchApp} />

        {/* Section 2: How It Works (Agent Canvas) */}
        <AgentWorkflow />

        {/* Section 3: Features Bento Grid */}
        <section id="features">
          <p className="eyebrow">Everything in one place</p>
          <h2 className="t">One assistant for every routine job.</h2>
          <p className="sub">From the first voice note to the final reply, Kada covers the daily work that eats a shop owner's time.</p>
          <div className="bento">
            <div className="bc w3 soft">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" /></svg></span>
              <h3>Voice and text in Malayalam</h3>
              <p>Send a voice note or type, in Malayalam or English. Speech becomes text, and text becomes a structured action your shop can use.</p>
              <div className="chips"><span>Malayalam</span><span>English</span><span>Voice notes</span></div>
            </div>
            <div className="bc w3">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7l2 2 3-3M5 15l2 2 3-3M13 8h6M13 16h6" /></svg></span>
              <h3>Autonomous task agent</h3>
              <p>Runs multi-step jobs on its own and reports back when they are done.</p>
              <div className="chips"><span>Inventory checks</span><span>Appointment confirmations</span><span>Price validation</span></div>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 8a8 8 0 0 0-14-2M4 4v4h4M4 16a8 8 0 0 0 14 2M20 20v-4h-4" /></svg></span>
              <h3>Self-correcting loop</h3>
              <p>Every result is drafted, run, reviewed and refined before it reaches a customer.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" /></svg></span>
              <h3>Bill and invoice reader</h3>
              <p>Vision AI turns messy receipts and tax documents into clean, standard data.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg></span>
              <h3>WhatsApp inbox</h3>
              <p>All customer messages in one place, with instant replies to routine questions.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></svg></span>
              <h3>High-value lead alerts</h3>
              <p>You are pinged the moment a big enquiry arrives, even if Kada is handling the rest.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3" /></svg></span>
              <h3>Live dashboard and logs</h3>
              <p>See what the agent did in plain words, with clear success badges and no raw data.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="8" rx="4" /><circle cx="16" cy="12" r="2" /></svg></span>
              <h3>Manual override</h3>
              <p>Pause the agent or take over any chat with one tap.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Bill Reader Showcase */}
        <section className="inv">
          <p className="eyebrow">Bill reader</p>
          <h2 className="t">From a crumpled bill to clean data.</h2>
          <p className="sub">Take a photo of a supplier receipt. Kada reads it and saves tidy records, ready for your books. Sample shown.</p>
          <div className="inv-grid">
            <div className="paper-wrap">
              <div className="paper" aria-label="Sample supplier receipt">
                <div className="scan" />
                <h4>SREE LAKSHMI TRADERS</h4><small>Alappuzha &middot; 02-10-2026</small>
                <div className="pr"><span>Rice 50 kg</span><span>2400</span></div>
                <div className="pr"><span>Sugar 25 kg</span><span>1100</span></div>
                <div className="pr"><span>Oil 10 L</span><span>1320</span></div>
                <div className="pr tot"><span>TOTAL</span><span>4820</span></div>
              </div>
            </div>
            <div className="arrow" aria-hidden="true">&rarr;</div>
            <pre className="json" aria-label="Extracted data">
              <span className="jl">{'{'}</span>{'\n'}
              <span className="jl">{'  "supplier": "Sree Lakshmi Traders",'}</span>{'\n'}
              <span className="jl">{'  "date": "2026-10-02",'}</span>{'\n'}
              <span className="jl">{'  "items": ['}</span>{'\n'}
              <span className="jl">{'    { "name": "Rice", "qty": "50 kg", "amount": 2400 },'}</span>{'\n'}
              <span className="jl">{'    { "name": "Sugar", "qty": "25 kg", "amount": 1100 },'}</span>{'\n'}
              <span className="jl">{'    { "name": "Oil", "qty": "10 L", "amount": 1320 }'}</span>{'\n'}
              <span className="jl">{'  ],'}</span>{'\n'}
              <span className="jl">{'  "total": 4820,'}</span>{'\n'}
              <span className="jl">{'  "total_matches_items": true'}</span>{'\n'}
              <span className="jl">{'}'}</span>
            </pre>
          </div>
        </section>

        {/* Section 5: Dashboard Preview */}
        <section id="dashboard">
          <div className="dash-grid">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h2 className="t">Your day, at a glance.</h2>
              <p className="sub">A live feed of what Kada is doing, built for one hand on a phone. Try the switch to take control.</p>
              <ul className="ticks">
                <li>Real-time agent status and activity logs</li>
                <li>Clear badges: done, or needs you</li>
                <li>Pause or take over with one tap</li>
                <li>Thumb-friendly controls at the bottom of the screen</li>
              </ul>
              <div style={{ marginTop: '1.4rem' }}>
                <button className="btn" onClick={onLaunchApp} style={{ minHeight: '44px', padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}>
                  Open live dashboard &rarr;
                </button>
              </div>
            </div>
            <div className="dash" aria-label="Sample dashboard">
              <div className="dh">
                <div><b>Today</b><small>Anitha&apos;s Tailoring &middot; sample data</small></div>
                <button className="swt" id="sw" role="switch" aria-checked="true" aria-label="Agent auto mode" data-testid="dashboard-switch">
                  <span className="k" />
                </button>
              </div>
              <p className="mode">
                <span className="m-auto"><i />Kada is handling messages</span>
                <span className="m-man">You are in control. New messages wait for you.</span>
              </p>
              <div className="tiles">
                <div><b>12</b>Bookings</div>
                <div><b>5</b>Bills read</div>
                <div><b>38</b>Chats</div>
                <div><b>2</b>Needs you</div>
              </div>
              <div className="feed">
                <div className="row"><span className="dot ok">&#10003;</span><span>Booked fitting for 2, tomorrow 10:00</span><em className="ok">Done</em></div>
                <div className="row"><span className="dot ok">&#10003;</span><span>Read bill from Sree Lakshmi, 4820</span><em className="ok">Done</em></div>
                <div className="row"><span className="dot wa">!</span><span>Bulk order enquiry from Rahul</span><em className="wa">Needs you</em></div>
                <div className="row"><span className="dot ok">&#10003;</span><span>Replied to a price question</span><em className="ok">Done</em></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Getting Started Stepper */}
        <section className="onb">
          <p className="eyebrow">Getting started</p>
          <h2 className="t">Live in 2 minutes.</h2>
          <div className="ob-bar" aria-hidden="true"><b /></div>
          <ol className="ob">
            <li><b>1</b><div><h3>Name your shop</h3><p>Add your business name and logo.</p></div></li>
            <li><b>2</b><div><h3>Set your hours</h3><p>So Kada knows when to book customers.</p></div></li>
            <li><b>3</b><div><h3>Add your first product</h3><p>Or a service, with its price.</p></div></li>
            <li><b>4</b><div><h3>Send a voice note</h3><p>Say it in Malayalam. You are live.</p></div></li>
          </ol>
        </section>

        {/* Section 7: Under the Hood Tech Stack */}
        <section>
          <p className="eyebrow">Under the hood</p>
          <h2 className="t">Built to run every day.</h2>
          <div className="stack">
            <span>NestJS</span><span>MySQL + Prisma</span><span>Redis queues</span><span>Next.js + Tailwind</span>
            <span>Whisper speech-to-text</span><span>OpenAI / Anthropic</span><span>Docker on AWS ECS</span><span>WhatsApp Business API</span>
          </div>
        </section>

        {/* Section 8: Final CTA Banner */}
        <section className="final" id="start">
          <h2 className="t">Set up your shop in 2 minutes.</h2>
          <p className="sub">Add your business name, opening hours and first product. Then send your first voice note.</p>
          <button className="kb kb-dark" data-testid="cta-final" onClick={onLaunchApp}>Start free setup</button>
        </section>

        <footer>Kada. Made for the small businesses of Kerala.</footer>
      </div>

      {/* Floating Sticky Dock (Mobile) */}
      <div className="dock">
        <button className="kb kb-dark" data-testid="cta-dock" onClick={onLaunchApp}>Start free setup</button>
      </div>

      {/* ── CSS ── */}
      <style>{`
        *,*::before,*::after { box-sizing: border-box; }
        :root {
          color-scheme: light;
          --bg: #f8fbf8; --surface: #fff; --tint: #f0f6f1; --line: #dde7df; --ink: #1b2a23; --muted: #5f7167;
          --accent: #3f7a5c; --accent-d: #2c5a43; --soft: #e3efe7;
          --shadow: 0 1px 2px rgba(27,42,35,.04),0 14px 36px rgba(27,42,35,.07);
          --gap: clamp(3.5rem,9vw,6.5rem);
        }
        body { margin: 0; background: var(--bg); color: var(--ink); font: 400 1.05rem/1.65 'Hanken Grotesk',system-ui,sans-serif; overflow-x: hidden; }
        html.kada-lock, html.kada-lock body { overflow: hidden; height: 100%; }
        h1, h2, h3 { margin: 0; letter-spacing: -.015em; }
        h2, h3 { font-family: 'Newsreader','Noto Sans Malayalam',Georgia,serif; font-weight: 500; line-height: 1.1; }
        .ml { font-family: 'Noto Sans Malayalam',sans-serif; }
        a { color: inherit; }
        .landing-root { min-height: 100vh; background: radial-gradient(60vmax 60vmax at 5% 0,#d4eedf,transparent 60%),radial-gradient(55vmax 55vmax at 100% 20%,#d9eef0,transparent 60%),var(--bg); }
        .wrap { max-width: 1080px; margin: 0 auto; padding: 0 1.25rem; }

        /* ── KadaIntro ── */
        .ki { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; }
        .ki-bg { position: absolute; inset: 0; background: linear-gradient(160deg,#e7f5ec,#f8fbf8 55%,#eaf5f3); }
        .ki-lw { position: relative; max-width: 92vw; }
        .ki-lock { position: relative; display: flex; align-items: center; transform-origin: 0 0; font: 500 clamp(2.8rem,11vw,4rem)/1.65 'Newsreader',Georgia,serif; will-change: transform; }
        .ki-mk { display: block; flex: none; width: .6875em; height: .6875em; border-radius: 50% 50% 50% 12%; background: var(--accent); transform: scale(0); }
        .ki-wd { display: block; overflow: hidden; white-space: nowrap; max-width: 0; opacity: 0; }
        .ki-tag { position: absolute; left: 0; right: 0; top: 100%; margin-top: -.3rem; text-align: center; font: 400 clamp(1.05rem,3.4vw,1.3rem)/1.4 'Noto Sans Malayalam',sans-serif; letter-spacing: .04em; color: var(--muted); opacity: 0; }
        @media(max-width:380px) { .ki-lock { font-size: 2.6rem; } .ki-tag { font-size: 1rem; } }

        /* ── Nav ── */
        .kada-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 0; position: relative; z-index: 1; }
        .logo { font: 500 1.6rem 'Newsreader',serif; text-decoration: none; display: flex; gap: .55rem; align-items: center; color: var(--ink); }
        .logo i { width: 1.1rem; height: 1.1rem; border-radius: 50% 50% 50% 12%; background: var(--accent); }
        .links { display: none; gap: 1.8rem; font-size: .95rem; color: var(--muted); }
        .links a { text-decoration: none; }
        .links a:hover { color: var(--ink); }
        .kada-nav > :not(.logo) { transition: opacity .7s ease .1s; }
        html.kada-lock .kada-nav > :not(.logo) { opacity: 0; }

        /* ── Buttons ── */
        .kb { display: inline-flex; align-items: center; justify-content: center; gap: .6rem; min-height: 48px; padding: .8rem 1.6rem; border-radius: 999px; border: 1px solid var(--accent); font: 500 1rem 'Hanken Grotesk',sans-serif; text-decoration: none; cursor: pointer; transition: background .25s; }
        .kb-dark { background: var(--ink); border-color: var(--ink); color: #fff; box-shadow: 0 14px 30px -10px rgba(27,42,35,.55); }
        .kb-dark:hover { background: var(--accent-d); border-color: var(--accent-d); }
        .kb-ghost { background: rgba(255,255,255,.7); color: var(--ink); border-color: var(--line); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
        .kb:focus-visible, .hx-tab:focus-visible, .hx-replay:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

        /* ── Hero ── */
        .hero { position: relative; display: grid; gap: 3.5rem; align-items: center; padding: 1.2rem 0 var(--gap); }
        .hero::before { content: ""; position: absolute; z-index: -1; inset: -3rem -50vw 0; background-image: radial-gradient(rgba(63,122,92,.2) 1px,transparent 1.3px); background-size: 22px 22px; -webkit-mask-image: radial-gradient(55% 60% at 68% 42%,#000,transparent 75%); mask-image: radial-gradient(55% 60% at 68% 42%,#000,transparent 75%); }
        .hh { opacity: 0; transform: translateY(26px); transition: opacity .9s cubic-bezier(.22,1,.36,1) calc(var(--i,0)*100ms), transform .9s cubic-bezier(.22,1,.36,1) calc(var(--i,0)*100ms); }
        .hero.in .hh { opacity: 1; transform: none; }
        .hx-copy { display: flex; flex-direction: column; align-items: flex-start; min-width: 0; }
        .hx-live { display: flex; align-items: center; gap: .65rem; width: fit-content; max-width: 100%; padding: .55rem 1.1rem; border-radius: 999px; background: rgba(255,255,255,.72); border: 1px solid var(--line); box-shadow: var(--shadow); font-size: .92rem; font-weight: 500; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
        .hx-live i { flex: none; width: .55rem; height: .55rem; border-radius: 50%; background: var(--accent); animation: hx-pulse 1.6s infinite; }
        @keyframes hx-pulse { 50% { transform: scale(1.7); opacity: .35; } }
        .hero h1 { margin: 1.3rem 0 0; font: 600 clamp(2.8rem,8.4vw,5.7rem)/.97 'Hanken Grotesk',system-ui,sans-serif; letter-spacing: -.052em; }
        .hero h1 span { display: inline-block; padding-bottom: .1em; background: linear-gradient(95deg,#2c5a43,#3f7a5c 35%,#23a08f 70%,#5fb98d); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .hx-ml { display: flex; align-items: center; gap: .75rem; margin: 1.2rem 0 0; font: 500 1.15rem 'Noto Sans Malayalam',sans-serif; color: var(--accent-d); }
        .hx-ml::before { content: ""; width: 2.2rem; height: 1px; background: var(--accent); }
        .hx-lead { margin: 1rem 0 1.8rem; max-width: 30rem; font-size: 1.1rem; color: var(--muted); }
        .hx-cta { display: flex; flex-wrap: wrap; gap: .8rem; }
        .hx-trust { display: flex; flex-wrap: wrap; gap: .4rem 1.3rem; list-style: none; margin: 2rem 0 0; padding: 0; font-size: .86rem; color: var(--muted); }
        .hx-trust li::before { content: ""; display: inline-block; width: .42rem; height: .42rem; margin-right: .5rem; border-radius: 50%; background: var(--accent); vertical-align: middle; }
        .hx-stage { isolation: isolate; position: relative; width: min(340px,100%); margin: 0 auto; }
        .hx-stage::before { content: ""; position: absolute; z-index: -1; inset: -16% -34%; filter: blur(34px); background: radial-gradient(closest-side at 28% 36%,rgba(103,201,150,.6),transparent),radial-gradient(closest-side at 74% 58%,rgba(120,205,215,.55),transparent),radial-gradient(closest-side at 48% 92%,rgba(245,226,150,.5),transparent); animation: hx-drift 14s ease-in-out infinite alternate; }
        @keyframes hx-drift { to { transform: translate3d(4%,3%,0) scale(1.1); } }
        .hx-phone { width: 100%; border-radius: 2.2rem; padding: .55rem; background: linear-gradient(160deg,#fff,#e8f2eb); border: 1px solid rgba(255,255,255,.95); box-shadow: 0 60px 90px -34px rgba(44,90,67,.5),0 0 0 7px rgba(255,255,255,.4); transform: perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .35s ease-out; }
        .hx-screen { border-radius: 1.7rem; background: var(--tint); height: 480px; overflow: hidden; padding: .9rem; display: flex; flex-direction: column; gap: .6rem; }
        .hx-tabs { display: flex; gap: .2rem; background: var(--surface); padding: .25rem; border-radius: 999px; border: 1px solid var(--line); }
        .hx-tab { flex: 1; border: 0; background: none; min-height: 40px; padding: .45rem .2rem; border-radius: 999px; font: 500 .82rem 'Hanken Grotesk',sans-serif; color: var(--muted); cursor: pointer; transition: background .25s,color .25s; }
        .hx-tab[aria-selected="true"] { background: var(--soft); color: var(--accent-d); }
        .hx-scene { display: flex; flex-direction: column; gap: .55rem; flex: 1; overflow: hidden; }
        .dm { max-width: 88%; padding: .6rem .85rem; border-radius: 1rem; font-size: .93rem; line-height: 1.5; }
        .dm.in { background: var(--surface); border: 1px solid var(--line); border-bottom-left-radius: .3rem; }
        .dm.out { align-self: flex-end; background: var(--accent); color: #fff; border-bottom-right-radius: .3rem; }
        .dm.ml { font-family: 'Noto Sans Malayalam',sans-serif; }
        .dm-pop { animation: dm-fade .5s both; }
        @keyframes dm-fade { from { opacity: 0; transform: translateY(6px); } }
        .dm-code { align-self: stretch; background: var(--soft); color: var(--accent-d); font: .78rem ui-monospace,monospace; white-space: pre-wrap; border-radius: .8rem; padding: .6rem .8rem; }
        .dm-bill { background: var(--surface); border: 1px solid var(--line); border-radius: .8rem; padding: .6rem .85rem; font-size: .9rem; }
        .dm-bill div { display: flex; justify-content: space-between; padding: .1rem 0; }
        .dm-bill .tot { border-top: 1px dashed var(--line); margin-top: .3rem; padding-top: .4rem; font-weight: 600; }
        .dm-voice { display: flex; align-items: center; gap: .6rem; }
        .dm-wave { display: flex; gap: 3px; align-items: center; height: 22px; }
        .dm-wave s { width: 3px; border-radius: 2px; background: var(--accent); height: 35%; }
        .dm-wave s:nth-child(3n) { height: 90%; } .dm-wave s:nth-child(3n+1) { height: 60%; } .dm-wave s:nth-child(5n) { height: 100%; }
        .hx-replay { margin-top: auto; align-self: center; border: 1px solid var(--line); background: var(--surface); color: var(--muted); border-radius: 999px; padding: .45rem 1rem; font: 500 .85rem 'Hanken Grotesk',sans-serif; cursor: pointer; min-height: 40px; }
        .hx-card { position: absolute; z-index: 3; display: none; gap: .3rem; padding: .8rem .95rem; border-radius: 1.15rem; font-size: .8rem; line-height: 1.3; background: rgba(255,255,255,.64); -webkit-backdrop-filter: blur(16px) saturate(1.5); backdrop-filter: blur(16px) saturate(1.5); border: 1px solid rgba(255,255,255,.9); box-shadow: 0 22px 44px -16px rgba(27,42,35,.3); animation: hx-bob 6s ease-in-out infinite; transition: translate .4s cubic-bezier(.22,1,.36,1), opacity .35s ease; }
        @keyframes hx-bob { 50% { transform: translateY(-8px); } }
        .hx-card small { display: block; color: var(--muted); font-size: .74rem; }
        .c1 { left: -5.6rem; top: 9%; grid-auto-flow: column; align-items: center; gap: .7rem; translate: calc(var(--px,0)*-40px) calc(var(--py,0)*-24px); }
        .c2 { right: -5.2rem; top: 36%; animation-delay: -2s; translate: calc(var(--px,0)*56px) calc(var(--py,0)*-18px); }
        .c3 { left: -4.6rem; bottom: 13%; grid-auto-flow: column; align-items: center; gap: .7rem; animation-delay: -4s; translate: calc(var(--px,0)*-52px) calc(var(--py,0)*30px); }
        .hx-stage:hover .c1 { translate: -140px -10px; opacity: .35; }
        .hx-stage:hover .c2 { translate: 140px 0px;  opacity: .35; }
        .hx-stage:hover .c3 { translate: -130px 10px; opacity: .35; }
        .hx-num { font: 600 1.55rem/1.1 'Hanken Grotesk',sans-serif; letter-spacing: -.03em; }
        .hx-num em { font: 600 .72rem 'Hanken Grotesk',sans-serif; font-style: normal; color: var(--accent-d); background: var(--soft); border-radius: 999px; padding: .15rem .5rem; vertical-align: middle; margin-left: .3rem; letter-spacing: 0; }
        .hx-card svg path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hx-draw 2s 1.2s ease forwards; }
        @keyframes hx-draw { to { stroke-dashoffset: 0; } }
        .hx-wv { display: flex; align-items: center; gap: 3px; height: 26px; }
        .hx-wv i { width: 3px; height: 100%; border-radius: 2px; background: var(--accent); animation: hx-wv 1s ease-in-out infinite; }
        @keyframes hx-wv { 50% { transform: scaleY(.3); } }
        .hx-ok { width: 1.7rem; height: 1.7rem; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: #fff; font-size: .8rem; flex: none; }
        .lv { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: opacity .25s, transform .25s; }
        .lv.out { opacity: 0; transform: translateY(6px); }
        @media(min-width:700px) { .hx-card { display: grid; } }
        @media(min-width:960px) { .hero { grid-template-columns: 1.08fr .92fr; } .hx-stage { width: 350px; } .hx-phone { --ry: -9deg; --rx: 3deg; } }
        @keyframes hxpop { from { opacity: 0; transform: translateY(14px); } }
        @media(max-width:699px) {
          .hero { gap: 2.2rem; padding-top: .4rem; }
          .hero::before { -webkit-mask-image: radial-gradient(75% 38% at 50% 82%,#000,transparent 80%); mask-image: radial-gradient(75% 38% at 50% 82%,#000,transparent 80%); }
          .hero h1 { font-size: clamp(3.1rem,15.5vw,4.3rem); line-height: .95; margin-top: 1.1rem; }
          .hx-cta { flex-direction: column; width: 100%; gap: .7rem; }
          .hx-cta .kb { width: 100%; }
          .hx-trust { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; width: 100%; margin-top: 1.6rem; }
          .hx-trust li { padding: .55rem .8rem; border-radius: .9rem; background: rgba(255,255,255,.72); border: 1px solid var(--line); font-size: .82rem; color: var(--ink); }
          .hx-trust li::before { display: none; }
          .hx-stage { width: 100%; margin: .2rem 0 .6rem; display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
          .hx-stage::before { inset: -8% -12%; opacity: .9; }
          .hx-phone { grid-column: 1/-1; order: -1; padding: 0; background: none; border: 0; box-shadow: none; transform: none !important; border-radius: 1.5rem; }
          .hx-screen { height: 370px; border-radius: 1.5rem; background: rgba(255,255,255,.72); border: 1px solid var(--line); box-shadow: 0 24px 50px -24px rgba(44,90,67,.45); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
          .hx-card { display: grid; position: static; translate: none; animation: none; font-size: .78rem; }
          .hx-card.c1 { display: none; }
          .hero.in .hx-card { animation: hxpop .7s .5s cubic-bezier(.22,1,.36,1) both; }
          .hero.in .hx-card.c3 { animation-delay: .7s; }
          .hx-num { font-size: 1.25rem; }
          .hx-card svg { width: 104px; height: 32px; }
        }

        /* Sections Common */
        section { padding: var(--gap) 0; border-top: 1px solid rgba(63,122,92,.14); position: relative; z-index: 1; }
        .t { font-size: clamp(1.9rem,4.5vw,2.8rem); max-width: 30rem; }
        .sub { color: var(--muted); max-width: 34rem; margin: 1rem 0 0; }

        /* ── Section 2: Agent Workflow (aw-* namespace) ── */
        .aw-sec { padding: var(--gap) 0 0; }
        .aw-rise { opacity: 0; transform: translateY(26px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
        .aw-rise.in { opacity: 1; transform: none; }
        .aw-eyebrow { margin: 0 0 .8rem; color: var(--accent); font-weight: 600; font-size: .8rem; letter-spacing: .14em; text-transform: uppercase; }
        .aw-title { font: 600 clamp(2.2rem,6.6vw,4rem)/1.02 'Hanken Grotesk',system-ui,sans-serif; letter-spacing: -.045em; max-width: 16ch; }
        .aw-sub { margin: 1rem 0 0; max-width: 36rem; color: var(--muted); font-size: 1.08rem; }
        .aw-win { margin-top: 2rem; border-radius: 1.6rem; background: rgba(255,255,255,.9); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); box-shadow: 0 0 0 1px rgba(27,42,35,.06), 0 30px 70px rgba(63,122,92,.16), inset 0 1px 0 #fff; overflow: hidden; }
        .aw-bar { display: flex; align-items: center; gap: .45rem; padding: .55rem .6rem .55rem 1rem; border-bottom: 1px solid var(--line); font-size: .82rem; color: var(--muted); }
        .aw-bar > i { width: .6rem; height: .6rem; border-radius: 50%; background: #dfe7e1; }
        .aw-bt { margin-left: .5rem; }
        .aw-run { margin-left: auto; display: flex; align-items: center; gap: .45rem; min-height: 40px; padding: .3rem .8rem; border-radius: 999px; color: var(--accent-d); font: 500 .82rem 'Hanken Grotesk',sans-serif; cursor: pointer; transition: background .2s; border: 0; background: none; }
        .aw-run:hover { background: var(--soft); }
        .aw-run:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .aw-run b { width: .5rem; height: .5rem; border-radius: 50%; background: var(--accent); opacity: .45; }
        .aw-run b.on { opacity: 1; animation: aw-pulse 1.6s infinite; }
        @keyframes aw-pulse { 50% { transform: scale(1.7); opacity: .35; } }
        .aw-cv { position: relative; container-type: inline-size; width: 100%; background: #f6faf7 radial-gradient(rgba(63,122,92,.2) 1px,transparent 1.3px) 0 0/22px 22px; }
        .aw-cv > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .aw-base { fill: none; stroke: #c3d6c9; stroke-width: 2; stroke-dasharray: 3 7; stroke-linecap: round; }
        .aw-act { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
        .aw-retry { fill: none; stroke: #c58a1f; stroke-width: 2; stroke-dasharray: 4 5; stroke-linecap: round; opacity: 0; }
        .aw-rt { font: 500 11px 'Hanken Grotesk',sans-serif; fill: #8a5f0f; opacity: 0; }
        .aw-nd { position: absolute; display: flex; align-items: center; gap: .6rem; padding: 0 .7rem; border-radius: 1rem; background: #fff; border: 1px solid var(--line); box-shadow: 0 6px 18px rgba(27,42,35,.08); opacity: 0; transition: border-color .3s, box-shadow .3s, background .3s; }
        .aw-nd.hot { border-color: var(--accent); background: #f2faf5; box-shadow: 0 0 0 4px rgba(63,122,92,.14), 0 10px 26px rgba(63,122,92,.2); }
        .is-seen .aw-nd { animation: aw-in .5s var(--d) cubic-bezier(.34,1.4,.64,1) both; }
        .is-seen .aw-act { animation: aw-draw .35s var(--d) linear forwards; }
        .is-seen .aw-retry, .is-seen .aw-rt { animation: aw-fade .6s 2.3s both; }
        @keyframes aw-in { from { opacity: 0; transform: translateY(18px) scale(.9); } to { opacity: 1; } }
        @keyframes aw-draw { to { stroke-dashoffset: 0; } }
        @keyframes aw-fade { to { opacity: 1; } }
        .aw-nic { flex: none; width: 2rem; height: 2rem; border-radius: .7rem; background: var(--soft); color: var(--accent-d); display: grid; place-items: center; }
        .aw-nic svg { display: block; width: 18px; height: 18px; }
        .aw-nt { min-width: 0; }
        .aw-nt b { display: block; font-weight: 600; line-height: 1.2; }
        .aw-nt small { display: block; color: var(--muted); line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tall .aw-nt b { font-size: max(14px,4.2cqw); } .tall .aw-nt small { font-size: max(11.5px,3.3cqw); }
        .wide .aw-nd { flex-direction: column; align-items: flex-start; justify-content: center; gap: .3rem; }
        .wide .aw-nt { max-width: 100%; } .wide .aw-nt b { font-size: max(12.5px,1.45cqw); } .wide .aw-nt small { font-size: max(10.5px,1.15cqw); }
        .wide .aw-nic { width: 1.7rem; height: 1.7rem; }
        .aw-note { margin: .9rem 0 0; font-size: .85rem; color: var(--muted); text-align: center; }
        @media (prefers-reduced-motion:reduce) {
          .aw-rise { opacity: 1; transform: none; transition: none; }
          .aw-nd, .aw-retry, .aw-rt { opacity: 1; animation: none !important; }
          .aw-act { stroke-dashoffset: 0; animation: none !important; }
          .aw-run b { animation: none; }
        }

        /* Bento Features Grid */
        .bento { display: grid; gap: 1rem; margin-top: 2.5rem; }
        .bc { padding: 1.6rem; border-radius: 1.3rem; background: rgba(255,255,255,.88); border: 1px solid var(--line); box-shadow: var(--shadow); transition: box-shadow .3s; }
        .bc:hover { box-shadow: 0 1px 2px rgba(27,42,35,.04), 0 20px 44px rgba(63,122,92,.16); }
        .bc.soft { background: rgba(227,239,231,.9); }
        .bc h3 { font-size: 1.3rem; margin: 1.1rem 0 .45rem; }
        .bc p { margin: 0; color: var(--muted); font-size: .98rem; }
        .ico { display: grid; place-items: center; width: 2.7rem; height: 2.7rem; border-radius: .9rem; background: var(--soft); color: var(--accent-d); }
        .bc.soft .ico { background: #fff; }
        .chips { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: 1rem; }
        .chips span { padding: .3rem .75rem; border-radius: 999px; background: var(--soft); color: var(--accent-d); font-size: .82rem; font-weight: 500; }
        .bc.soft .chips span { background: #fff; }

        /* Invoice Bill Reader */
        .inv-grid { display: grid; gap: 1.2rem; margin-top: 2.5rem; align-items: center; }
        .paper-wrap { display: grid; place-items: center; padding: 1rem; }
        .paper { position: relative; width: min(300px,100%); padding: 1.4rem 1.3rem; background: #fffdf6; border: 1px solid #e8e2cc; border-radius: .4rem; box-shadow: var(--shadow); transform: rotate(-2deg); font: .85rem/1.5 ui-monospace,monospace; color: #4a4636; overflow: hidden; }
        .paper h4 { margin: 0; font: 600 .9rem ui-monospace,monospace; }
        .paper small { display: block; margin-bottom: .8rem; color: #8a846b; }
        .pr { display: flex; justify-content: space-between; border-bottom: 1px dashed #ddd6bd; padding: .25rem 0; }
        .pr.tot { font-weight: 700; border: 0 !important; margin-top: .3rem; }
        .scan { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: var(--accent); box-shadow: 0 0 16px 4px rgba(63,122,92,.6), 0 0 4px 1px #fff; opacity: 0; z-index: 5; pointer-events: none; }
        .arrow { text-align: center; font-size: 1.8rem; color: var(--accent); transform: rotate(90deg); }
        .json { margin: 0; padding: 1.2rem 1.3rem; border-radius: 1.1rem; background: #16372a; color: #cfeadb; font: .8rem/1.7 ui-monospace,monospace; overflow-x: auto; box-shadow: var(--shadow); }
        .jl { display: block; white-space: pre; }

        /* Dashboard Preview */
        .dash-grid { display: grid; gap: 2.2rem; align-items: center; }
        .ticks { list-style: none; padding: 0; margin: 1.6rem 0 0; display: grid; gap: .7rem; }
        .ticks li { position: relative; padding-left: 1.8rem; color: var(--ink); }
        .ticks li::before { content: "\\2713"; position: absolute; left: 0; top: .1rem; width: 1.2rem; height: 1.2rem; border-radius: 50%; background: var(--soft); color: var(--accent-d); font-size: .72rem; display: grid; place-items: center; }
        .dash { padding: 1.2rem; border-radius: 1.5rem; background: rgba(255,255,255,.92); border: 1px solid var(--line); box-shadow: 0 30px 70px rgba(63,122,92,.16); min-width: 0; }
        .dh { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .dh b { display: block; font: 500 1.3rem 'Newsreader',serif; }
        .dh small { color: var(--muted); font-size: .82rem; }
        .swt { position: relative; flex: none; width: 3.4rem; height: 2rem; border-radius: 999px; border: 0; background: var(--line); cursor: pointer; transition: background .3s; }
        .swt[aria-checked="true"] { background: var(--accent); }
        .swt .k { position: absolute; top: .25rem; left: .25rem; width: 1.5rem; height: 1.5rem; border-radius: 50%; background: #fff; transition: transform .3s; box-shadow: 0 1px 3px rgba(0,0,0,.2); display: block; }
        .swt[aria-checked="true"] .k { transform: translateX(1.4rem); }
        .swt:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .mode { margin: .9rem 0; padding: .6rem .9rem; border-radius: .8rem; background: var(--soft); color: var(--accent-d); font-size: .88rem; font-weight: 500; }
        .mode i { display: inline-block; width: .5rem; height: .5rem; border-radius: 50%; background: var(--accent); margin-right: .5rem; animation: hx-pulse 1.6s infinite; }
        .m-man { display: none; }
        .dash.manual .m-auto { display: none; }
        .dash.manual .m-man { display: inline; }
        .dash.manual .mode { background: #f6ecd3; color: #8a5f0f; }
        .tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; }
        .tiles div { padding: .7rem .3rem; border-radius: .9rem; background: var(--tint); text-align: center; font-size: .75rem; color: var(--muted); }
        .tiles b { display: block; font: 500 1.5rem 'Newsreader',serif; color: var(--ink); }
        .feed { margin-top: .9rem; display: grid; gap: .1rem; }
        .row { display: flex; align-items: center; gap: .7rem; padding: .65rem .2rem; border-top: 1px solid var(--line); font-size: .9rem; }
        .row span:nth-child(2) { flex: 1; min-width: 0; }
        .dot { flex: none; width: 1.5rem; height: 1.5rem; border-radius: 50%; display: grid; place-items: center; font-size: .75rem; font-weight: 700; }
        .dot.ok { background: var(--soft); color: var(--accent-d); }
        .dot.wa { background: #f6ecd3; color: #8a5f0f; }
        .row em { font-style: normal; font-size: .75rem; font-weight: 600; padding: .2rem .6rem; border-radius: 999px; flex: none; }
        em.ok { background: var(--soft); color: var(--accent-d); }
        em.wa { background: #f6ecd3; color: #8a5f0f; }

        /* Onboarding Stepper */
        .ob-bar { height: 4px; border-radius: 4px; background: rgba(63,122,92,.14); overflow: hidden; margin-top: 1.6rem; }
        .ob-bar b { display: block; height: 100%; width: 100%; background: var(--accent); }
        .ob { list-style: none; margin: 1.8rem 0 0; padding: 0; display: grid; gap: 1rem; }
        .ob li { display: flex; gap: 1rem; align-items: flex-start; padding: 1.2rem; border-radius: 1.2rem; background: rgba(255,255,255,.88); border: 1px solid var(--line); }
        .ob li > b { flex: none; width: 2.2rem; height: 2.2rem; border-radius: 50%; background: var(--accent); color: #fff; display: grid; place-items: center; }
        .ob h3 { font-size: 1.15rem; }
        .ob p { margin: .2rem 0 0; color: var(--muted); font-size: .93rem; }

        /* Tech Stack */
        .stack { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 2rem; }
        .stack span { padding: .5rem 1rem; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); font-size: .93rem; background: rgba(255,255,255,.85); }

        /* Final Banner & Footer */
        .final { text-align: center; padding: 4.5rem 1.5rem; margin: 0 0 3rem; border: 0; border-radius: 1.8rem; background: linear-gradient(135deg,#d3ebdc,#d6ecef 60%,#efeccd); }
        .final h2 { margin: 0 auto 1rem; }
        .final .sub { margin: 0 auto 2rem; }
        footer { color: var(--muted); font-size: .9rem; padding: 0 0 6rem; text-align: center; position: relative; z-index: 1; }

        /* Sticky Dock (Mobile) */
        .dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 5; padding: .7rem 1rem calc(.7rem + env(safe-area-inset-bottom,0px)); display: flex; justify-content: center; background: linear-gradient(transparent,var(--bg) 45%); pointer-events: none; transition: opacity .3s, transform .3s; opacity: 0; transform: translateY(100%); }
        .dock.on { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .dock .kb { pointer-events: auto; }

        /* Responsive Breakpoints */
        @media (min-width: 860px) {
          .links { display: flex; }
          .bento { grid-template-columns: repeat(6, 1fr); }
          .bc { grid-column: span 2; }
          .bc.w3 { grid-column: span 3; }
          .inv-grid { grid-template-columns: 1fr auto 1.2fr; }
          .arrow { transform: none; }
          .dash-grid { grid-template-columns: .9fr 1.1fr; gap: 4rem; }
          .ob { grid-template-columns: repeat(4, 1fr); }
          .ob li { flex-direction: column; }
          .dock { display: none; }
          footer { padding-bottom: 2rem; }
        }

        @media (max-width: 859px) {
          :root { --gap: 2.75rem; }
          .kada-nav { padding: .7rem 0; }
          .logo { font-size: 1.4rem; }
          .kada-nav .kb { padding: .55rem 1.1rem; min-height: 40px; font-size: .9rem; }
          .t { font-size: 1.8rem; }
          .sub { font-size: .98rem; margin-top: .7rem; }
          .bento { margin-top: 1.6rem; gap: .8rem; }
          .bc { padding: 1.25rem; }
          .bc h3 { margin-top: .8rem; font-size: 1.2rem; }
          .inv-grid, .ob { margin-top: 1.6rem; }
          .ob li { padding: 1rem; }
          .stack { flex-wrap: nowrap; overflow-x: auto; margin: 1.4rem -1.25rem 0; padding: 0 1.25rem; scrollbar-width: none; }
          .stack::-webkit-scrollbar { display: none; }
          .stack span { flex: none; }
          .final { padding: 3rem 1.2rem; margin-bottom: 2rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hx-stage::before, .hx-card, .hx-wv i { animation: none; }
          .hx-card svg path { animation: none; stroke-dashoffset: 0; }
          .hh { transition: none; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
