import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { KadaSheet, KadaButton, KadaIcon } from './ui';
import { MOCK_VOICE_PRESETS } from '../mockData';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectCommand: (text: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen, onClose, language, onSelectCommand,
}) => {
  const [phase, setPhase] = useState<'idle' | 'listening' | 'done'>('idle');
  const [transcript, setTranscript] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      timers.current.forEach(clearTimeout);
      setPhase('idle');
      setTranscript('');
    }
  }, [isOpen]);

  const startListening = () => {
    setPhase('listening');
    setTranscript('');
    const preset = MOCK_VOICE_PRESETS[Math.floor(Math.random() * MOCK_VOICE_PRESETS.length)];
    timers.current.push(
      setTimeout(() => setTranscript(preset.malayalamAudioText), 1300),
      setTimeout(() => setPhase('done'), 2800),
    );
  };

  const handleExecute = () => {
    if (transcript) onSelectCommand(transcript);
    onClose();
  };

  const title = phase === 'done'
    ? (language === 'ml' ? 'ചെയ്തു' : 'Done')
    : (language === 'ml' ? 'കേൾക്കുന്നു' : 'Listening');

  return (
    <KadaSheet open={isOpen} onClose={onClose} title={title}>

      {/* Waveform (listening) */}
      {phase === 'listening' && (
        <div className="kwave" aria-hidden="true">
          {Array.from({ length: 13 }, (_, i) => <s key={i} />)}
        </div>
      )}

      {/* Mic button (idle) */}
      {phase === 'idle' && (
        <div className="rec">
          <button
            className="mic-btn"
            aria-label={language === 'ml' ? 'റെക്കോർഡ്' : 'Record'}
            onClick={startListening}
          >
            <KadaIcon id="i-mic" className="i" style={{ width: 32, height: 32 }} />
          </button>
          <span className="ml" style={{ color: 'var(--muted)' }}>
            {language === 'ml'
              ? 'ടാപ്പ് ചെയ്ത് മലയാളത്തിൽ പറയൂ'
              : 'Tap and speak in Malayalam'}
          </span>
        </div>
      )}

      {/* Transcript */}
      <div className={`ktx ml${transcript ? '' : ''}`}>
        {transcript || (phase === 'listening' ? '…' : '')}
      </div>

      {/* Result */}
      {phase === 'done' && transcript && (
        <div className="kres on">{transcript} ✓</div>
      )}

      {/* Quick presets */}
      {phase === 'idle' && (
        <div style={{ display: 'grid', gap: '.5rem', marginTop: '1rem' }}>
          {MOCK_VOICE_PRESETS.slice(0, 3).map(p => (
            <KadaButton
              key={p.id}
              ghost
              small
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
              onClick={() => { setTranscript(p.malayalamAudioText); setPhase('done'); }}
            >
              <span className="ml">{p.malayalamAudioText}</span>
            </KadaButton>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '.5rem', marginTop: '1rem' }}>
        {phase === 'done' && (
          <KadaButton style={{ flex: 1 }} onClick={handleExecute}>
            {language === 'ml' ? 'ചെയ്യൂ' : 'Execute'}
          </KadaButton>
        )}
        <KadaButton ghost style={{ flex: 1 }} onClick={onClose}>
          {language === 'ml' ? 'അടയ്ക്കൂ' : 'Close'}
        </KadaButton>
      </div>
    </KadaSheet>
  );
};
