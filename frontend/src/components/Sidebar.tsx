import React from 'react';
import type { NavTab, Language, StoreProfile } from '../types';
import { KadaIcon } from './ui';
import { STORE_PROFILE } from '../mockData';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  onBackToLanding?: () => void;
  storeProfile?: StoreProfile;
  onLogout?: () => void;
  onLanguageChange?: (lang: Language) => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, language, onBackToLanding, storeProfile, onLogout, onLanguageChange }) => {
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

      <div className="shop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="av">{initials}</span>
          <span>
            <b>{language === 'ml' ? (profile.nameMl || profile.name) : profile.name}</b>
            <small>{shopLocation}</small>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onLanguageChange && (
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'ml' : 'en')}
              className="glass-badge"
              style={{
                cursor: 'pointer',
                fontSize: '0.72rem',
                padding: '2px 6px',
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--ink)'
              }}
              title={language === 'en' ? 'മലയാളത്തിലേക്ക് മാറ്റുക' : 'Switch to English'}
            >
              {language === 'en' ? 'EN' : 'മല'}
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              title={language === 'ml' ? 'ലോഗ് ഔട്ട് ചെയ്യുക' : 'Sign out'}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
