import React from 'react';
import type { Language, NavTab } from '../types';
import { STORE_PROFILE, INITIAL_AGENT_LOGS, MOCK_INVENTORY, MOCK_VOICE_PRESETS } from '../mockData';
import { 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  DollarSign, 
  Mic, 
  FileText, 
  Package, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

interface OverviewProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  language,
  onNavigate,
  onOpenVoiceModal
}) => {
  const lowStockItems = MOCK_INVENTORY.filter(i => i.currentStock <= i.reorderLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{ 
        padding: '28px', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(99, 102, 241, 0.12) 100%)',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="glass-badge glass-badge-emerald">
                <Sparkles size={14} />
                {language === 'ml' ? 'ഓട്ടോണമസ് അസിസ്റ്റന്റ് സജീവം' : 'Autonomous COO Active 24/7'}
              </span>
              <span className="glass-badge glass-badge-indigo">
                Reflection Loop Online
              </span>
            </div>
            
            <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
              {language === 'ml' 
                ? `നമസ്കാരം, ${STORE_PROFILE.ownerMl}! കടയിലെ പ്രവർത്തനങ്ങൾ സുഗമമാണ്.` 
                : `Welcome back, ${STORE_PROFILE.owner}! Operations are running smoothly.`}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '720px', marginTop: '6px' }}>
              {language === 'ml'
                ? 'ഇന്ന് 48 WhatsApp അന്വേഷണങ്ങൾ ഏജന്റ് സ്വയം കൈകാര്യം ചെയ്തു. 5 ഉൽപ്പന്നങ്ങളുടെ ബിൽ രേഖപ്പെടുത്തി കഴിഞ്ഞു.'
                : 'Your Vernacular Agent autonomously handled 48 customer inquiries on WhatsApp, synced 5 supplier invoice commodities, and confirmed 3 B2B appointments.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={onOpenVoiceModal}
              className="btn-primary animate-glow"
              style={{ padding: '12px 22px', fontSize: '0.9rem' }}
            >
              <Mic size={18} />
              <span className="font-ml">
                {language === 'ml' ? 'ശബ്ദ സഹായി ആരംഭിക്കുക' : 'Speak to Agent'}
              </span>
            </button>

            <button 
              onClick={() => onNavigate('invoices')}
              className="btn-secondary"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <FileText size={18} color="var(--saffron-light)" />
              <span className="font-ml">
                {language === 'ml' ? 'ഇൻവോയ്സ് സ്കാൻ' : 'Scan Invoice'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        {/* KPI 1: Monthly Run Rate */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {language === 'ml' ? 'പ്രതിമാസ വരുമാനം' : 'Monthly Run Rate'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-light)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            ₹{STORE_PROFILE.monthlyRevenue.toLocaleString('en-IN')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--emerald-light)' }}>
            <span>↑ +14.2%</span>
            <span style={{ color: 'var(--text-muted)' }}>vs previous month</span>
          </div>
        </div>

        {/* KPI 2: Autonomous Agent Success Rate */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {language === 'ml' ? 'ഏജന്റ് സ്വയം പൂർത്തിയാക്കിയവ' : 'Autonomous Reflection'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
              <RotateCcw size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {STORE_PROFILE.tasksAutoCompleted}%
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#a5b4fc' }}>
            <span>✓ 0 Human escalations</span>
          </div>
        </div>

        {/* KPI 3: WhatsApp Queries */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {language === 'ml' ? 'ഇന്നത്തെ WhatsApp മെസ്സേജുകൾ' : 'WhatsApp CRM Today'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25d366' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {STORE_PROFILE.whatsappQueriesToday}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--emerald-light)' }}>
            <span>Avg reply speed: 2.4s</span>
          </div>
        </div>

        {/* KPI 4: Cash in Hand & Float */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {language === 'ml' ? 'കയ്യിലുള്ള പണം (Cash in Hand)' : 'Cash in Hand (Store Float)'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--saffron-light)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            ₹{STORE_PROFILE.cashInHand.toLocaleString('en-IN')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--saffron-light)' }}>
            <span>₹38,055 pending UPI clearance</span>
          </div>
        </div>

      </div>

      {/* Vernacular Quick Action Voice Strip */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--emerald-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Mic size={20} />
          </div>
          <div>
            <h4 className="font-display" style={{ fontSize: '1rem', fontWeight: 700 }}>
              {language === 'ml' ? 'ശബ്ദ പരീക്ഷണം (Quick Voice Test)' : 'Try Instant Malayalam Voice Command'}
            </h4>
            <p className="font-ml" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              "{MOCK_VOICE_PRESETS[0].malayalamAudioText}"
            </p>
          </div>
        </div>

        <button 
          onClick={onOpenVoiceModal}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <Play size={14} color="var(--emerald-light)" />
          <span>Test Live Loop</span>
        </button>
      </div>

      {/* Middle Split: Recent Agent Tasks Stream & Low Stock Warning */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left: Recent Activity Feed */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {language === 'ml' ? 'സമീപകാല ഏജന്റ് പ്രവർത്തനങ്ങൾ' : 'Recent Autonomous Operations'}
            </h3>
            <button 
              onClick={() => onNavigate('voice-agent')}
              style={{ background: 'transparent', border: 'none', color: 'var(--emerald-light)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {INITIAL_AGENT_LOGS.slice(0, 3).map((log) => (
              <div 
                key={log.id}
                style={{ 
                  padding: '14px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="glass-badge glass-badge-emerald" style={{ fontSize: '0.68rem' }}>
                    {log.toolUsed}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {log.timestamp}
                  </span>
                </div>
                <p className="font-ml" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {log.inputPromptMl || log.inputPrompt}
                </p>
                <p className="font-ml" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {language === 'ml' ? log.outputSummaryMl : log.outputSummary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock Warnings & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Low Stock Alert Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--rose-main)" />
                <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fda4af' }}>
                  {language === 'ml' ? 'സ്റ്റോക്ക് മുന്നറിയിപ്പുകൾ' : 'Inventory Restock Alerts'}
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('inventory')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Manage Stock →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStockItems.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(244, 63, 94, 0.06)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <p className="font-ml" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>
                      {item.nameMl}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: '#fda4af' }}>
                      Current: {item.currentStock} {item.unit} (Reorder level: {item.reorderLevel} {item.unit})
                    </span>
                  </div>

                  <button 
                    onClick={() => onNavigate('inventory')}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => onNavigate('whatsapp')}
              className="glass-panel-hover"
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(37, 211, 102, 0.08)',
                border: '1px solid rgba(37, 211, 102, 0.2)',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={22} color="#25d366" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>WhatsApp Hub</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'ml' ? 'കസ്റ്റമർ ഓർഡറുകൾ കാണുക' : 'Customer inquiries & orders'}
              </p>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="glass-panel-hover"
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={22} color="#a5b4fc" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {language === 'ml' ? 'കടയുടെ വിവരങ്ങൾ' : 'Store Settings'}
              </h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'ml' ? 'പ്രൊഫൈൽ & UPI ക്രമീകരണങ്ങൾ' : 'Profile & payment settings'}
              </p>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
