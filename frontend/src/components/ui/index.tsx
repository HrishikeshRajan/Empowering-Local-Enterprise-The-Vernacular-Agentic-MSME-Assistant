/**
 * Kada UI primitives
 * Mirrors the Kada app HTML design system. Import what you need per page.
 * All components use the design tokens from index.css (:root) and
 * the layout/component styles from styles/dashboard.css.
 */

import React, { useEffect } from 'react';

// ─── SVG icon sprite ─────────────────────────────────────────────────────────

/** Render once, high up in the tree (App.tsx). Defines all reusable SVG icons. */
export function KadaIconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9H4zM10 20v-6h4v6" /></symbol>
        <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" /></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" /></symbol>
        <symbol id="i-pulse" viewBox="0 0 24 24"><path d="M3 12h4l3-7 4 14 3-7h4" /></symbol>
        <symbol id="i-mic" viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" /></symbol>
        <symbol id="i-cam" viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" /></symbol>
        <symbol id="i-rocket" viewBox="0 0 24 24"><path d="M12 3c4 2 6 6 5 11l-5 4-5-4c-1-5 1-9 5-11zM9 18l-2 3M15 18l2 3" /></symbol>
        <symbol id="i-box" viewBox="0 0 24 24"><path d="M3 9l9-6 9 6v12l-9 3-9-3V9zM3 9l9 6 9-6M12 15v6" /></symbol>
        <symbol id="i-cal" viewBox="0 0 24 24"><path d="M4 6h16v14H4zM8 3v3M16 3v3M4 11h16" /></symbol>
        <symbol id="i-cog" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.4.8A7 7 0 0 0 14 5.3L13.5 3h-3l-.5 2.3a7 7 0 0 0-2.5 1.2l-2.4-.8-2 3.5 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-.8a7 7 0 0 0 2.5 1.2L10.5 21h3l.5-2.3a7 7 0 0 0 2.5-1.2l2.4.8 2-3.5-2-1.6c.1-.4.1-.8.1-1.2z" /></symbol>
        <symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></symbol>
        <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 4l-8.3 14h19.9l-8.3-14a2 2 0 0 0-3.3 0z" /></symbol>
        <symbol id="i-set"   viewBox="0 0 24 24"><path d="M4 7h9m4 0h3M4 17h3m4 0h9M15 5v4M9 15v4" /></symbol>
        <symbol id="i-plus"  viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
      </defs>
    </svg>
  );
}

/** Render a single icon from the sprite. `id` is the symbol id without `#`. */
export function KadaIcon({ id, className = 'i', style }: { id: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

// ─── Page header ─────────────────────────────────────────────────────────────

interface KadaPageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}
export function KadaPageHeader({ eyebrow, title, subtitle }: KadaPageHeaderProps) {
  return (
    <div className="hd">
      {eyebrow && <small>{eyebrow}</small>}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface KadaCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}
export function KadaCard({ children, className = '', style, onClick }: KadaCardProps) {
  return (
    <div className={`card ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

// ─── Stat tiles ───────────────────────────────────────────────────────────────

export function KadaTiles({ children }: { children: React.ReactNode }) {
  return <div className="tiles">{children}</div>;
}

interface KadaTileProps {
  value: React.ReactNode;
  label: string;
  warn?: boolean;
}
export function KadaTile({ value, label, warn }: KadaTileProps) {
  return (
    <div className={`tile${warn ? ' w' : ''}`}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────

interface KadaRowProps {
  dot?: React.ReactNode;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  warn?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  href?: string;
}
export function KadaRow({ dot, title, sub, right, warn: _warn, clickable, onClick, href }: KadaRowProps) {
  const inner = (
    <>
      {dot && dot}
      <span className="t"><b>{title}</b>{sub && <small>{sub}</small>}</span>
      {right}
    </>
  );
  if (href) return <a className="row c" href={href}>{inner}</a>;
  return <div className={`row${clickable ? ' c' : ''}`} onClick={onClick}>{inner}</div>;
}

// ─── Dot ─────────────────────────────────────────────────────────────────────

interface KadaDotProps {
  children: React.ReactNode;
  warn?: boolean;
}
export function KadaDot({ children, warn }: KadaDotProps) {
  return <span className={`dot${warn ? ' w' : ''}`}>{children}</span>;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

interface KadaBadgeProps {
  children: React.ReactNode;
  warn?: boolean;
}
export function KadaBadge({ children, warn }: KadaBadgeProps) {
  return <span className={`bd${warn ? ' w' : ''}`}>{children}</span>;
}

// ─── Button ───────────────────────────────────────────────────────────────────

interface KadaButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ghost?: boolean;
  small?: boolean;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
  className?: string;
  'data-testid'?: string;
  disabled?: boolean;
}
export function KadaButton({ children, onClick, ghost, small, type = 'button', style, className = '', disabled, ...rest }: KadaButtonProps) {
  return (
    <button
      type={type}
      className={`btn${ghost ? ' g' : ''}${small ? ' s' : ''} ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

// ─── Segmented control ────────────────────────────────────────────────────────

interface KadaSegmentProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}
export function KadaSegment<T extends string>({ options, value, onChange }: KadaSegmentProps<T>) {
  return (
    <div className="seg">
      {options.map(o => (
        <button
          key={o.value}
          className={value === o.value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

interface KadaSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}
export function KadaSwitch({ checked, onChange, label, title, subtitle }: KadaSwitchProps) {
  return (
    <div className="card mode">
      {(title || subtitle) && (
        <div className="t">
          {title && <b>{checked && <span className="live" />}{title}</b>}
          {subtitle && <small>{subtitle}</small>}
        </div>
      )}
      <button
        className="sw"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? 'Toggle'}
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

// ─── Voice / bottom sheet ─────────────────────────────────────────────────────

interface KadaSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
export function KadaSheet({ open, onClose, title, children }: KadaSheetProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className={`ksheet-ov${open ? ' on' : ''}`} onClick={onClose} />
      <div className={`ksheet${open ? ' on' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </>
  );
}

// ─── Two-column grid ──────────────────────────────────────────────────────────

export function KadaTwo({ children }: { children: React.ReactNode }) {
  return <div className="two">{children}</div>;
}

// ─── Progress bar + steps ─────────────────────────────────────────────────────

interface KadaProgressProps {
  step: number;
  total: number;
}
export function KadaProgress({ step, total }: KadaProgressProps) {
  return (
    <>
      <div className="kbar"><b style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
      <div className="ksteps">
        {Array.from({ length: total }, (_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}
      </div>
    </>
  );
}
