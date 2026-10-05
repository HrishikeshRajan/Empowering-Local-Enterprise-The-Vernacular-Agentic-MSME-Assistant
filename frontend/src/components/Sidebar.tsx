import React from 'react';
import type { NavTab, Language, StoreProfile } from '../types';
import { KadaIcon } from './ui';
import { STORE_PROFILE } from '../mockData';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  onBackToLanding?: () => void;
  storeProfile?: StoreProfile;
}

const NAV: { id: NavTab; labelEn: string; labelMl: string; icon: string }[] = [
  { id: 'overview',     labelEn: 'Home',        labelMl: 'ഹോം',          icon: 'i-home'  },
  { id: 'whatsapp',     labelEn: 'Inbox',       labelMl: 'ഇൻബോക്സ്',    icon: 'i-chat'  },
  { id: 'invoices',     labelEn: 'Bills',       labelMl: 'ബില്ലുകൾ',     icon: 'i-doc'   },
  { id: 'voice-agent',  labelEn: 'Activity',    labelMl: 'ആക്ടിവിറ്റി', icon: 'i-pulse' },
  { id: 'inventory',    labelEn: 'Inventory',   labelMl: 'സ്റ്റോക്ക്',   icon: 'i-box'   },
  { id: 'appointments', labelEn: 'Bookings',    labelMl: 'ബുക്കിംഗുകൾ', icon: 'i-cal'   },
  { id: 'settings',     labelEn: 'Setup',       labelMl: 'ക്രമീകരണം',   icon: 'i-set'   },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, language, onBackToLanding, storeProfile }) => {
  const profile = storeProfile || STORE_PROFILE;
  const initials = (profile.owner || 'Kada').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'KD';
  const shopLocation = profile.location ? (profile.location.split(',')[1]?.trim() || profile.location.split(',')[0]) : 'Kerala';

  return (
    <aside className="side">
      <a className="logo" href="#" onClick={e => { e.preventDefault(); onBackToLanding?.(); }}>
        <i />Kada
      </a>

      <nav aria-label={language === 'ml' ? 'പ്രധാന മെനു' : 'Main menu'}>
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
      </nav>

      <div className="shop">
        <span className="av">{initials}</span>
        <span>
          <b>{language === 'ml' ? (profile.nameMl || profile.name) : profile.name}</b>
          <small>{shopLocation}</small>
        </span>
      </div>
    </aside>
  );
};
