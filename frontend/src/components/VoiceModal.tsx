import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { KadaSheet } from './ui';
import { MOCK_VOICE_PRESETS } from '../mockData';
import { processAgentCommand, transcribeVoiceNote } from '../api/client';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { 
  Mic, 
  Square, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  Sparkles,
  Zap,
  Volume2,
  Loader2
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
  
  // Sarvam AI STT metadata
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [detectedEngine, setDetectedEngine] = useState<string | null>(null);
  const [detectedLangCode, setDetectedLangCode] = useState<string | null>(null);
  const [transcriptionConfidence, setTranscriptionConfidence] = useState<number | null>(null);

  const recorder = useAudioRecorder();

  // Switch voice language
  const handleSwitchLang = (lang: 'ml-IN' | 'en-IN') => {
    setSpeechLang(lang);
    try {
      localStorage.setItem('kada_voice_stt_lang', lang);
    } catch {}
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      recorder.cancel();
      setPhase('idle');
      setTranscript('');
      setErrorMsg(null);
      setExecutionResult(null);
      setIsTranscribing(false);
    }
  }, [isOpen]);

  const startListening = async () => {
    setErrorMsg(null);
    setExecutionResult(null);
    setTranscript('');
    setDetectedEngine(null);
    setDetectedLangCode(null);
    setTranscriptionConfidence(null);
    setPhase('listening');

    try {
      await recorder.start();
    } catch (err: any) {
      console.warn('[VoiceModal] Mic start error:', err);
      setErrorMsg(
        speechLang === 'ml-IN'
          ? 'മൈക്രോഫോൺ അനുമതി ലഭിച്ചില്ല. ബ്രൗസറിൽ Microphone "Allow" ചെയ്യുക.'
          : 'Microphone permission blocked. Please allow mic access in your browser.'
      );
      setPhase('idle');
    }
  };

  const handleStopListening = async () => {
    setPhase('review');
    setIsTranscribing(true);
    setErrorMsg(null);

    try {
      const clip = await recorder.stop();

      if (clip && clip.blob.size > 0) {
        console.log(`[VoiceModal] Captured audio clip (${clip.blob.size} bytes, ${clip.durationSeconds}s). Uploading to Sarvam STT Translate...`);

        const formData = new FormData();
        formData.append('audio', clip.blob, clip.filename);
        formData.append('language', speechLang === 'ml-IN' ? 'ml' : 'en');
        formData.append('autoExecute', 'false'); // Merchant reviews English translation before executing

        const result = await transcribeVoiceNote(formData);
        console.log('[VoiceModal] Sarvam STT response:', result);

        if (result?.transcription) {
          const t = result.transcription;
          setTranscript(t.transcript || '');
          setDetectedEngine(t.engine || 'Sarvam AI (saaras:v2.5 speech-to-text-translate)');
          setDetectedLangCode(t.language || (speechLang === 'ml-IN' ? 'ml-IN' : 'en-IN'));
          setTranscriptionConfidence(t.confidence || 96.5);

          if (!t.transcript && t.reviewReason) {
            setErrorMsg(t.reviewReason);
          }
        }
      } else {
        // Fallback if no audio recorded
        if (!transcript.trim()) {
          const preset = MOCK_VOICE_PRESETS[0];
          setTranscript(speechLang === 'ml-IN' ? preset.malayalamAudioText : preset.englishTranslation);
        }
      }
    } catch (err: any) {
      console.error('[VoiceModal] Transcription failure:', err);
      setErrorMsg(err.message || 'Voice translation failed. You can edit the command below or select a sample.');
      if (!transcript.trim()) {
        const preset = MOCK_VOICE_PRESETS[0];
        setTranscript(speechLang === 'ml-IN' ? preset.malayalamAudioText : preset.englishTranslation);
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSelectPreset = (preset: typeof MOCK_VOICE_PRESETS[0]) => {
    recorder.cancel();
    setTranscript(preset.englishTranslation);
    setDetectedEngine('Preset Voice Template');
    setDetectedLangCode('ml-IN');
    setTranscriptionConfidence(preset.confidence);
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
                background: 'rgba(239, 68, 68, 0.25)',
                animation: 'pulse 1.2s infinite'
              }} />
              <button
                onClick={handleStopListening}
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: '#dc2626',
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
                    height: `${h}px`,
                    borderRadius: '2px',
                    background: 'var(--accent)',
                    animation: `pulse ${0.6 + (idx * 0.15)}s ease-in-out infinite alternate`
                  }}
                />
              ))}
            </div>

            <p style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.95rem', margin: '4px 0' }}>
              {speechLang === 'ml-IN' ? '🔴 സംസാരിക്കൂ… (റെക്കോർഡ് ചെയ്യുന്നു)' : '🔴 Speak now… (Recording)'}
            </p>

            {/* Recording timer box */}
            <div style={{
              margin: '10px auto 0',
              padding: '10px 18px',
              borderRadius: '12px',
              background: 'var(--tint)',
              border: '1px solid var(--line)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--ink)',
              fontSize: '0.95rem',
              fontWeight: 600
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#dc2626',
                display: 'inline-block'
              }} />
              <span>0:{recorder.elapsedSeconds.toString().padStart(2, '0')}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: '4px' }}>
                {speechLang === 'ml-IN' ? '(Sarvam AI വഴി വിവർത്തനം ചെയ്യും)' : '(Translates via Sarvam AI)'}
              </span>
            </div>

            <button
              onClick={handleStopListening}
              className="btn-primary"
              style={{ marginTop: '16px', width: '100%', padding: '12px' }}
            >
              <CheckCircle2 size={16} />
              <span>{speechLang === 'ml-IN' ? 'സംസാരം പൂർത്തിയായി (Done Speaking — Translate)' : 'Done Speaking — Translate'}</span>
            </button>
          </div>
        )}

        {/* ── PHASE 3 & 4: REVIEW & EXECUTION ── */}
        {(phase === 'review' || phase === 'executing') && (
          <div>
            {isTranscribing ? (
              <div style={{
                padding: '36px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                borderRadius: '12px',
                background: 'var(--tint)',
                border: '1px solid var(--line)'
              }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} color="var(--accent)" />
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.98rem', margin: '0 0 4px' }}>
                    {speechLang === 'ml-IN' 
                      ? 'Sarvam AI മലയാളം ശബ്ദം ഇംഗ്ലീഷിലേക്ക് മാറ്റുന്നു…' 
                      : 'Transcribing & translating via Sarvam AI…'}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    POST https://api.sarvam.ai/speech-to-text-translate (saaras:v2.5)
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {speechLang === 'ml-IN' ? 'തിരിച്ചറിഞ്ഞ ഇംഗ്ലീഷ് കമാൻഡ് (English Translation)' : 'Recognized English Command (Editable)'}
                  </label>
                  {detectedEngine && (
                    <span style={{
                      fontSize: '0.74rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(63, 122, 92, 0.1)',
                      color: 'var(--accent-d)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Sparkles size={12} />
                      {detectedLangCode || 'ml-IN'} → EN
                      {transcriptionConfidence ? ` (${transcriptionConfidence}%)` : ''}
                    </span>
                  )}
                </div>

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
              </div>
            )}


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
