import React, { useState } from 'react';
import type { Language } from '../types';
import { MOCK_STORE_SETTINGS, STORE_PROFILE } from '../mockData';
import { 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  Bell, 
  Save, 
  Lock, 
  QrCode, 
  Phone, 
  MapPin, 
  Clock,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface StoreSettingsProps {
  language: Language;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ language }) => {
  const [upiId, setUpiId] = useState(MOCK_STORE_SETTINGS.contactPreferences.upiId);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(MOCK_STORE_SETTINGS.contactPreferences.notifyWhatsapp);
  const [notifyLowStock, setNotifyLowStock] = useState(MOCK_STORE_SETTINGS.contactPreferences.notifyLowStock);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Info Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #eaf4ed 0%, var(--surface) 100%)',
        border: '1px solid var(--line)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="glass-badge glass-badge-emerald">
                <ShieldCheck size={14} />
                100% Private & Safe
              </span>
              <span className="glass-badge glass-badge-emerald">
                {language === 'ml' ? 'കടയുടെ ക്രമീകരണങ്ങൾ' : 'Store Settings'}
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>
              {language === 'ml' 
                ? 'കടയുടെ വിവരങ്ങൾ & സുരക്ഷിതത്വം' 
                : 'Store Profile, Preferences & Data Privacy'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'നിങ്ങളുടെ കടയുടെ പേര്, ജിഎസ്ടി നമ്പർ, UPI ഐഡി, വാട്സ്ആപ്പ് അറിയിപ്പുകൾ എന്നിവ ഇവിടെ സജ്ജീകരിക്കാം. നിങ്ങളുടെ എല്ലാ വിവരങ്ങളും സ്വകാര്യവും പൂർണ്ണമായും സുരക്ഷിതവുമാണ്.'
                : 'Manage store details, UPI payment IDs, and automated customer alerts. Your customer records and invoice data are fully private and encrypted.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="glass-badge glass-badge-emerald" style={{ padding: '8px 14px' }}>
              <CheckCircle2 size={14} />
              <span>Status: Active 24/7</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Store Profile */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--line)', background: 'var(--surface)' }}>
          <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
            <Store size={18} color="var(--accent)" />
            {language === 'ml' ? 'വ്യാപാര സ്ഥാപനത്തിന്റെ വിവരങ്ങൾ' : 'Store Information'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Store Name (കടയുടെ പേര്)</span>
              <p className="font-ml" style={{ fontWeight: 600, color: 'var(--ink)', marginTop: '2px' }}>
                {STORE_PROFILE.nameMl}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                {STORE_PROFILE.name}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Proprietor / Owner (ഉടമ)</span>
              <p className="font-ml" style={{ fontWeight: 600, color: 'var(--ink)', marginTop: '2px' }}>
                {STORE_PROFILE.ownerMl} ({STORE_PROFILE.owner})
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>GSTIN Registration</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-d)', marginTop: '2px' }}>
                {STORE_PROFILE.gstin}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Address & City</span>
              <p style={{ color: 'var(--ink)', marginTop: '2px' }}>
                {STORE_PROFILE.location}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Business WhatsApp Number</span>
              <p style={{ color: 'var(--ink)', marginTop: '2px', fontWeight: 600 }}>
                {STORE_PROFILE.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Payments */}
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--line)', background: 'var(--surface)' }}>
          <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
            <QrCode size={18} color="var(--accent)" />
            {language === 'ml' ? 'പേയ്മെന്റ് & അറിയിപ്പുകൾ' : 'Payments & Preferences'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* UPI ID field */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                Default Store UPI ID (for instant QR code generation):
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Notification Checkbox 1 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink)' }}>
              <input 
                type="checkbox"
                checked={notifyWhatsapp}
                onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
              />
              <span className="font-ml">
                {language === 'ml' 
                  ? 'പുതിയ WhatsApp അന്വേഷണങ്ങൾ വരുമ്പോൾ ഫോണിൽ അറിയിക്കുക' 
                  : 'Send me summary alerts for new customer WhatsApp inquiries'}
              </span>
            </label>

            {/* Notification Checkbox 2 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink)' }}>
              <input 
                type="checkbox"
                checked={notifyLowStock}
                onChange={(e) => setNotifyLowStock(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
              />
              <span className="font-ml">
                {language === 'ml' 
                  ? 'സാധനങ്ങൾ തീരാറാകുമ്പോൾ ഓർഡർ ചെയ്യാനുള്ള മുന്നറിയിപ്പ് നൽകുക' 
                  : 'Alert me immediately when items hit low stock reorder level'}
              </span>
            </label>

            {/* Data Privacy & Backup Card */}
            <div style={{ 
              padding: '14px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--tint)',
              border: '1px solid var(--line)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-d)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '4px' }}>
                <Lock size={14} />
                <span>{language === 'ml' ? 'ഡാറ്റാ സംരക്ഷണം ഉറപ്പാണ്' : 'Privacy & Automated Daily Backup'}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                {language === 'ml'
                  ? 'നിങ്ങളുടെ ഉപഭോക്താക്കളുടെ വിവരങ്ങളും ബില്ലുകളും സ്വകാര്യമായി സൂക്ഷിക്കപ്പെടുന്നു. എല്ലാ ദിവസവും പുലർച്ചെ 4 മണിക്ക് ഓട്ടോമാറ്റിക് ബാക്കപ്പ് പൂർത്തിയാകുന്നു.'
                  : 'All business accounts and customer receipts are private and protected. Daily automatic cloud backups are performed every morning.'}
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: 'auto', padding: '10px 18px', width: '100%' }}
            >
              <Save size={16} />
              <span>{isSaved ? 'Saved Successfully! ✓' : 'Save Preferences'}</span>
            </button>

          </div>
        </form>

      </div>

    </div>
  );
};
