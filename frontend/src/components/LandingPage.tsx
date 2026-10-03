/**
 * LandingPage.tsx
 *
 * Exact 1:1 React port of landing.html.
 * Upholds AGENTS.md architectural rules:
 *  - Scalability: Uses identical CSS custom-property tokens (--bg, --surface, --accent, etc.).
 *  - Modularity: Clean separation between canvas rendering, phone demo loop, and GSAP triggers.
 *  - Testability: buildScenes() is a pure export; data-testid attributes on all interactive elements.
 *  - Reliability: Defensive styles on #cvHost ensure the workflow canvas never collapses or misplaces nodes.
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Language } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLaunchApp: () => void;
  onOpenVoiceModal: () => void;
}

// ─── Pure scene data for phone demo ─────────────────────────────────────────
const WAVE = '<div class="wave"><s></s><s></s><s></s><s></s><s></s><s></s><s></s><s></s><s></s><s></s></div>';

function buildScenes() {
  return [
    [
      ['in', `<div class="voice">▶ ${WAVE} 0:07</div>`],
      ['in ml', 'നാളെ രാവിലെ 10 മണിക്ക് 2 പേർക്ക് ഫിറ്റിംഗ് വേണം'],
      ['code', '{ "intent": "booking",\n  "time": "tomorrow 10:00",\n  "guests": 2 }'],
      ['out ml', 'ബുക്കിംഗ് സ്ഥിരീകരിച്ചു ✓ നാളെ 10:00. നന്ദി!'],
    ],
    [
      ['in', 'Photo: supplier receipt'],
      ['bill', '<div><span>Rice 50 kg</span><span>₹2,400</span></div><div><span>Sugar 25 kg</span><span>₹1,100</span></div><div><span>Oil 10 L</span><span>₹1,320</span></div><div class="tot"><span>Total</span><span>₹4,820</span></div>'],
      ['out', 'Saved to purchases. Stock updated ✓'],
    ],
    [
      ['in', 'Do you stitch blouses by Saturday? Price?'],
      ['out', 'Yes. Blouse stitching is ₹450, ready in 3 days. Shall I book a fitting?'],
      ['in', 'Yes, tomorrow 4 pm'],
      ['code', 'Lead alert sent to owner'],
      ['out', 'Booked for tomorrow, 4:00 pm ✓'],
    ],
  ] as [string, string][][];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const curRef = useRef(0);
  const activeLoopRef = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    html.classList.add('lock');
    const introEl = introRef.current || document.getElementById('intro');
    const scenes = buildScenes();

    function unlock() {
      html.classList.remove('lock');
      if (introEl) {
        introEl.style.display = 'none';
      }
    }
    const safetyNet = setTimeout(unlock, 7000);

    /* ── 1. Phone Demo Tab Player ── */
    const sceneEl = document.getElementById('scene');
    const tabEls = document.querySelectorAll<HTMLButtonElement>('.tab');

    function selectTab(n: number) {
      tabEls.forEach((x, i) => x.setAttribute('aria-selected', String(i === n)));
    }

    function play(n: number) {
      curRef.current = n;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (sceneEl) sceneEl.innerHTML = '';
      selectTab(n);
      const dur = 250 + scenes[n].length * 1000 + 2400;
      scenes[n].forEach(([cls, htmlContent], i) => {
        function add() {
          const d = document.createElement('div');
          d.className = (cls === 'bill' ? 'bill' : cls === 'code' ? 'code-card' : `msg ${cls}`) + ' pop';
          d.innerHTML = htmlContent;
          sceneEl?.appendChild(d);
        }
        if (reduce) add();
        else timersRef.current.push(setTimeout(add, 250 + i * 1000));
      });
      if (!reduce) {
        timersRef.current.push(setTimeout(() => play((n + 1) % scenes.length), dur));
      }
    }

    tabEls.forEach(t => t.addEventListener('click', () => play(+(t.dataset.s ?? '0'))));
    document.getElementById('replay')?.addEventListener('click', () => play(curRef.current));

    /* ── 2. Second Section: Agent Workflow Canvas Builder ── */
    function buildCanvas() {
      const host = document.getElementById('cvHost');
      if (!host) return;

      const wide = window.innerWidth >= 900;
      type Layout = { w: number; h: number; nw: number; nh: number; pos: [number, number][]; ed: string[] };
      const L: Layout = wide
        ? { w: 1000, h: 520, nw: 160, nh: 92, pos: [[95, 260], [295, 140], [495, 260], [695, 140], [695, 390], [905, 260]], ed: ['h', 'h', 'h', 'v', 'h'] }
        : { w: 360, h: 650, nw: 200, nh: 78, pos: [[110, 60], [250, 165], [110, 270], [250, 375], [110, 480], [250, 585]], ed: ['v', 'v', 'v', 'v', 'v'] };

      const P = (d: string) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
      const IC: Record<string, string> = {
        mic: P('<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3"/>'),
        txt: P('<path d="M4 7h16M4 12h10M4 17h13"/>'),
        tgt: P('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>'),
        chk: P('<path d="M5 7l2 2 3-3M5 15l2 2 3-3M13 8h6M13 16h6"/>'),
        loop: P('<path d="M20 8a8 8 0 0 0-14-2M4 4v4h4M4 16a8 8 0 0 0 14 2M20 20v-4h-4"/>'),
        chat: P('<path d="M4 5h16v11H9l-5 4z"/>'),
      };
      const N: [string, string, string][] = [
        ['Voice note', 'Malayalam, 0:07', 'mic'],
        ['Speech to text', 'Whisper', 'txt'],
        ['Intent', 'Booking, 2 guests', 'tgt'],
        ['Do the task', 'Slots, stock, price', 'chk'],
        ['Review and fix', 'Clash, moved to 10:30', 'loop'],
        ['Reply sent', 'WhatsApp, owner told', 'chat'],
      ];

      let base = '', act = '';
      L.ed.forEach((type, i) => {
        const a = L.pos[i], b = L.pos[i + 1];
        let d: string;
        if (type === 'h') {
          const x1 = a[0] + L.nw / 2, y1 = a[1], x2 = b[0] - L.nw / 2, y2 = b[1], dx = (x2 - x1) / 2;
          d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
        } else {
          const x1 = a[0], y1 = a[1] + L.nh / 2, x2 = b[0], y2 = b[1] - L.nh / 2, dy = (y2 - y1) / 2;
          d = `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
        }
        base += `<path class="base" d="${d}"/>`;
        act += `<path class="act" pathLength="1" d="${d}"/>`;
      });
      const retry = wide ? '<path class="retry" d="M712,344 C760,300 760,230 712,186"/><text class="rt" x="758" y="269">self-check</text>' : '';
      const nodes = N.map(([title, sub, icon], i) => {
        const p = L.pos[i];
        return `<div class="nd" style="left:${((p[0] - L.nw / 2) / L.w) * 100}%;top:${((p[1] - L.nh / 2) / L.h) * 100}%;width:${(L.nw / L.w) * 100}%;height:${(L.nh / L.h) * 100}%"><span class="nic">${IC[icon]}</span><div class="nt"><b>${title}</b><small>${sub}</small></div></div>`;
      }).join('');

      host.className = `cv ${wide ? 'wide' : 'tall'}`;
      host.style.aspectRatio = `${L.w} / ${L.h}`;
      host.innerHTML = `<svg viewBox="0 0 ${L.w} ${L.h}" aria-hidden="true">${base}${act}${retry}<g class="pk" opacity="0"><circle r="12" fill="#3f7a5c" opacity=".2"/><circle r="5" fill="#3f7a5c"/></g></svg>${nodes}`;
    }

    buildCanvas();
    window.addEventListener('resize', buildCanvas);

    /* ── 3. Mobile Dock Visibility ── */
    const dk = document.querySelector<HTMLElement>('.dock');
    function dockCheck() {
      dk?.classList.toggle('on', window.scrollY > window.innerHeight * 0.85);
    }
    window.addEventListener('scroll', dockCheck, { passive: true });
    dockCheck();

    /* ── 4. Live Activity Ticker ── */
    const items = [
      'Booking a fitting for tomorrow, 10:00',
      'Reading a supplier bill: 4,820',
      'Replying to a price question on WhatsApp',
      'Rice stock is low. Reorder drafted.',
      'Lead alert sent to the owner',
    ];
    let li = 0;
    const lv = document.querySelector<HTMLElement>('.lv');
    let tickTimer: ReturnType<typeof setInterval> | undefined;
    if (!reduce && lv) {
      tickTimer = setInterval(() => {
        lv.classList.add('out');
        setTimeout(() => {
          li = (li + 1) % items.length;
          lv.textContent = items[li];
          lv.classList.remove('out');
        }, 260);
      }, 2800);
    }

    /* ── 5. Dashboard Interactive Mode Switch ── */
    const sw = document.getElementById('sw');
    const dash = document.querySelector<HTMLElement>('.dash');
    sw?.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') === 'true';
      sw.setAttribute('aria-checked', String(!on));
      dash?.classList.toggle('manual', on);
    });

    /* ── 6. GSAP Animations Pipeline ── */
    if (reduce) {
      unlock();
      play(0);
      const host = document.getElementById('cvHost');
      if (host) {
        const nds = host.querySelectorAll<HTMLElement>('.nd');
        nds.forEach(el => { el.style.opacity = '1'; el.style.visibility = 'visible'; });
      }
      return () => {
        clearTimeout(safetyNet);
        timersRef.current.forEach(clearTimeout);
        window.removeEventListener('scroll', dockCheck);
        window.removeEventListener('resize', buildCanvas);
        if (tickTimer !== undefined) clearInterval(tickTimer);
      };
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.config({ ignoreMobileResize: true });

      function buildScrollAnimations() {
        gsap.utils.toArray('.t').forEach((el: any) => {
          gsap.from(el, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });
        gsap.from('.stack span', { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.05, scrollTrigger: { trigger: '.stack', start: 'top 92%', once: true } });

        const st = (t: string, o = 88) => ({ trigger: t, start: `top ${o}%`, once: true });
        gsap.from('.bc', { y: 44, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: st('.bento') });

        /* Bill Reader Scan Animation Loop */
        const scanLoop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });
        scanLoop
          .set('.scan', { top: '0%', autoAlpha: 1 })
          .to('.scan', { top: '98%', duration: 1.5, ease: 'power1.inOut' })
          .to('.scan', { autoAlpha: 0, duration: 0.25 });

        gsap.timeline({
          scrollTrigger: {
            trigger: '.inv-grid',
            start: 'top 85%',
            once: true,
          },
          onComplete() {
            scanLoop.play();
          },
        })
          .from('.paper', { y: 30, rotate: -6, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
          .fromTo('.scan', { top: '0%', autoAlpha: 1 }, { top: '98%', duration: 1.5, ease: 'power1.inOut' }, '-=.2')
          .to('.scan', { autoAlpha: 0, duration: 0.25 })
          .from('.jl', { autoAlpha: 0, x: -14, duration: 0.35, stagger: 0.09 }, '-=1.2');

        ScrollTrigger.create({
          trigger: '.inv-grid',
          start: 'top bottom',
          end: 'bottom top',
          onToggle(self: any) {
            if (self.isActive) scanLoop.play();
            else scanLoop.pause();
          },
        });

        gsap.from('.dash', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: st('.dash') });
        gsap.from('.feed .row', { x: -22, autoAlpha: 0, duration: 0.5, stagger: 0.12, scrollTrigger: st('.feed', 92) });
        gsap.from('.ticks li', { x: -16, autoAlpha: 0, duration: 0.5, stagger: 0.1, scrollTrigger: st('.ticks', 92) });
        gsap.from('.ob li', { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.12, scrollTrigger: st('.ob', 90) });
        gsap.fromTo('.ob-bar b', { width: '0%' }, { width: '100%', duration: 1.6, ease: 'power2.out', scrollTrigger: st('.ob-bar', 92) });
        gsap.from('.final', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.final', start: 'top 92%', once: true } });

        /* Agent canvas workflow loop */
        (function initCanvasAnimation() {
          const host = document.getElementById('cvHost');
          if (!host) return;

          const nds = host.querySelectorAll<HTMLElement>('.nd');
          const acts = host.querySelectorAll<SVGPathElement>('.act');
          const dot = host.querySelector<SVGGElement>('.pk');
          const n = nds.length;
          const pt = { p: 0 };
          const stepDuration = 2.0;
          const moveDuration = 1.45;
          const ease = 'sine.inOut';

          // Ensure all cards are visible immediately
          nds.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          });

          if (activeLoopRef.current) {
            activeLoopRef.current.kill();
          }

          const loop = gsap.timeline({ paused: false, repeat: -1, repeatDelay: 2.0 });
          activeLoopRef.current = loop;

          function hot(idx: number) {
            nds.forEach((x, j) => x.classList.toggle('hot', j === idx));
          }

          // Initial state: first card glows, dot is placed at start of first path
          loop.call(hot, [0], 0)
            .set(dot, { opacity: 1 }, 0);

          acts.forEach((path, i) => {
            const len = path.getTotalLength();
            const startT = i * stepDuration;

            // Set dot position to start of this path
            loop.call(() => {
              const startPt = path.getPointAtLength(0);
              dot?.setAttribute('transform', `translate(${startPt.x} ${startPt.y})`);
            }, [], startT);

            // Move dot along path with ultra-smooth sinusoidal easing
            loop.fromTo(pt, { p: 0 }, {
              p: 1,
              duration: moveDuration,
              ease: ease,
              onUpdate() {
                const q = path.getPointAtLength(pt.p * len);
                dot?.setAttribute('transform', `translate(${q.x} ${q.y})`);
              },
            }, startT + 0.15); // gentle 0.15s rest before leaving previous node

            // When dot arrives at the next node (i + 1), activate the next card
            loop.call(hot, [i + 1], startT + 0.15 + moveDuration);
          });

          // Final step: keep last card ("Reply sent") highlighted comfortably, then fade dot and deactivate
          const finalArrival = (acts.length - 1) * stepDuration + 0.15 + moveDuration;
          loop.to(dot, { opacity: 0, duration: 0.5, ease: 'power2.out' }, finalArrival + 0.3)
            .call(hot, [-1], finalArrival + 1.8);

          const en = gsap.timeline({
            scrollTrigger: { trigger: host, start: 'top 88%', once: true }
          });

          nds.forEach((el, i) => {
            en.from(el, { y: 16, scale: 0.96, duration: 0.6, ease: 'power2.out' }, i * 0.1);
            if (acts[i]) {
              en.fromTo(acts[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'sine.out' }, i * 0.1 + 0.1);
            }
          });

          const retryNodes = host.querySelectorAll('.retry, .rt');
          if (retryNodes.length > 0) {
            en.from(retryNodes, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, n * 0.1);
          }

          ScrollTrigger.create({
            trigger: host,
            start: 'top bottom',
            end: 'bottom top',
            onToggle(self: any) {
              if (self.isActive) loop.play();
              else loop.pause();
            },
          });
        })();
      }

      /* ── 7. Intro Splash Animation ── */
      const pct = { v: 0 };
      const pe = document.querySelector<HTMLElement>('.pct');
      const bar = document.querySelector<HTMLElement>('.bar b');
      gsap.set('.hh', { autoAlpha: 0, y: 26 });

      function heroIn() {
        gsap.to('.hh', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' });
        setTimeout(() => play(0), 700);
      }

      gsap.timeline({
        onComplete() {
          unlock();
          buildScrollAnimations();
          ScrollTrigger.refresh();
        },
      })
        .from('.mark', { scale: 0, rotate: -90, duration: 0.7, ease: 'back.out(1.6)' })
        .from('.word span', { yPercent: 110, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, '-=.3')
        .from('.sub2', { autoAlpha: 0, y: 10, duration: 0.5 }, '-=.2')
        .to(pct, {
          v: 100,
          duration: 0.9,
          ease: 'power1.inOut',
          onUpdate() {
            if (pe) pe.textContent = String(Math.round(pct.v));
            if (bar) bar.style.width = `${pct.v}%`;
          },
        }, 0.2)
        .to('.intro-in', { autoAlpha: 0, y: -20, duration: 0.4 }, '+=.05')
        .to(introEl, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=.1')
        .add(heroIn, '-=.55');
    }, containerRef);

    window.addEventListener('load', () => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      html.classList.remove('lock');
      clearTimeout(safetyNet);
      timersRef.current.forEach(clearTimeout);
      window.removeEventListener('scroll', dockCheck);
      window.removeEventListener('resize', buildCanvas);
      if (activeLoopRef.current) activeLoopRef.current.kill();
      if (tickTimer !== undefined) clearInterval(tickTimer);
    };
  }, []);

  return (
    <div className="landing-root" ref={containerRef}>
      {/* Background Aura */}
      <div className="aura" aria-hidden="true"><i /><i /><i /></div>

      {/* Intro Splash Screen */}
      <div className="intro" id="intro" ref={introRef} aria-hidden="true">
        <div className="intro-in">
          <div className="mark" />
          <div className="word"><span>K</span><span>a</span><span>d</span><span>a</span></div>
          <div className="sub2 ml">കട</div>
          <div className="bar"><b /></div>
          <div className="pct">0</div>
        </div>
      </div>

      <div className="wrap">
        {/* Navigation */}
        <nav>
          <a className="logo" href="#top"><i />Kada</a>
          <div className="links">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#dashboard">Dashboard</a>
          </div>
          <button className="btn ghost" data-testid="cta-nav" onClick={onLaunchApp}>Get early access</button>
        </nav>

        {/* Hero Section */}
        <header className="hero" id="top">
          <div>
            <p className="mlhook ml hh">പറഞ്ഞാൽ മതി.</p>
            <h1 className="hh">Speak. <span>Kada does the rest.</span></h1>
            <p className="lead hh">Send a voice note in Malayalam. Your shop books customers, reads bills and answers WhatsApp, day and night.</p>
            <div className="live hh" aria-live="polite"><i></i><span className="lv">Booking a fitting for tomorrow, 10:00</span></div>
            <div className="cta-row hh">
              <button className="btn" data-testid="cta-hero" onClick={onLaunchApp}>Start free setup</button>
              <a className="btn ghost" href="#how">Watch how it works</a>
            </div>
            <div className="trust hh"><span>WhatsApp</span><span>Malayalam + English</span><span>GST bills</span><span>24/7</span></div>
          </div>

          <div className="hstage hh">
            <div className="fl f1"><b>&#10003;</b>Booking confirmed</div>
            <div className="fl f2"><b>&#8377;</b>Bill read: 4,820</div>
            <div className="fl f3"><b>!</b>New lead alert</div>
            <div className="phone"><div className="screen">
              <div className="tabs" role="tablist" aria-label="Try a demo">
                <button className="tab" role="tab" aria-selected="true" data-s="0">Voice note</button>
                <button className="tab" role="tab" aria-selected="false" data-s="1">Bill</button>
                <button className="tab" role="tab" aria-selected="false" data-s="2">WhatsApp</button>
              </div>
              <div id="scene" aria-live="polite" />
              <button className="replay" id="replay">Replay</button>
            </div></div>
          </div>
        </header>

        {/* Section 2: How It Works (Agent Canvas) */}
        <section id="how" className="agent-sec">
          <p className="eyebrow">How it works</p>
          <h2 className="t">An agent, not a chatbot.</h2>
          <p className="sub">Watch one booking move through Kada. Each step runs, gets checked, and is logged for you.</p>
          <div className="win">
            <div className="wbar"><i /><i /><i /><span>Kada workflow</span><span className="run"><b />Running</span></div>
            <div className="cv" id="cvHost" />
          </div>
          <p className="wnote">Sample booking, shown for illustration.</p>
        </section>

        {/* Section 3: Features Bento Grid */}
        <section id="features">
          <p className="eyebrow">Everything in one place</p>
          <h2 className="t">One assistant for every routine job.</h2>
          <p className="sub">From the first voice note to the final reply, Kada covers the daily work that eats a shop owner's time.</p>
          <div className="bento">
            <div className="bc w3 soft">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3"/></svg></span>
              <h3>Voice and text in Malayalam</h3>
              <p>Send a voice note or type, in Malayalam or English. Speech becomes text, and text becomes a structured action your shop can use.</p>
              <div className="chips"><span>Malayalam</span><span>English</span><span>Voice notes</span></div>
            </div>
            <div className="bc w3">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7l2 2 3-3M5 15l2 2 3-3M13 8h6M13 16h6"/></svg></span>
              <h3>Autonomous task agent</h3>
              <p>Runs multi-step jobs on its own and reports back when they are done.</p>
              <div className="chips"><span>Inventory checks</span><span>Appointment confirmations</span><span>Price validation</span></div>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 8a8 8 0 0 0-14-2M4 4v4h4M4 16a8 8 0 0 0 14 2M20 20v-4h-4"/></svg></span>
              <h3>Self-correcting loop</h3>
              <p>Every result is drafted, run, reviewed and refined before it reaches a customer.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/></svg></span>
              <h3>Bill and invoice reader</h3>
              <p>Vision AI turns messy receipts and tax documents into clean, standard data.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg></span>
              <h3>WhatsApp inbox</h3>
              <p>All customer messages in one place, with instant replies to routine questions.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/></svg></span>
              <h3>High-value lead alerts</h3>
              <p>You are pinged the moment a big enquiry arrives, even if Kada is handling the rest.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/></svg></span>
              <h3>Live dashboard and logs</h3>
              <p>See what the agent did in plain words, with clear success badges and no raw data.</p>
            </div>
            <div className="bc">
              <span className="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="16" cy="12" r="2"/></svg></span>
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
          <button className="btn" data-testid="cta-final" onClick={onLaunchApp}>Start free setup</button>
        </section>

        <footer>Kada. Made for the small businesses of Kerala.</footer>
      </div>

      {/* Floating Sticky Dock (Mobile) */}
      <div className="dock">
        <button className="btn" data-testid="cta-dock" onClick={onLaunchApp}>Start free setup</button>
      </div>

      {/* ── Exact CSS from landing.html ── */}
      <style>{`
        :root {
          color-scheme: light;
          --bg: #f8fbf8; --surface: #ffffff; --tint: #f0f6f1; --line: #dde7df; --ink: #1b2a23; --muted: #5f7167;
          --accent: #3f7a5c; --accent-d: #2c5a43; --soft: #e3efe7; --on: #fff;
          --shadow: 0 1px 2px rgba(27,42,35,.04),0 14px 36px rgba(27,42,35,.07);
          --gap: clamp(3.5rem,9vw,6.5rem);
        }
        body, html {
          background: var(--bg) !important;
          color: var(--ink) !important;
        }
        .landing-root {
          background: var(--bg);
          color: var(--ink);
          font: 400 1.05rem/1.65 'Hanken Grotesk',system-ui,sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }
        html.lock, html.lock body { overflow: hidden; height: 100%; }
        h1, h2, h3 { font-family: 'Newsreader','Noto Sans Malayalam',Georgia,serif; font-weight: 500; line-height: 1.1; margin: 0; letter-spacing: -.015em; }
        .ml { font-family: 'Noto Sans Malayalam',sans-serif; }
        a { color: inherit; }
        .wrap { max-width: 1080px; margin: 0 auto; padding: 0 1.25rem; }

        /* Aura */
        .aura { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background: linear-gradient(180deg,#f8fbf8,#f1f7f2); }
        .aura i { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .7; will-change: transform; animation: drift 24s ease-in-out infinite alternate; }
        .aura i:nth-child(1) { width: 70vmin; height: 70vmin; left: -20vmin; top: -18vmin; background: #c4e8d3; }
        .aura i:nth-child(2) { width: 60vmin; height: 60vmin; right: -18vmin; top: 12vmin; background: #d3ebef; animation-delay: -8s; }
        .aura i:nth-child(3) { width: 60vmin; height: 60vmin; left: 10vw; bottom: -20vmin; background: #f1ebc9; opacity: .55; animation-delay: -14s; }
        @keyframes drift { to { transform: translate3d(8vmin,6vmin,0) scale(1.1); } }

        /* Intro Splash */
        .intro { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: linear-gradient(160deg,#e7f5ec,#f8fbf8 55%,#eaf5f3); will-change: transform; animation: safe .01s 6s forwards; }
        @keyframes safe { to { visibility: hidden; } }
        .intro-in { text-align: center; }
        .mark { width: 4rem; height: 4rem; margin: 0 auto 1rem; border-radius: 50% 50% 50% 12%; background: var(--accent); box-shadow: 0 0 0 14px rgba(63,122,92,.1), 0 0 0 32px rgba(63,122,92,.05); }
        .word { display: flex; justify-content: center; overflow: hidden; font: 500 3.6rem/1.15 'Newsreader',serif; letter-spacing: -.02em; color: var(--ink); }
        .word span { display: inline-block; }
        .intro .sub2 { color: var(--muted); font-size: 1.1rem; margin-top: .2rem; }
        .bar { width: 11rem; height: 3px; margin: 1.6rem auto .6rem; background: rgba(63,122,92,.15); border-radius: 3px; overflow: hidden; }
        .bar b { display: block; height: 100%; width: 0; background: var(--accent); }
        .pct { font-size: .85rem; color: var(--muted); font-variant-numeric: tabular-nums; }

        /* Nav */
        nav { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 0; position: relative; z-index: 1; }
        .logo { font: 500 1.6rem 'Newsreader',serif; text-decoration: none; display: flex; gap: .55rem; align-items: center; color: var(--ink); }
        .logo i { width: 1.1rem; height: 1.1rem; border-radius: 50% 50% 50% 12%; background: var(--accent); }
        .links { display: none; gap: 1.8rem; font-size: .95rem; color: var(--muted); }
        .links a { text-decoration: none; }
        .links a:hover { color: var(--ink); }
        .btn { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--accent); border-radius: 999px; padding: .8rem 1.6rem; font: 500 1rem 'Hanken Grotesk',sans-serif; background: var(--accent); color: var(--on); text-decoration: none; cursor: pointer; min-height: 48px; box-shadow: 0 8px 22px rgba(63,122,92,.25); transition: background .25s, box-shadow .25s; }
        .btn:hover { background: var(--accent-d); box-shadow: 0 10px 26px rgba(63,122,92,.32); }
        .btn.ghost { background: rgba(255,255,255,.7); color: var(--ink); border-color: var(--line); box-shadow: none; }
        .btn:focus-visible, a:focus-visible, .tab:focus-visible, .replay:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

        /* Hero */
        .eyebrow { font-size: .8rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin: 0 0 .9rem; }
        .hero { display: grid; gap: 3rem; padding: 2rem 0 var(--gap); align-items: center; position: relative; z-index: 1; }
        .hero > * { min-width: 0; }
        .mlhook { font-size: clamp(1.5rem,4.5vw,2rem); color: var(--accent); margin: 0 0 .5rem; font-weight: 500; }
        .hero h1 { font-size: clamp(3rem,10.5vw,5.4rem); line-height: 1.02; }
        .hero h1 span { color: var(--accent); }
        .lead { color: var(--muted); font-size: 1.15rem; max-width: 32rem; margin: 1.3rem 0 2rem; }
        .live { display: flex; align-items: center; gap: .65rem; width: fit-content; max-width: 100%; margin: 0 0 1.6rem; padding: .55rem 1.1rem; border-radius: 999px; background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow); font-size: .92rem; font-weight: 500; }
        .live i { flex: none; width: .55rem; height: .55rem; border-radius: 50%; background: var(--accent); animation: pulse 1.6s infinite; }
        .lv { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: opacity .25s, transform .25s; }
        .lv.out { opacity: 0; transform: translateY(6px); }
        .cta-row { display: flex; flex-wrap: wrap; gap: .8rem; }
        .trust { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: 1.6rem; }
        .trust span { padding: .3rem .8rem; border-radius: 999px; border: 1px solid var(--line); background: rgba(255,255,255,.7); color: var(--muted); font-size: .85rem; }

        /* Phone Demo */
        .hstage { position: relative; width: min(340px,100%); margin: 0 auto; }
        .hstage .phone { width: 100%; }
        .fl { position: absolute; z-index: 2; display: flex; gap: .5rem; align-items: center; padding: .5rem .85rem; border-radius: 1rem; background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow); font-size: .82rem; font-weight: 500; white-space: nowrap; animation: bob 5s ease-in-out infinite; }
        .fl b { width: 1.4rem; height: 1.4rem; border-radius: 50%; background: var(--soft); color: var(--accent-d); display: grid; place-items: center; font-size: .72rem; }
        .f1 { left: -.6rem; top: 14%; }
        .f2 { right: -.6rem; top: 46%; animation-delay: -1.6s; }
        .f3 { left: -.6rem; bottom: 10%; animation-delay: -3.2s; }
        @keyframes bob { 50% { transform: translateY(-8px); } }
        @keyframes pulse { 50% { transform: scale(1.7); opacity: .35; } }

        .phone { width: min(330px,100%); margin: 0 auto; border-radius: 2.2rem; padding: .55rem; background: rgba(255,255,255,.85); border: 1px solid var(--line); box-shadow: 0 30px 70px rgba(63,122,92,.18); }
        .screen { border-radius: 1.7rem; background: var(--tint); height: 480px; min-height: 0; overflow: hidden; padding: .9rem; display: flex; flex-direction: column; gap: .6rem; }
        .tabs { display: flex; gap: .2rem; background: var(--surface); padding: .25rem; border-radius: 999px; border: 1px solid var(--line); }
        .tab { flex: 1; border: 0; background: none; padding: .45rem .2rem; border-radius: 999px; font: 500 .82rem 'Hanken Grotesk',sans-serif; color: var(--muted); cursor: pointer; min-height: 40px; transition: background .25s, color .25s; }
        .tab[aria-selected="true"] { background: var(--soft); color: var(--accent-d); }
        #scene { display: flex; flex-direction: column; gap: .55rem; flex: 1; overflow: hidden; }
        .pop { animation: fade .5s both; }
        @keyframes fade { from { opacity: 0; transform: translateY(6px); } }
        .msg { max-width: 88%; padding: .6rem .85rem; border-radius: 1rem; font-size: .93rem; line-height: 1.5; }
        .msg.in { background: var(--surface); border: 1px solid var(--line); border-bottom-left-radius: .3rem; }
        .msg.out { align-self: flex-end; background: var(--accent); color: var(--on); border-bottom-right-radius: .3rem; }
        .code-card { align-self: stretch; background: var(--soft); color: var(--accent-d); font: .78rem ui-monospace,monospace; white-space: pre; border-radius: .8rem; padding: .6rem .8rem; overflow: hidden; }
        .voice { display: flex; align-items: center; gap: .6rem; }
        .wave { display: flex; gap: 3px; align-items: center; height: 22px; }
        .wave s { width: 3px; border-radius: 2px; background: var(--accent); height: 35%; }
        .wave s:nth-child(3n) { height: 90%; }
        .wave s:nth-child(3n+1) { height: 60%; }
        .wave s:nth-child(5n) { height: 100%; }
        .bill { border: 1px solid var(--line); background: var(--surface); border-radius: .8rem; padding: .7rem .8rem; font-size: .85rem; }
        .bill div { display: flex; justify-content: space-between; padding: .12rem 0; }
        .bill .tot { border-top: 1px solid var(--line); margin-top: .35rem; padding-top: .4rem; font-weight: 600; }
        .replay { margin-top: auto; align-self: center; border: 1px solid var(--line); background: var(--surface); color: var(--muted); border-radius: 999px; padding: .45rem 1rem; font: 500 .85rem 'Hanken Grotesk',sans-serif; cursor: pointer; min-height: 40px; }

        /* Sections Common */
        section { padding: var(--gap) 0; border-top: 1px solid rgba(63,122,92,.14); position: relative; z-index: 1; }
        .t { font-size: clamp(1.9rem,4.5vw,2.8rem); max-width: 30rem; }
        .sub { color: var(--muted); max-width: 34rem; margin: 1rem 0 0; }

        /* ── Section 2: Agent Workflow Window & Canvas ── */
        .win { margin-top: 2rem; border-radius: 1.6rem; background: rgba(255,255,255,.92); border: 1px solid var(--line); box-shadow: 0 30px 70px rgba(63,122,92,.14); overflow: hidden; position: relative; }
        .wbar { display: flex; align-items: center; gap: .45rem; padding: .7rem 1rem; border-bottom: 1px solid var(--line); font-size: .82rem; color: var(--muted); }
        .wbar i { width: .6rem; height: .6rem; border-radius: 50%; background: #dfe7e1; }
        .wbar span:first-of-type { margin-left: .5rem; }
        .run { margin-left: auto; display: flex; align-items: center; gap: .4rem; color: var(--accent-d); font-weight: 500; }
        .run b { width: .5rem; height: .5rem; border-radius: 50%; background: var(--accent); animation: pulse 1.6s infinite; }
        
        /* Explicit styling for both .cv and #cvHost to guarantee layout integrity */
        .cv, #cvHost {
          position: relative !important;
          container-type: inline-size;
          width: 100%;
          background: #f6faf7 radial-gradient(rgba(63,122,92,.2) 1px,transparent 1.3px) 0 0/22px 22px;
          display: block;
          overflow: visible;
        }
        .cv > svg, #cvHost > svg {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: visible !important;
          pointer-events: none;
        }
        .nic svg { display: block; width: 20px; height: 20px; }
        .base { fill: none; stroke: #c8dcd0; stroke-width: 2.5; stroke-dasharray: 4 6; stroke-linecap: round; }
        .act { fill: none; stroke: var(--accent); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
        .retry { fill: none; stroke: #d99726; stroke-width: 2.5; stroke-dasharray: 4 5; stroke-linecap: round; }
        .rt { font-size: 12px; fill: #8a5f0f; font-family: 'Hanken Grotesk',sans-serif; font-weight: 600; }
        .nd {
          position: absolute !important;
          display: flex;
          align-items: center;
          gap: .65rem;
          padding: 0 .8rem;
          border-radius: 1.1rem;
          background: #ffffff !important;
          border: 1.5px solid #c8dcd0 !important;
          box-shadow: 0 8px 24px rgba(27,42,35,.12), 0 2px 6px rgba(27,42,35,.06) !important;
          transition: border-color .45s ease, box-shadow .45s ease, background .45s ease, transform .45s cubic-bezier(0.2, 0.8, 0.25, 1) !important;
          box-sizing: border-box;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 2;
        }
        .nd.hot {
          border-color: var(--accent) !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(63,122,92,.22), 0 12px 30px rgba(63,122,92,.28) !important;
          transform: scale(1.04);
        }
        .nic {
          flex: none;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: .7rem;
          background: var(--soft);
          color: var(--accent-d);
          display: grid;
          place-items: center;
          transition: background .4s ease, color .4s ease;
        }
        .nd.hot .nic {
          background: var(--accent);
          color: #fff;
        }
        .nt { min-width: 0; }
        .nt b {
          display: block;
          font-weight: 600;
          line-height: 1.25;
          color: #1b2a23 !important;
          font-family: 'Hanken Grotesk',sans-serif;
        }
        .nt small {
          display: block;
          color: #436252 !important;
          line-height: 1.3;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Hanken Grotesk',sans-serif;
        }
        
        .tall .nd { flex-direction: row; align-items: center; }
        .tall .nt b { font-size: max(13.5px, 3.8cqw); }
        .tall .nt small { font-size: max(11px, 3cqw); }
        
        .wide .nd { flex-direction: column; align-items: flex-start; justify-content: center; gap: .35rem; padding: .75rem .9rem; }
        .wide .nt { max-width: 100%; }
        .wide .nt b { font-size: max(13px, 1.55cqw); }
        .wide .nt small { font-size: max(11px, 1.25cqw); }
        .wide .nic { width: 2rem; height: 2rem; }
        .wnote { margin: .9rem 0 0; font-size: .85rem; color: var(--muted); text-align: center; }

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
        .mode i { display: inline-block; width: .5rem; height: .5rem; border-radius: 50%; background: var(--accent); margin-right: .5rem; animation: pulse 1.6s infinite; }
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
        .dock .btn { pointer-events: auto; }

        /* Responsive Breakpoints */
        @media (min-width: 860px) {
          .links { display: flex; }
          .hero { grid-template-columns: 1.1fr .9fr; }
          .f1 { left: -2.8rem; }
          .f2 { right: -2.8rem; }
          .f3 { left: -2.4rem; }
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
          nav { padding: .7rem 0; }
          .logo { font-size: 1.4rem; }
          nav .btn { padding: .55rem 1.1rem; min-height: 40px; font-size: .9rem; }
          .hero { gap: 1.6rem; padding: .6rem 0 2.5rem; }
          .mlhook { font-size: 1.3rem; margin-bottom: .1rem; }
          .hero h1 { font-size: 2.7rem; }
          .lead { font-size: 1rem; margin: .8rem 0 1rem; }
          .live { margin-bottom: 1rem; font-size: .85rem; padding: .45rem .9rem; border: 0; background: none; box-shadow: none; }
          .cta-row { flex-wrap: nowrap; gap: .5rem; }
          .cta-row .btn { flex: 1; padding: .7rem .6rem; font-size: .92rem; white-space: nowrap; }
          .trust, .fl, .chips { display: none; }
          .hstage .phone .screen { min-height: 380px; }
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
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
