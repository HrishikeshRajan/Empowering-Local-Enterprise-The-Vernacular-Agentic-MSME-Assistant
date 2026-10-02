import React from 'react';
import type { NavTab, Language } from '../types';
import { 
  LayoutDashboard, 
  Mic, 
  FileText, 
  MessageSquare, 
  Package, 
  Calendar, 
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  onBackToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  language,
  onBackToLanding
}) => {
  const menuItems: { id: NavTab; labelEn: string; labelMl: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelMl: 'ഡാഷ്‌ബോർഡ്',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'voice-agent',
      labelEn: 'Voice Assistant',
      labelMl: 'ശബ്ദ സഹായി',
      icon: <Mic size={18} />,
      badge: 'Live'
    },
    {
      id: 'invoices',
      labelEn: 'Smart Bills & OCR',
      labelMl: 'ബില്ലുകൾ & ഇൻവോയ്സ്',
      icon: <FileText size={18} />,
      badge: '98%'
    },
    {
      id: 'whatsapp',
      labelEn: 'WhatsApp Orders',
      labelMl: 'വാട്സ്ആപ്പ് ഹബ്ബ്',
      icon: <MessageSquare size={18} />,
      badge: '3 new'
    },
    {
      id: 'inventory',
      labelEn: 'Inventory & Stock',
      labelMl: 'സ്റ്റോക്ക് വിവരങ്ങൾ',
      icon: <Package size={18} />
    },
    {
      id: 'appointments',
      labelEn: 'Customer Schedule',
      labelMl: 'ബുക്കിംഗുകൾ',
      icon: <Calendar size={18} />
    },
    {
      id: 'settings',
      labelEn: 'Store Settings',
      labelMl: 'ക്രമീകരണങ്ങൾ',
      icon: <Settings size={18} />
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand & App Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          borderRadius: 'var(--radius-md)', 
          background: 'linear-gradient(135deg, var(--emerald-main) 0%, var(--indigo-main) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
        }}>
          <Sparkles size={22} />
        </div>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Sahāyi AI <span style={{ color: 'var(--emerald-light)', fontSize: '0.85rem' }}>(സഹായി)</span>
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Vernacular Assistant
          </p>
        </div>
      </div>

      {/* Return to Home / Landing Page Button */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="btn-secondary"
          style={{ 
            padding: '8px 12px', 
            fontSize: '0.8rem', 
            justifyContent: 'flex-start',
            gap: '8px'
          }}
        >
          <span>←</span>
          <span>{language === 'ml' ? 'ഹോം പേജിലേക്ക്' : 'Return to Home Page'}</span>
        </button>
      )}

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isActive ? 'var(--border-glow)' : 'transparent',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.03) 100%)' 
                  : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: isActive ? 'var(--emerald-light)' : 'inherit' }}>
                  {item.icon}
                </span>
                <span className={language === 'ml' ? 'font-ml' : ''}>
                  {language === 'ml' ? item.labelMl : item.labelEn}
                </span>
              </div>
              {item.badge && (
                <span 
                  className={
                    item.id === 'voice-agent'
                      ? 'glass-badge glass-badge-emerald'
                      : 'glass-badge glass-badge-saffron'
                  }
                  style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Clean Merchant Status Pill in Sidebar */}
      <div className="glass-panel" style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShieldCheck size={16} color="var(--emerald-light)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--emerald-light)' }}>
            {language === 'ml' ? 'സഹായി സജീവം' : 'Store Assistant Active'}
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {language === 'ml' 
            ? 'നിങ്ങളുടെ കടയിലെ വിവരങ്ങൾ പൂർണ്ണമായും സുരക്ഷിതമാണ്.' 
            : 'Automating customer replies, bills, and stock records 24/7.'}
        </p>
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
          <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>● Online</span>
          <span style={{ color: 'var(--text-muted)' }}>Daily Backup OK</span>
        </div>
      </div>
    </aside>
  );
};
