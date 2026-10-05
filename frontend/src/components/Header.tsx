import React from 'react';
import type { Language, NavTab, StoreProfile } from '../types';
import { STORE_PROFILE } from '../mockData';

interface HeaderProps {
  currentTab: NavTab;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoiceModal: () => void;
  onBackToLanding?: () => void;
  storeProfile?: StoreProfile;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, onBackToLanding, storeProfile }) => {
  const profile = storeProfile || STORE_PROFILE;
  const initials = (profile.owner || 'Kada').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'KD';
  return (
    <div className="top">
      <a className="logo" href="#home">
        <i />Kada
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => onLanguageChange(language === 'en' ? 'ml' : 'en')}
          className="glass-badge"
          style={{ 
            cursor: 'pointer', 
            fontSize: '0.75rem', 
            padding: '3px 8px',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            color: 'var(--ink)'
          }}
          title={language === 'en' ? 'മലയാളത്തിലേക്ക് മാറ്റുക' : 'Switch to English'}
        >
          {language === 'en' ? 'EN' : 'മല'}
        </button>
        <a
          className="av"
          href="#setup"
          aria-label="Setup"
          onClick={onBackToLanding ? (e) => { e.preventDefault(); onBackToLanding(); } : undefined}
          title={language === 'ml' ? 'ഹോം പേജ്' : 'Home page'}
        >
          {initials}
        </a>
      </div>
    </div>
  );
};
