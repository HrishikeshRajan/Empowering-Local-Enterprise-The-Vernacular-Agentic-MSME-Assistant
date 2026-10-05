import React, { useEffect, useMemo, useRef, useState } from 'react';

/* ── icons ── */
const P = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const ICONS: Record<string, React.ReactNode> = {
  mic:  P(<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />),
  txt:  P(<path d="M4 7h16M4 12h10M4 17h13" />),
  tgt:  P(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>),
  chk:  P(<path d="M5 7l2 2 3-3M5 15l2 2 3-3M13 8h6M13 16h6" />),
  loop: P(<path d="M20 8a8 8 0 0 0-14-2M4 4v4h4M4 16a8 8 0 0 0 14 2M20 20v-4h-4" />),
  chat: P(<path d="M4 5h16v11H9l-5 4z" />),
};

const STEPS = [
  { t: 'Voice note',      s: 'Malayalam, 0:07',       i: 'mic'  },
  { t: 'Speech to text',  s: 'Whisper',                i: 'txt'  },
  { t: 'Intent',          s: 'Booking, 2 guests',      i: 'tgt'  },
  { t: 'Do the task',     s: 'Slots, stock, price',    i: 'chk'  },
  { t: 'Review and fix',  s: 'Clash, moved to 10:30',  i: 'loop' },
  { t: 'Reply sent',      s: 'WhatsApp, owner told',   i: 'chat' },
];

type Layout = { w: number; h: number; nw: number; nh: number; pos: [number, number][]; ed: string[] };
const LAYOUT: Record<string, Layout> = {
  wide: { w: 1000, h: 520, nw: 160, nh: 92,  pos: [[95,260],[295,140],[495,260],[695,140],[695,390],[905,260]], ed: ['h','h','h','v','h'] },
  tall: { w: 360,  h: 650, nw: 200, nh: 78,  pos: [[110,60],[250,165],[110,270],[250,375],[110,480],[250,585]],  ed: ['v','v','v','v','v'] },
};

function edge(L: Layout, t: string, i: number): string {
  const a = L.pos[i], b = L.pos[i + 1];
  if (t === 'h') {
    const x1 = a[0] + L.nw / 2, y1 = a[1], x2 = b[0] - L.nw / 2, y2 = b[1], dx = (x2 - x1) / 2;
    return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
  }
  const x1 = a[0], y1 = a[1] + L.nh / 2, x2 = b[0], y2 = b[1] - L.nh / 2, dy = (y2 - y1) / 2;
  return `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
}

/* ── hooks ── */
function useMedia(q: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }: {
  as?: React.ElementType; className?: string; delay?: number; children: React.ReactNode; [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`aw-rise${on ? ' in' : ''} ${className}`} style={{ transitionDelay: delay + 'ms' }} {...rest}>
      {children}
    </Tag>
  );
}

/* ── main component ── */
export default function AgentWorkflow() {
  const wide   = useMedia('(min-width:900px)');
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  const L      = wide ? LAYOUT.wide : LAYOUT.tall;
  const paths  = useMemo(() => L.ed.map((t, i) => edge(L, t, i)), [L]);

  const hostRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<SVGGElement>(null);
  const baseRefs = useRef<(SVGPathElement | null)[]>([]);

  const [seen,   setSeen]   = useState(false);
  const [inView, setInView] = useState(false);
  const [ready,  setReady]  = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(-1);
  const clock = useRef(0);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, { threshold: 0.25 });
    io.observe(hostRef.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || reduce) return;
    const id = setTimeout(() => setReady(true), STEPS.length * 350 + 600);
    return () => clearTimeout(id);
  }, [seen, reduce]);

  useEffect(() => {
    if (!ready || !inView || paused || reduce) return;
    const n = STEPS.length, T = 1050, TRAVEL = 850, HOLD = 1100, TOTAL = (n - 1) * T + HOLD + 1200;
    const lens = baseRefs.current.map(p => p?.getTotalLength() ?? 0);
    const ease = (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    let raf: number, last = -2, t0 = performance.now() - clock.current;
    const tick = (now: number) => {
      const t = (now - t0) % TOTAL;
      clock.current = t;
      const i      = Math.min(n - 1, Math.floor(t / T));
      const within = t - i * T;
      const a      = t > (n - 1) * T + HOLD ? -1 : i;
      if (a !== last) { last = a; setActive(a); }
      const d = dotRef.current;
      if (d) {
        if (i < n - 1 && within < TRAVEL) {
          const base = baseRefs.current[i];
          if (base) {
            const q = base.getPointAtLength(ease(within / TRAVEL) * lens[i]);
            d.setAttribute('transform', `translate(${q.x} ${q.y})`);
            d.setAttribute('opacity', '1');
          }
        } else {
          d.setAttribute('opacity', '0');
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, inView, paused, reduce, L]);

  const playing = ready && inView && !paused && !reduce;

  return (
    <section id="how" className="aw-sec">
      <Reveal as="p"  className="aw-eyebrow">How it works</Reveal>
      <Reveal as="h2" className="aw-title" delay={80}>An agent, not a chatbot.</Reveal>
      <Reveal as="p"  className="aw-sub"   delay={160}>Watch one booking move through Kada. Each step runs, gets checked, and is logged for you.</Reveal>

      <Reveal className="aw-win" delay={200}>
        <div className="aw-bar">
          <i /><i /><i /><span className="aw-bt">Kada workflow</span>
          {!reduce && (
            <button className="aw-run" aria-pressed={paused} onClick={() => setPaused(p => !p)}
              aria-label={paused ? 'Play workflow animation' : 'Pause workflow animation'}>
              <b className={playing ? 'on' : ''} />
              {paused ? 'Paused' : 'Running'}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                {paused
                  ? <path d="M7 4.5v15l13-7.5z" />
                  : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          )}
        </div>

        <div ref={hostRef} className={`aw-cv ${wide ? 'wide' : 'tall'}${seen ? ' is-seen' : ''}`}
          style={{ aspectRatio: `${L.w} / ${L.h}` }}>
          <svg viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true">
            {paths.map((d, i) => (
              <path key={'b' + i} className="aw-base" d={d}
                ref={el => { baseRefs.current[i] = el; }} />
            ))}
            {paths.map((d, i) => (
              <path key={'a' + i} className="aw-act" pathLength="1" d={d}
                style={{ '--d': (i * 0.35 + 0.3) + 's' } as React.CSSProperties} />
            ))}
            {wide && <>
              <path className="aw-retry" d="M712,344 C760,300 760,230 712,186" />
              <text className="aw-rt" x="758" y="269">self-check</text>
            </>}
            <g ref={dotRef} opacity="0">
              <circle r="12" fill="#3f7a5c" opacity=".2" />
              <circle r="5"  fill="#3f7a5c" />
            </g>
          </svg>

          {STEPS.map((s, i) => {
            const p = L.pos[i];
            return (
              <div key={s.t} className={`aw-nd${active === i ? ' hot' : ''}`}
                style={{
                  left:   ((p[0] - L.nw / 2) / L.w) * 100 + '%',
                  top:    ((p[1] - L.nh / 2) / L.h) * 100 + '%',
                  width:  (L.nw / L.w) * 100 + '%',
                  height: (L.nh / L.h) * 100 + '%',
                  '--d':  (i * 0.35) + 's',
                } as React.CSSProperties}>
                <span className="aw-nic">{ICONS[s.i]}</span>
                <div className="aw-nt"><b>{s.t}</b><small>{s.s}</small></div>
              </div>
            );
          })}
        </div>
      </Reveal>
      <p className="aw-note">Sample booking, shown for illustration.</p>
    </section>
  );
}
