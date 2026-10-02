import React, { useState } from 'react';
import type { Language } from '../types';
import { MOCK_VOICE_PRESETS } from '../mockData';
import { Mic, X, Play, CheckCircle2, Sparkles, Send } from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectCommand: (cmdText: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectCommand
}) => {
  const [customText, setCustomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedCommand, setRecordedCommand] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateRecord = () => {
    setIsRecording(true);
    setRecordedCommand(null);

    setTimeout(() => {
      setIsRecording(false);
      const randomPreset = MOCK_VOICE_PRESETS[Math.floor(Math.random() * MOCK_VOICE_PRESETS.length)];
      setRecordedCommand(randomPreset.malayalamAudioText);
    }, 2000);
  };

  const handleExecute = (text: string) => {
    onSelectCommand(text);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '28px',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <span className="glass-badge glass-badge-emerald" style={{ marginBottom: '8px' }}>
            <Sparkles size={14} />
            whisper.cpp • Malayalam STT
          </span>
          <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {language === 'ml' ? 'മലയാളം ശബ്ദ സഹായി' : 'Vernacular Voice Assistant'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {language === 'ml' 
              ? 'മൈക്രോഫോണിൽ സംസാരിക്കുക അല്ലെങ്കിൽ സാമ്പിൾ തിരഞ്ഞെടുക്കുക' 
              : 'Tap microphone to speak or click any instant preset below'}
          </p>
        </div>

        {/* Big Animated Mic Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', margin: '10px 0' }}>
          <button
            onClick={handleSimulateRecord}
            className={isRecording ? 'animate-glow' : ''}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: isRecording 
                ? 'linear-gradient(135deg, var(--rose-main) 0%, #e11d48 100%)' 
                : 'linear-gradient(135deg, var(--emerald-main) 0%, #059669 100%)',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: isRecording ? '0 0 30px rgba(244, 63, 94, 0.7)' : '0 0 25px rgba(16, 185, 129, 0.5)',
              transition: 'all 0.3s ease'
            }}
          >
            <Mic size={36} />
          </button>

          {isRecording ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <span className="font-ml" style={{ fontSize: '0.85rem', color: '#fda4af', fontWeight: 600 }}>
                {language === 'ml' ? 'ശബ്ദം റെക്കോർഡ് ചെയ്യുന്നു...' : 'Listening in Malayalam...'}
              </span>
            </div>
          ) : recordedCommand ? (
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid var(--border-glow)',
              textAlign: 'center',
              width: '100%'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                Transcribed via whisper.cpp (168ms):
              </span>
              <p className="font-ml" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                "{recordedCommand}"
              </p>
              <button
                onClick={() => handleExecute(recordedCommand)}
                className="btn-primary"
                style={{ marginTop: '10px', width: '100%', fontSize: '0.82rem', padding: '8px' }}
              >
                Run Reflection Loop →
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {language === 'ml' ? 'സംസാരിക്കാൻ മൈക്കിൽ തൊടുക' : 'Tap mic to start recording'}
            </span>
          )}
        </div>

        {/* Quick Malayalam Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Instant Test Presets:
          </span>

          {MOCK_VOICE_PRESETS.slice(0, 3).map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleExecute(preset.malayalamAudioText)}
              className="glass-panel-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                textAlign: 'left',
                cursor: 'pointer',
                gap: '10px'
              }}
            >
              <span className="font-ml" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                "{preset.malayalamAudioText}"
              </span>
              <Play size={14} color="var(--emerald-light)" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
