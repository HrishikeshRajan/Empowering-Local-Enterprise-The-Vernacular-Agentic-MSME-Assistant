import React from 'react';
import type { NavTab, Language } from '../types';
import { KadaIcon } from './ui';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  onOpenVoiceModal: () => void;
}

const LEFT:  { id: NavTab; labelEn: string; labelMl: string; icon: string }[] = [
  { id: 'overview', labelEn: 'Home',  labelMl: 'ഹോം',       icon: 'i-home' },
  { id: 'whatsapp', labelEn: 'Inbox', labelMl: 'ഇൻബോക്സ്', icon: 'i-chat' },
];
const RIGHT: { id: NavTab; labelEn: string; labelMl: string; icon: string }[] = [
  { id: 'inventory', labelEn: 'Stock', labelMl: 'സ്റ്റോക്ക്',  icon: 'i-box' },
  { id: 'settings',  labelEn: 'Setup', labelMl: 'ക്രമീകരണം', icon: 'i-set' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab, onTabChange, language, onOpenVoiceModal,
}) => (
  <nav className="knav" aria-label={language === 'ml' ? 'ബോട്ടം നാവിഗേഷൻ' : 'Bottom navigation'}>
    {LEFT.map(t => (
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

    <button className="fab" onClick={onOpenVoiceModal} aria-label={language === 'ml' ? 'വോയ്സ് കമ്മാൻഡ്' : 'Voice command'}>
      <KadaIcon id="i-mic" className="i" />
    </button>

    {RIGHT.map(t => (
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
