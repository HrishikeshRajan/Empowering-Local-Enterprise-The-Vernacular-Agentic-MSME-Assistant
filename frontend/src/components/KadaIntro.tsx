import { useEffect, useRef, useState } from 'react';

interface KadaIntroProps {
  navSelector?: string;
  onHero?: () => void;
  onDone?: () => void;
}

export function KadaIntro({ navSelector = '.logo', onHero, onDone }: KadaIntroProps) {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = (s: string) => el.querySelector<HTMLElement>(s);
    const lock = q('.ki-lock'), mk = q('.ki-mk'), wd = q('.ki-wd'), tag = q('.ki-tag'), bg = q('.ki-bg');
    if (!lock || !mk || !wd || !tag || !bg) return;
    const nav = document.querySelector<HTMLElement>(navSelector);
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const anims: Animation[] = [];
    let dead = false, heroed = false;
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    const run = (node: HTMLElement, kf: Keyframe[], opt: KeyframeAnimationOptions) => {
      const a = node.animate(kf, { fill: 'both', ...opt });
      anims.push(a);
      return a;
    };
    const hero = () => { if (!heroed) { heroed = true; onHero?.(); } };
    const restore = () => { if (nav) nav.style.visibility = ''; html.classList.remove('kada-lock'); };
    const finish = () => { if (dead) return; dead = true; restore(); hero(); setGone(true); onDone?.(); };

    html.classList.add('kada-lock');
    if (reduce) { finish(); return; }
    if (nav) nav.style.visibility = 'hidden';
    later(finish, 6000);

    const fly = () => {
      if (dead || !nav) return finish();
      const a = lock.getBoundingClientRect(), b = nav.getBoundingClientRect();
      if (!a.width || !b.width) return finish();
      const s = b.width / a.width;
      const f = run(lock, [
        { transform: 'translate(0,0) scale(1)' },
        { transform: `translate(${b.left - a.left}px,${b.top - a.top}px) scale(${s})` },
      ], { duration: 850, easing: 'cubic-bezier(.76,0,.24,1)' });
      run(tag, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-in' });
      run(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 260, easing: 'ease-in-out' });
      later(hero, 380);
      f.finished.then(finish).catch(() => {});
    };

    const start = () => {
      if (dead) return;
      wd.style.maxWidth = 'none'; wd.style.opacity = '1';
      const W = wd.getBoundingClientRect().width;
      wd.style.maxWidth = ''; wd.style.opacity = '';
      const a1 = run(mk, [
        { transform: 'scale(0) rotate(-120deg)', borderRadius: '50%' },
        { transform: 'scale(1) rotate(0deg)', borderRadius: '50% 50% 50% 12%' },
      ], { duration: 650, easing: 'cubic-bezier(.34,1.4,.64,1)' });
      const a2 = run(wd, [
        { maxWidth: '0px', marginLeft: '0em', opacity: 0 },
        { maxWidth: W + 'px', marginLeft: '.34375em', opacity: 1 },
      ], { duration: 650, delay: 380, easing: 'cubic-bezier(.65,0,.35,1)' });
      const a3 = run(tag, [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 450, delay: 750, easing: 'cubic-bezier(.22,1,.36,1)' });
      Promise.all([a1.finished, a2.finished, a3.finished]).then(() => later(fly, 320)).catch(() => {});
    };

    const fonts = (document as any).fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise<void>((r) => setTimeout(r, 700))]).then(start);

    return () => {
      dead = true;
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      restore();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navSelector]);

  if (gone) return null;
  return (
    <div ref={root} className="ki" aria-hidden="true">
      <div className="ki-bg" />
      <div className="ki-lw">
        <div className="ki-lock"><i className="ki-mk" /><span className="ki-wd">Kada</span></div>
        <div className="ki-tag">കട</div>
      </div>
    </div>
  );
}

export default KadaIntro;
