import React from 'react';
import type { Language, NavTab } from '../types';
import { STORE_PROFILE } from '../mockData';

interface HeaderProps {
  currentTab: NavTab;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoiceModal: () => void;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onBackToLanding }) => {
  const initials = STORE_PROFILE.owner.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div className="top">
      <a className="logo" href="#home">
        <i />Kada
      </a>
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
  );
};
