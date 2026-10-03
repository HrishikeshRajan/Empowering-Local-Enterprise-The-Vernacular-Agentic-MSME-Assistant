import React from 'react';
import type { NavTab, Language } from '../types';
import { KadaIcon } from './ui';
import { STORE_PROFILE } from '../mockData';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  onBackToLanding?: () => void;
}

const NAV: { id: NavTab; labelEn: string; labelMl: string; icon: string }[] = [
  { id: 'overview',     labelEn: 'Home',        labelMl: 'ഹോം',             icon: 'i-home' },
  { id: 'whatsapp',     labelEn: 'Inbox',       labelMl: 'ഇൻബോക്സ്',       icon: 'i-chat' },
  { id: 'invoices',     labelEn: 'Bills',       labelMl: 'ബില്ലുകൾ',        icon: 'i-doc' },
  { id: 'voice-agent',  labelEn: 'Activity',    labelMl: 'ആക്ടിവിറ്റി',    icon: 'i-pulse' },
  { id: 'inventory',    labelEn: 'Inventory',   labelMl: 'സ്റ്റോക്ക്',      icon: 'i-box' },
  { id: 'appointments', labelEn: 'Bookings',    labelMl: 'ബുക്കിംഗുകൾ',    icon: 'i-cal' },
  { id: 'settings',     labelEn: 'Setup',       labelMl: 'ക്രമീകരണം',      icon: 'i-rocket' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, language, onBackToLanding }) => {
  const initials = STORE_PROFILE.owner.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <aside className="side">
      <a className="logo" href="#" onClick={e => { e.preventDefault(); onBackToLanding?.(); }}>
        <i />Kada
      </a>

      {NAV.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={currentTab === item.id ? 'on' : ''}
          onClick={e => { e.preventDefault(); onTabChange(item.id); }}
        >
          <KadaIcon id={item.icon} />
          {language === 'ml' ? item.labelMl : item.labelEn}
        </a>
      ))}

      <div className="shop">
        <span className="av">{initials}</span>
        <span>
          <b>{language === 'ml' ? STORE_PROFILE.nameMl : STORE_PROFILE.name}</b><br />
          <small style={{ color: 'var(--muted)' }}>
            {language === 'ml' ? 'സാമ്പിൾ ഷോപ്പ്' : 'Sample shop'}
          </small>
        </span>
      </div>
    </aside>
  );
};
