import React from 'react';
import type { NavTab, Language } from '../types';
import { 
  LayoutDashboard, 
  Mic, 
  FileText, 
  MessageSquare, 
  Package
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
  onOpenVoiceModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  language,
  onOpenVoiceModal
}) => {
  return (
    <div 
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '74px',
        backgroundColor: 'rgba(8, 12, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 50,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px'
      }}
      className="mobile-nav-container"
    >
      <style>{`
        @media (max-width: 1024px) {
          .mobile-nav-container {
            display: flex !important;
          }
        }
      `}</style>

      {/* Overview Tab */}
      <button
        onClick={() => onTabChange('overview')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          color: currentTab === 'overview' ? 'var(--emerald-light)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          cursor: 'pointer'
        }}
      >
        <LayoutDashboard size={20} />
        <span>{language === 'ml' ? 'ഹോം' : 'Home'}</span>
      </button>

      {/* Invoices Tab */}
      <button
        onClick={() => onTabChange('invoices')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          color: currentTab === 'invoices' ? 'var(--emerald-light)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          cursor: 'pointer'
        }}
      >
        <FileText size={20} />
        <span>{language === 'ml' ? 'ബിൽ' : 'Bills'}</span>
      </button>

      {/* Central Glowing Mic Button for Thumb Reach */}
      <button
        onClick={onOpenVoiceModal}
        className="animate-glow"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--emerald-main) 0%, #059669 100%)',
          border: '3px solid var(--bg-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.7)',
          cursor: 'pointer',
          marginTop: '-24px',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <Mic size={26} />
      </button>

      {/* WhatsApp CRM Tab */}
      <button
        onClick={() => onTabChange('whatsapp')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          color: currentTab === 'whatsapp' ? 'var(--emerald-light)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          cursor: 'pointer'
        }}
      >
        <MessageSquare size={20} />
        <span>WhatsApp</span>
      </button>

      {/* Inventory Tab */}
      <button
        onClick={() => onTabChange('inventory')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          color: currentTab === 'inventory' ? 'var(--emerald-light)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          cursor: 'pointer'
        }}
      >
        <Package size={20} />
        <span>{language === 'ml' ? 'സ്റ്റോക്ക്' : 'Stock'}</span>
      </button>
    </div>
  );
};
