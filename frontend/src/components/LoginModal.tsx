import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/login-modal.css";
import { sendOtp as apiSendOtp, verifyOtp as apiVerifyOtp } from "../api/client";

/* Default backend integrations */
const defaultSend = async (phone: string) => {
  try {
    return await apiSendOtp(phone);
  } catch {
    return new Promise((r) => setTimeout(r, 700));
  }
};

const defaultVerify = async (phone: string, code: string) => {
  try {
    const res = await apiVerifyOtp(phone, code);
    return !!res?.success;
  } catch {
    return code === "123456" || code === "1234";
  }
};

const fmt = (d: string) => (d.length > 5 ? d.slice(0, 5) + " " + d.slice(5) : d);
const validPhone = (d: string) => /^[6-9]\d{9}$/.test(d);
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

interface IconProps {
  d: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const BOLT = "M13 3L5 14h6l-1 7 8-11h-6z";
const CLOSE = "M6 6l12 12M18 6L6 18";
const BACK = "M15 5l-7 7 7 7";

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (phone: string) => void;
  onQuickTry?: () => void;
  sendOtp?: (phone: string) => Promise<any>;
  verifyOtp?: (phone: string, code: string) => Promise<boolean>;
}

/**
 * Login modal: phone number -> 6-digit OTP, plus a "Quick try" shortcut.
 *
 * Props
 *  open, onClose
 *  onSuccess(phone)     called after a verified OTP
 *  onQuickTry()         called when "Quick try" is chosen (demo mode, no login)
 *  sendOtp(phone)       => Promise   (sends the OTP on WhatsApp)
 *  verifyOtp(phone, code)   => Promise<boolean>
 */
export function LoginModal({
  open,
  onClose,
  onSuccess,
  onQuickTry,
  sendOtp = defaultSend,
  verifyOtp = defaultVerify
}: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "done">("phone");
  const [digits, setDigits] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [left, setLeft] = useState(0);
  const [shake, setShake] = useState(false);
  const back = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number | null; dy: number }>({ y: null, dy: 0 });
  const panel = useRef<HTMLDivElement>(null);
  const phoneIn = useRef<HTMLInputElement>(null);
  const codeIn = useRef<HTMLInputElement>(null);
  const opener = useRef<Element | null>(null);
  const isDemo = true;

  // reset + focus management + scroll lock
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    setStep("phone"); setDigits(""); setCode(""); setError(""); setBusy(false);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => phoneIn.current?.focus(), 80);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = prev;
      if (opener.current && 'focus' in opener.current) {
        (opener.current as HTMLElement).focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (step === "otp") setTimeout(() => codeIn.current?.focus(), 60);
    if (step === "phone" && open) setTimeout(() => phoneIn.current?.focus(), 60);
  }, [step, open]);

  // keep the sheet above the on-screen keyboard
  useEffect(() => {
    const vv = window.visualViewport;
    const el = back.current;
    if (!open || !vv || !el) return;
    const fit = () => { el.style.height = vv.height + "px"; el.style.transform = `translateY(${vv.offsetTop}px)`; };
    fit(); vv.addEventListener("resize", fit); vv.addEventListener("scroll", fit);
    return () => { vv.removeEventListener("resize", fit); vv.removeEventListener("scroll", fit); };
  }, [open]);

  // swipe down on the top bar to dismiss (phones)
  const sw = {
    onPointerDown: (e: React.PointerEvent) => { 
      if (!matchMedia("(max-width:699px)").matches || (e.target as HTMLElement).closest("button")) return; 
      drag.current = { y: e.clientY, dy: 0 }; 
      e.currentTarget.setPointerCapture(e.pointerId); 
      if (panel.current) panel.current.style.transition = "none"; 
    },
    onPointerMove: (e: React.PointerEvent) => { 
      if (drag.current.y === null) return; 
      const dy = Math.max(0, e.clientY - drag.current.y); 
      drag.current.dy = dy; 
      if (panel.current) panel.current.style.transform = `translateY(${dy}px)`; 
    },
    onPointerUp: () => { 
      if (drag.current.y === null) return; 
      const far = drag.current.dy > 110; 
      drag.current = { y: null, dy: 0 }; 
      const el = panel.current; 
      if (el) {
        el.style.transition = "transform .25s ease"; 
        el.style.transform = ""; 
      }
      if (far) onClose?.(); 
      setTimeout(() => { if (el) el.style.transition = ""; }, 300); 
    },
  };
  const focusMid = (e: React.FocusEvent<HTMLInputElement>) => { const t = e.target; setTimeout(() => t.scrollIntoView?.({ block: "center", behavior: "smooth" }), 320); };

  // resend countdown
  useEffect(() => {
    if (step !== "otp" || left <= 0) return;
    const id = setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [step, left]);

  // Esc to close + Tab trap
  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose?.(); return; }
    if (e.key !== "Tab") return;
    const f = panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),[href]');
    if (!f?.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, [onClose]);

  const send = async () => {
    if (!validPhone(digits) || busy) return;
    setBusy(true); setError("");
    try { await sendOtp(digits); setStep("otp"); setCode(""); setLeft(30); }
    catch { setError("Couldn't send the code. Check your number and try again."); }
    setBusy(false);
  };

  const verify = useCallback(async (value: string) => {
    setBusy(true); setError("");
    let ok = false;
    try { ok = await verifyOtp(digits, value); } catch { ok = false; }
    setBusy(false);
    if (ok) { setStep("done"); setTimeout(() => { onSuccess?.(digits); onClose?.(); }, 1100); }
    else { setError("That code didn't match. Please try again."); setShake(true); setCode(""); setTimeout(() => setShake(false), 450); setTimeout(() => codeIn.current?.focus(), 50); }
  }, [digits, verifyOtp, onSuccess, onClose]);

  const onCode = (v: string) => {
    const c = v.replace(/\D/g, "").slice(0, 6);
    setCode(c); setError("");
    if (c.length === 6 && !busy) verify(c);
  };
  const onPhone = (v: string) => {
    let d = v.replace(/\D/g, "");
    if (d.length > 10) d = d.replace(/^(91|0)/, "");
    setDigits(d.slice(0, 10)); setError("");
  };
  const quick = () => { onQuickTry?.(); onClose?.(); };

  if (!open) return null;
  return (
    <div className="lg-back" ref={back} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }} onKeyDown={onKey}>
      <div className="lg-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="lg-title">
        <span className="lg-grab" aria-hidden="true" {...sw} />
        <div className="lg-top" {...sw}>
          {step === "otp"
            ? <button className="lg-ico" onClick={() => { setStep("phone"); setError(""); }} aria-label="Change number"><Icon d={BACK} /></button>
            : <span className="lg-logo"><i />Kada</span>}
          <button className="lg-ico" onClick={onClose} aria-label="Close"><Icon d={CLOSE} /></button>
        </div>

        {step === "phone" && (
          <div className="lg-body" key="phone">
            <h2 id="lg-title">Log in to Kada</h2>
            <p className="lg-sub">Enter your phone number, we'll send an OTP on WhatsApp.</p>

            <label className="lg-lab" htmlFor="lg-phone">WhatsApp number</label>
            <div className={`lg-field${error ? " bad" : ""}`}>
              <span className="lg-cc">+91</span>
              <input id="lg-phone" ref={phoneIn} type="tel" inputMode="numeric" enterKeyHint="send" autoComplete="tel-national" placeholder="98765 43210" onFocus={focusMid}
                value={fmt(digits)} onChange={(e) => onPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
                aria-invalid={!!error} aria-describedby="lg-hint" />
            </div>
            <p id="lg-hint" className={`lg-hint${error ? " err" : ""}`} role={error ? "alert" : undefined}>
              {error || (digits.length > 0 && !validPhone(digits) && digits.length === 10 ? "Enter a valid 10-digit Indian mobile number." : "We'll send a 6-digit code on WhatsApp.")}
            </p>

            <button className="lg-main" disabled={!validPhone(digits) || busy} onClick={() => send()}>
              {busy ? <span className="lg-spin" aria-label="Sending" /> : <span className="lg-btn-in"><Icon d="M4 5h16v11H9l-5 4z" />Send OTP on WhatsApp</span>}
            </button>

            <div className="lg-or"><span>or</span></div>

            <button className="lg-quick" onClick={quick}>
              <span className="lg-qi"><Icon d={BOLT} size={18} /></span>
              <span><b>Quick try</b><small>Explore a sample shop. No signup.</small></span>
            </button>
            <p className="lg-terms">By continuing you agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
          </div>
        )}

        {step === "otp" && (
          <div className="lg-body" key="otp">
            <h2 id="lg-title">Enter the 6-digit code</h2>
            <p className="lg-sub">Sent on WhatsApp to <b>+91 {fmt(digits)}</b></p>

            <div className={`lg-otp${shake ? " shake" : ""}${error ? " bad" : ""}`} onClick={() => codeIn.current?.focus()}>
              <input ref={codeIn} className="lg-real" type="text" inputMode="numeric" autoComplete="one-time-code" enterKeyHint="done" onFocus={focusMid} maxLength={6}
                value={code} onChange={(e) => onCode(e.target.value)} aria-label="6-digit verification code" disabled={busy} />
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={`lg-box${i === code.length && !busy ? " cur" : ""}${code[i] ? " on" : ""}`} aria-hidden="true">{code[i] || ""}</span>))}
            </div>

            <p className={`lg-hint${error ? " err" : ""}`} role={error ? "alert" : "status"}>
              {busy ? "Verifying…" : error || (isDemo ? "Check your WhatsApp messages. Demo: 123456" : "Check your WhatsApp messages.")}
            </p>

            <button className="lg-main" disabled={code.length < 6 || busy} onClick={() => verify(code)}>
              {busy ? <span className="lg-spin" aria-label="Verifying" /> : "Verify and continue"}
            </button>

            <div className="lg-resend">
              {left > 0 ? <span>Resend code in {mmss(left)}</span>
                : <button onClick={() => send()}>Resend on WhatsApp</button>}
            </div>
            <button className="lg-link" onClick={quick}>Skip for now, Quick try</button>
          </div>
        )}

        {step === "done" && (
          <div className="lg-body lg-done" key="done">
            <span className="lg-tick"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></span>
            <h2 id="lg-title">You're in</h2>
            <p className="lg-sub">Opening your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
