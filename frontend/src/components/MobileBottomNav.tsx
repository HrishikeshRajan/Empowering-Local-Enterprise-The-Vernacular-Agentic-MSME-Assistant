import React from 'react';
import type { NavTab, Language } from '../types';
import { KadaIcon } from './ui';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  onOpenVoiceModal: () => void;
}

const TABS: { id: NavTab; labelEn: string; labelMl: string; icon: string }[] = [
  { id: 'overview',    labelEn: 'Home',     labelMl: 'ഹോം',       icon: 'i-home' },
  { id: 'whatsapp',    labelEn: 'Inbox',    labelMl: 'ഇൻബോക്സ്', icon: 'i-chat' },
  { id: 'invoices',    labelEn: 'Bills',    labelMl: 'ബില്ല്',     icon: 'i-doc' },
  { id: 'voice-agent', labelEn: 'Activity', labelMl: 'ലോഗ്',      icon: 'i-pulse' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab, onTabChange, language, onOpenVoiceModal,
}) => (
  <nav className="knav" aria-label="Main">
    {TABS.slice(0, 2).map(t => (
      <a
        key={t.id}
        href={`#${t.id}`}
        className={currentTab === t.id ? 'on' : ''}
        onClick={e => { e.preventDefault(); onTabChange(t.id); }}
      >
        <KadaIcon id={t.icon} />
        {language === 'ml' ? t.labelMl : t.labelEn}
      </a>
    ))}

    {/* Central FAB */}
    <button className="fab" onClick={onOpenVoiceModal} aria-label="Speak a command">
      <KadaIcon id="i-mic" className="i" style={{ width: 26, height: 26 }} />
    </button>

    {TABS.slice(2).map(t => (
      <a
        key={t.id}
        href={`#${t.id}`}
        className={currentTab === t.id ? 'on' : ''}
        onClick={e => { e.preventDefault(); onTabChange(t.id); }}
      >
        <KadaIcon id={t.icon} />
        {language === 'ml' ? t.labelMl : t.labelEn}
      </a>
    ))}
  </nav>
);
