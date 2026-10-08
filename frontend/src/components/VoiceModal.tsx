import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { KadaSheet } from './ui';
import { MOCK_VOICE_PRESETS } from '../mockData';
import { processAgentCommand } from '../api/client';
import { 
  Mic, 
  Square, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  Sparkles,
  Zap,
  Volume2
} from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectCommand: (text: string, result?: any) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen, onClose, language, onSelectCommand,
}) => {
  const [phase, setPhase] = useState<'idle' | 'listening' | 'review' | 'executing'>('idle');
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [speechLang, setSpeechLang] = useState<'ml-IN' | 'en-IN'>(() => {
    try {
      const saved = localStorage.getItem('kada_voice_stt_lang');
      if (saved === 'en-IN' || saved === 'ml-IN') return saved;
    } catch {}
    return 'ml-IN'; // Default to Malayalam for local MSME operations
  });
  const [isDetectingVoice, setIsDetectingVoice] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isListeningActiveRef = useRef(false);
  const silenceRetryRef = useRef(0);
  const accumulatedRef = useRef('');

  // Switch voice language
  const handleSwitchLang = (lang: 'ml-IN' | 'en-IN') => {
    setSpeechLang(lang);
    try {
      localStorage.setItem('kada_voice_stt_lang', lang);
    } catch {}
    if (phase === 'listening') {
      stopListeningCleanup();
      setTimeout(() => startListening(lang), 150);
    }
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopListeningCleanup();
      setPhase('idle');
      setTranscript('');
      setErrorMsg(null);
      setExecutionResult(null);
      setIsDetectingVoice(false);
    }
  }, [isOpen]);

  const stopListeningCleanup = () => {
    isListeningActiveRef.current = false;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onspeechend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsDetectingVoice(false);
  };

  const startListening = (forcedLang?: 'ml-IN' | 'en-IN') => {
    stopListeningCleanup();
    const activeLang = forcedLang || speechLang;
    isListeningActiveRef.current = true;
    silenceRetryRef.current = 0;
    accumulatedRef.current = '';

    setPhase('listening');
    setTranscript('');
    setErrorMsg(null);
    setExecutionResult(null);
    setIsDetectingVoice(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = activeLang;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onspeechstart = () => {
          setIsDetectingVoice(true);
        };

        recognition.onspeechend = () => {
          setIsDetectingVoice(false);
        };

        recognition.onresult = (event: any) => {
          setIsDetectingVoice(true);
          let interim = '';
          let final = '';

          for (let i = 0; i < event.results.length; i++) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += piece + ' ';
            } else {
              interim += piece;
            }
          }

          const combined = (final + interim).trim();
          accumulatedRef.current = combined;
          setTranscript(combined);
        };

        recognition.onerror = (event: any) => {
          console.warn('[Speech Recognition] Error code:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            isListeningActiveRef.current = false;
            setErrorMsg(
              activeLang === 'ml-IN'
                ? 'മൈക്രോഫോൺ അനുമതി ലഭിച്ചില്ല. ബ്രൗസറിന്റെ URL ബാറിലെ ലോക്ക് (🔒) ഐക്കൺ ക്ലിക്ക് ചെയ്ത് Microphone "Allow" ചെയ്യുക.'
                : 'Microphone permission blocked. Click the lock icon (🔒) in your browser URL bar and set Microphone to "Allow".'
            );
            setPhase('idle');
            stopListeningCleanup();
          } else if (event.error === 'network') {
            isListeningActiveRef.current = false;
            setErrorMsg(
              activeLang === 'ml-IN'
                ? 'ഇന്റർനെറ്റ് കണക്ഷൻ പ്രശ്നം. താഴെയുള്ള സാമ്പിൾ ക്ലിക്ക് ചെയ്യുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യാം.'
                : 'Speech service network timeout. Please select a quick sample or type below.'
            );
          } else if (event.error === 'no-speech') {
            // Soft notice: allow auto-restart if still in listening state
          }
        };

        recognition.onend = () => {
          setIsDetectingVoice(false);

          if (!isListeningActiveRef.current) {
            // User intentionally stopped
            if (accumulatedRef.current && accumulatedRef.current.trim().length > 0) {
              setPhase('review');
            }
            return;
          }

          // If the user already spoke and Chrome auto-stopped after pause:
          if (accumulatedRef.current && accumulatedRef.current.trim().length > 0) {
            isListeningActiveRef.current = false;
            setPhase('review');
            return;
          }

          // Chrome closed due to brief initial silence: keep listening up to 4 retries
          if (silenceRetryRef.current < 4) {
            silenceRetryRef.current += 1;
            try {
              recognition.start();
            } catch {
              // Ignore if already starting
            }
          } else {
            isListeningActiveRef.current = false;
            setPhase('review');
            setErrorMsg(
              activeLang === 'ml-IN'
                ? 'ശബ്ദം വ്യക്തമായി കേട്ടില്ല. താഴെയുള്ള സാമ്പിൾ തിരഞ്ഞെടുക്കുകയോ വീണ്ടും പറയുകയോ ചെയ്യാം.'
                : 'No speech detected. Speak closer to the mic or click a sample below.'
            );
          }
        };

        recognitionRef.current = recognition;
        recognition.start();

        // Safety timeout: auto-stop after 16 seconds
        timers.current.push(
          setTimeout(() => {
            if (isListeningActiveRef.current) {
              handleStopListening();
            }
          }, 16000)
        );

        return;
      } catch (err: any) {
        console.warn('[Speech Recognition] Initialization failed, using fallback:', err);
      }
    }

    // Fallback simulation for unsupported browsers
    const sample = MOCK_VOICE_PRESETS[0];
    timers.current.push(
      setTimeout(() => {
        setTranscript(activeLang === 'ml-IN' ? sample.malayalamAudioText : sample.englishTranslation);
        setPhase('review');
      }, 1500)
    );
  };

  const handleStopListening = () => {
    isListeningActiveRef.current = false;
    stopListeningCleanup();
    setPhase('review');
    if (!transcript.trim()) {
      const preset = MOCK_VOICE_PRESETS[0];
      setTranscript(speechLang === 'ml-IN' ? preset.malayalamAudioText : preset.englishTranslation);
    }
  };

  const handleSelectPreset = (preset: typeof MOCK_VOICE_PRESETS[0]) => {
    stopListeningCleanup();
    setTranscript(speechLang === 'ml-IN' ? preset.malayalamAudioText : preset.englishTranslation);
    setErrorMsg(null);
    setPhase('review');
  };

  const handleExecute = async () => {
    if (!transcript.trim() || phase === 'executing') return;
    setPhase('executing');
    setErrorMsg(null);

    try {
      const res = await processAgentCommand({
        inputPrompt: transcript,
        inputPromptMl: transcript,
        inputType: 'voice',
        language: speechLang === 'ml-IN' ? 'ml' : 'en'
      });

      if (res?.taskLog) {
        const isFlagged = res.taskLog.status === 'FLAGGED' || res.taskLog.needsHumanReview;
        const summary = speechLang === 'ml-IN'
          ? (res.taskLog.outputSummaryMl || res.taskLog.outputSummary)
          : res.taskLog.outputSummary;

        if (isFlagged && res.taskLog.reviewReason) {
          setErrorMsg(res.taskLog.reviewReason);
          setExecutionResult(summary);
          setPhase('review');
          onSelectCommand(transcript, res);
          return;
        }

        setExecutionResult(summary);

        setTimeout(() => {
          onSelectCommand(transcript, res);
          onClose();
        }, 1400);
        return;
      }
    } catch (err: any) {
      console.warn('[VoiceModal] Execution notice:', err);
      setErrorMsg(err.message || 'Execution error. Check connection.');
      setPhase('review');
      return;
    }

    onSelectCommand(transcript);
    onClose();
  };

  const title = phase === 'listening'
    ? (speechLang === 'ml-IN' ? 'മലയാളം ശബ്ദം ശ്രദ്ധിക്കുന്നു… (സംസാരിക്കൂ)' : 'Listening… (Speak now)')
    : phase === 'review'
    ? (speechLang === 'ml-IN' ? 'ശബ്ദ നിർദ്ദേശം പരിശോധിക്കുക' : 'Review Voice Command')
    : phase === 'executing'
    ? (speechLang === 'ml-IN' ? 'റഫ്ലെക്ഷൻ ലൂപ്പ് പ്രവർത്തിക്കുന്നു…' : 'Executing Reflection Loop…')
    : (speechLang === 'ml-IN' ? 'മലയാളം ശബ്ദ സഹായി (Kada Voice)' : 'Voice Operations Assistant');

  return (
    <KadaSheet open={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Dedicated Voice Language Switcher Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '12px',
          background: 'var(--tint)',
          border: '1px solid var(--line)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--accent)" />
            <span>{speechLang === 'ml-IN' ? 'ശബ്ദ ഭാഷ:' : 'Mic Language:'}</span>
          </span>

          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface)', padding: '2px', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <button
              onClick={() => handleSwitchLang('ml-IN')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: speechLang === 'ml-IN' ? 'var(--accent)' : 'transparent',
                color: speechLang === 'ml-IN' ? '#fff' : 'var(--muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🇮🇳 മലയാളം (ml-IN)
            </button>
            <button
              onClick={() => handleSwitchLang('en-IN')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: speechLang === 'en-IN' ? 'var(--accent)' : 'transparent',
                color: speechLang === 'en-IN' ? '#fff' : 'var(--muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🇬🇧 English / Manglish
            </button>
          </div>
        </div>

        {/* Error notification banner if mic permission is missing */}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#b91c1c',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── PHASE 1: IDLE ── */}
        {phase === 'idle' && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ display: 'inline-block', position: 'relative', marginBottom: '14px' }}>
              <button
                onClick={() => startListening()}
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(63, 122, 92, 0.35)',
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                aria-label="Tap to speak"
              >
                <Mic size={38} />
              </button>
            </div>

            <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '1.05rem', margin: '4px 0' }}>
              {speechLang === 'ml-IN' ? 'ടാപ്പ് ചെയ്ത് മലയാളത്തിൽ പറയൂ' : 'Tap to Speak Command'}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
              {speechLang === 'ml-IN' 
                ? 'ഉദാ: "തക്കാളി 15 കിലോ കൂടി സ്റ്റോക്കിൽ ചേർക്കൂ, വില 40 രൂപ"'
                : 'e.g. "Add 15 kg tomato to stock at 40 rupees"'}
            </p>
          </div>
        )}

        {/* ── PHASE 2: LISTENING ── */}
        {phase === 'listening' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            {/* Pulsing visual recording indicator */}
            <div style={{ display: 'inline-block', position: 'relative', marginBottom: '12px' }}>
              <div style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '50%',
                background: isDetectingVoice ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.25)',
                animation: 'pulse 1.2s infinite'
              }} />
              <button
                onClick={handleStopListening}
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: isDetectingVoice ? '#16a34a' : '#dc2626',
                  color: '#fff',
                  border: 'none',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 8px 24px rgba(220, 38, 38, 0.35)',
                  transition: 'background 0.2s ease'
                }}
                aria-label="Stop recording"
              >
                <Square size={28} fill="#fff" />
              </button>
            </div>

            {/* Sound Wave Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '20px', marginBottom: '6px' }}>
              {[12, 22, 16, 26, 14, 20, 10].map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '3px',
                    height: isDetectingVoice ? `${h}px` : '4px',
                    borderRadius: '2px',
                    background: isDetectingVoice ? 'var(--accent)' : 'var(--line)',
                    transition: 'height 0.15s ease'
                  }}
                />
              ))}
            </div>

            <p style={{ fontWeight: 700, color: isDetectingVoice ? 'var(--accent-d)' : '#dc2626', fontSize: '0.95rem', margin: '4px 0' }}>
              {isDetectingVoice
                ? (speechLang === 'ml-IN' ? '🟢 ശബ്ദം ലഭിക്കുന്നു…' : '🟢 Voice detected…')
                : (speechLang === 'ml-IN' ? '🔴 മലയാളം ശ്രദ്ധിക്കുന്നു… (സംസാരിക്കൂ)' : '🔴 Listening… (Speak clearly)')}
            </p>

            {/* Live speech preview box */}
            <div style={{
              margin: '12px auto 0',
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'var(--tint)',
              border: isDetectingVoice ? '2px solid var(--accent)' : '1px solid var(--line)',
              minHeight: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink)',
              fontSize: '1.02rem',
              fontWeight: 600,
              textAlign: 'center',
              transition: 'border 0.2s ease'
            }}>
              {transcript || (
                <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  {speechLang === 'ml-IN' ? 'നിങ്ങൾ സംസാരിക്കുന്നത് ഇവിടെ കാണാം…' : 'Say your command…'}
                </span>
              )}
            </div>

            <button
              onClick={handleStopListening}
              className="btn-primary"
              style={{ marginTop: '16px', width: '100%', padding: '12px' }}
            >
              <CheckCircle2 size={16} />
              <span>{speechLang === 'ml-IN' ? 'സംസാരം പൂർത്തിയായി (Done Speaking)' : 'Done Speaking — Proceed'}</span>
            </button>
          </div>
        )}

        {/* ── PHASE 3 & 4: REVIEW & EXECUTION ── */}
        {(phase === 'review' || phase === 'executing') && (
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              {speechLang === 'ml-IN' ? 'തിരിച്ചറിഞ്ഞ ശബ്ദ നിർദ്ദേശം (തിരുത്താം)' : 'Recognized Voice Command (Editable)'}
            </label>

            {/* Editable textarea so merchant can tweak words or numbers */}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={phase === 'executing'}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: '1rem',
                lineHeight: 1.5,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="e.g. Add 15 kg tomato at ₹40"
            />

            {/* Success execution badge */}
            {executionResult && (
              <div style={{
                marginTop: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#065f46',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>{executionResult}</span>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                onClick={handleExecute}
                disabled={phase === 'executing' || !transcript.trim()}
                className="btn-primary"
                style={{ flex: 2, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {phase === 'executing' ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>{speechLang === 'ml-IN' ? 'നടപ്പിലാക്കുന്നു…' : 'Executing…'}</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>{speechLang === 'ml-IN' ? 'സ്റ്റോക്കിൽ ചേർക്കൂ' : 'Execute & Update Stock'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => startListening()}
                disabled={phase === 'executing'}
                className="btn-ghost"
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                title="Speak again"
              >
                <RotateCcw size={15} />
                <span>{speechLang === 'ml-IN' ? 'വീണ്ടും പറയൂ' : 'Retry'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── QUICK PRESETS LIST ── */}
        {phase !== 'listening' && phase !== 'executing' && (
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              ⚡ {speechLang === 'ml-IN' ? 'സാമ്പിൾ ശബ്ദങ്ങൾ (1-ക്ലിക്ക് പരീക്ഷിക്കാം)' : 'Quick Test Voice Samples (1-Click)'}
            </span>

            <div style={{ display: 'grid', gap: '8px' }}>
              {MOCK_VOICE_PRESETS.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="glass-panel-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--tint)',
                    border: '1px solid var(--line)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)' }}>
                      {speechLang === 'ml-IN' ? p.malayalamAudioText : p.englishTranslation}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                      {p.category}
                    </span>
                  </div>
                  <Play size={14} color="var(--accent-d)" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </KadaSheet>
  );
};
