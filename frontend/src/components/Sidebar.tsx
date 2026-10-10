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
  autoMode?: boolean;
  onToggleAutoMode?: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onTabChange, 
  language, 
  onBackToLanding, 
  storeProfile, 
  onLogout, 
  onLanguageChange,
  autoMode = true,
  onToggleAutoMode
}) => {
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

      {/* ── Compact Kada Auto Mode Toggle (Theme-aligned) ── */}
      <div 
        className="sidebar-agent-toggle"
        style={{
          marginTop: 'auto',
          marginBottom: '0.65rem',
          padding: '0.6rem 0.8rem',
          borderRadius: '1rem',
          background: autoMode ? 'var(--soft)' : 'var(--tint)',
          border: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          transition: 'all 0.25s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span 
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: autoMode ? 'var(--accent)' : 'var(--amber-t, #97691a)',
              boxShadow: autoMode ? '0 0 0 3px rgba(44,90,67,0.2)' : 'none',
              animation: autoMode ? 'pl 1.6s infinite' : 'none',
              flexShrink: 0
            }}
          />
          <div style={{ minWidth: 0, lineHeight: 1.25 }}>
            <span style={{ 
              display: 'block', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {autoMode 
                ? (language === 'ml' ? 'Kada ഓട്ടോ' : 'Kada Auto')
                : (language === 'ml' ? 'മാനുവൽ' : 'Manual')
              }
            </span>
            <span style={{ 
              display: 'block', 
              fontSize: '0.68rem', 
              color: 'var(--muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {autoMode 
                ? (language === 'ml' ? 'സന്ദേശങ്ങൾ നോക്കുന്നു' : 'Handling msgs') 
                : (language === 'ml' ? 'സ്വയം നിയന്ത്രിക്കുക' : 'You in control')}
            </span>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={autoMode}
          aria-label={language === 'ml' ? 'ഓട്ടോ മോഡ് മാറ്റുക' : 'Toggle auto mode'}
          onClick={onToggleAutoMode}
          style={{
            position: 'relative',
            width: '2.5rem',
            height: '1.4rem',
            borderRadius: '999px',
            backgroundColor: autoMode ? 'var(--accent)' : 'rgba(0,0,0,0.18)',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            flexShrink: 0,
            transition: 'background-color 0.25s ease'
          }}
        >
          <span
            style={{
              display: 'block',
              width: '1.1rem',
              height: '1.1rem',
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
              transform: autoMode ? 'translateX(1.1rem)' : 'translateX(0rem)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1)'
            }}
          />
        </button>
      </div>

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
