import React from 'react';
import type { Language, NavTab } from '../types';
import { STORE_PROFILE } from '../mockData';
import { 
  Mic, 
  Globe2, 
  Server, 
  Store, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoiceModal: () => void;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  language,
  onLanguageChange,
  onOpenVoiceModal,
  onBackToLanding
}) => {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left: Store identity & Vernacular Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src="/merchant_avatar.jpg" 
              alt="Merchant Suresh Kumar" 
              style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: 'var(--radius-full)', 
                objectFit: 'cover',
                border: '2px solid var(--emerald-main)',
                boxShadow: '0 0 12px var(--emerald-glow)'
              }} 
            />
            <span style={{ 
              position: 'absolute', 
              bottom: '2px', 
              right: '2px', 
              width: '12px', 
              height: '12px', 
              backgroundColor: 'var(--emerald-main)', 
              borderRadius: '50%',
              border: '2px solid var(--bg-deep)'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {language === 'ml' ? STORE_PROFILE.nameMl : STORE_PROFILE.name}
              </h1>
              <span className="glass-badge glass-badge-emerald">
                <CheckCircle2 size={12} />
                GSTIN: {STORE_PROFILE.gstin}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span className="font-ml">{language === 'ml' ? 'ഉടമ: ' + STORE_PROFILE.ownerMl : 'Owner: ' + STORE_PROFILE.owner}</span>
              {' • '}{STORE_PROFILE.location}
            </p>
          </div>
        </div>

        {/* Right: Quick actions, VPS Health pill, Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Store Assistant Status Badge */}
          <div className="glass-badge glass-badge-emerald" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--emerald-light)', display: 'inline-block' }} />
            <span>{language === 'ml' ? 'സഹായി സജീവം (24/7)' : 'Assistant Online 24/7'}</span>
          </div>

          {/* Back to Landing Page Button */}
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <span>{language === 'ml' ? '← ഹോം പേജ്' : '← Home Page'}</span>
            </button>
          )}

          {/* Vernacular Language Switcher */}
          <div style={{ 
            display: 'flex', 
            background: 'rgba(255, 255, 255, 0.06)', 
            padding: '3px', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => onLanguageChange('en')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: language === 'en' ? 'var(--emerald-main)' : 'transparent',
                color: language === 'en' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ml')}
              className="font-ml"
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: language === 'ml' ? 'var(--emerald-main)' : 'transparent',
                color: language === 'ml' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              മലയാളം
            </button>
          </div>

          {/* Vernacular Voice Assistant Trigger */}
          <button 
            onClick={onOpenVoiceModal}
            className="btn-primary animate-glow"
            style={{ padding: '8px 16px' }}
          >
            <Mic size={16} />
            <span className="font-ml">
              {language === 'ml' ? 'സംസാരിക്കൂ (Voice Agent)' : 'Voice Agent (Malayalam)'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
