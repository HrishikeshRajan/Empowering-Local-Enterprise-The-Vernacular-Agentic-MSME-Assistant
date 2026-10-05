import React, { useState, useEffect } from 'react';
import type { Language, StoreProfile } from '../types';
import { MOCK_STORE_SETTINGS, STORE_PROFILE } from '../mockData';
import { updateStoreProfile, updateStorePreferences } from '../api/client';
import { 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Lock, 
  QrCode, 
  Phone, 
  MapPin, 
  PlusCircle,
  RotateCcw,
  User,
  Hash,
  Sparkles,
  Check
} from 'lucide-react';

interface StoreSettingsProps {
  language: Language;
  storeProfile?: StoreProfile;
  onUpdateProfile?: (profile: Partial<StoreProfile>) => Promise<StoreProfile>;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ 
  language, 
  storeProfile, 
  onUpdateProfile 
}) => {
  const currentProfile = storeProfile || STORE_PROFILE;

  // Profile Form State
  const [name, setName] = useState(currentProfile.name);
  const [nameMl, setNameMl] = useState(currentProfile.nameMl);
  const [owner, setOwner] = useState(currentProfile.owner);
  const [ownerMl, setOwnerMl] = useState(currentProfile.ownerMl);
  const [phone, setPhone] = useState(currentProfile.phone);
  const [gstin, setGstin] = useState(currentProfile.gstin);
  const [location, setLocation] = useState(currentProfile.location);

  // Status feedback
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Preferences Form State
  const [upiId, setUpiId] = useState(MOCK_STORE_SETTINGS.contactPreferences.upiId);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(MOCK_STORE_SETTINGS.contactPreferences.notifyWhatsapp);
  const [notifyLowStock, setNotifyLowStock] = useState(MOCK_STORE_SETTINGS.contactPreferences.notifyLowStock);
  const [autoInvoice, setAutoInvoice] = useState(MOCK_STORE_SETTINGS.contactPreferences.autoInvoiceGeneration);
  const [isPrefsSaving, setIsPrefsSaving] = useState(false);
  const [isPrefsSaved, setIsPrefsSaved] = useState(false);

  // Keep form in sync if external storeProfile updates
  useEffect(() => {
    if (storeProfile) {
      setName(storeProfile.name || '');
      setNameMl(storeProfile.nameMl || '');
      setOwner(storeProfile.owner || '');
      setOwnerMl(storeProfile.ownerMl || '');
      setPhone(storeProfile.phone || '');
      setGstin(storeProfile.gstin || '');
      setLocation(storeProfile.location || '');
    }
  }, [storeProfile]);

  // Handle saving the store profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);
    setProfileMsg(null);

    const payload: Partial<StoreProfile> = {
      name: name.trim() || 'My Local Store',
      nameMl: nameMl.trim() || name.trim() || 'എന്റെ കട',
      owner: owner.trim() || 'Store Owner',
      ownerMl: ownerMl.trim() || owner.trim() || 'കടയുടമ',
      phone: phone.trim() || '+91 94471 23456',
      gstin: gstin.trim().toUpperCase() || 'UNREGISTERED',
      location: location.trim() || 'Kerala, India'
    };

    try {
      if (onUpdateProfile) {
        await onUpdateProfile(payload);
      } else {
        await updateStoreProfile(payload);
      }
      setIsProfileSaved(true);
      setProfileMsg(
        language === 'ml' 
          ? 'കടയുടെ വിവരങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!' 
          : 'Store details successfully saved!'
      );
      setTimeout(() => {
        setIsProfileSaved(false);
        setProfileMsg(null);
      }, 4000);
    } catch (err: any) {
      setProfileMsg(language === 'ml' ? 'സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല.' : 'Failed to save profile.');
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handle saving preferences
  const handlePrefsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPrefsSaving(true);
    try {
      await updateStorePreferences({
        upiId: upiId.trim(),
        notifyWhatsapp,
        notifyLowStock,
        autoInvoiceGeneration: autoInvoice
      });
      setIsPrefsSaved(true);
      setTimeout(() => setIsPrefsSaved(false), 3000);
    } catch (err) {
      console.warn('Failed to update preferences', err);
    } finally {
      setIsPrefsSaving(false);
    }
  };

  // Helper: Prepare a blank new shop registration template
  const handleStartNewShop = () => {
    setName('');
    setNameMl('');
    setOwner('');
    setOwnerMl('');
    setPhone('+91 ');
    setGstin('');
    setLocation('');
    setProfileMsg(
      language === 'ml' 
        ? 'പുതിയ കടയുടെ വിവരങ്ങൾ താഴെ നൽകി സേവ് ചെയ്യുക.' 
        : 'Enter details for your new store and click Save.'
    );
  };

  // Helper: Reset to sample demo shop
  const handleResetToDemo = () => {
    setName(STORE_PROFILE.name);
    setNameMl(STORE_PROFILE.nameMl);
    setOwner(STORE_PROFILE.owner);
    setOwnerMl(STORE_PROFILE.ownerMl);
    setPhone(STORE_PROFILE.phone);
    setGstin(STORE_PROFILE.gstin);
    setLocation(STORE_PROFILE.location);
    setProfileMsg(
      language === 'ml'
        ? 'സാമ്പിൾ വിവരങ്ങൾ നിറച്ചു. സേവ് ചെയ്യുക.'
        : 'Sample demo data loaded. Click Save to apply.'
    );
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
                : 'Store Profile, Preferences & Business Setup'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'നിങ്ങളുടെ കടയുടെ പേര്, ഉടമയുടെ പേര്, വാട്സ്ആപ്പ് നമ്പർ, ജിഎസ്ടി വിവരങ്ങൾ എന്നിവ ഇവിടെ ചേർക്കുകയോ പുതുക്കുകയോ ചെയ്യാം.'
                : 'Create or update your store name, owner credentials, business WhatsApp number, and payment preferences. All data is kept private and secure.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleStartNewShop}
              style={{ fontSize: '0.8rem', padding: '8px 14px' }}
              title={language === 'ml' ? 'പുതിയ കട രജിസ്റ്റർ ചെയ്യുക' : 'Register a new store'}
            >
              <PlusCircle size={15} />
              <span>{language === 'ml' ? '+ പുതിയ കട ചേർക്കുക' : '+ Register New Shop'}</span>
            </button>
            <span className="glass-badge glass-badge-emerald" style={{ padding: '8px 14px' }}>
              <CheckCircle2 size={14} />
              <span>Status: Active 24/7</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Editable Store Profile Form */}
        <form 
          onSubmit={handleProfileSubmit} 
          className="glass-panel" 
          style={{ 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '18px', 
            border: '1px solid var(--line)', 
            background: 'var(--surface)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
              <Store size={18} color="var(--accent)" />
              {language === 'ml' ? 'വ്യാപാര സ്ഥാപനത്തിന്റെ വിവരങ്ങൾ' : 'Store Information & Owner Profile'}
            </h3>
            <button
              type="button"
              onClick={handleResetToDemo}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--muted)', 
                fontSize: '0.75rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                cursor: 'pointer' 
              }}
              title={language === 'ml' ? 'സാമ്പിൾ വിവരങ്ങൾ നിറയ്ക്കുക' : 'Restore demo store profile'}
            >
              <RotateCcw size={12} />
              <span>{language === 'ml' ? 'സാമ്പിൾ കട' : 'Reset Demo'}</span>
            </button>
          </div>

          {/* Feedback banner */}
          {profileMsg && (
            <div style={{ 
              padding: '10px 14px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'var(--soft)', 
              border: '1px solid var(--accent)', 
              color: 'var(--accent-d)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Check size={16} />
              <span>{profileMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
            
            {/* Store Name (English & Malayalam) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Store Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Malabar Provisions"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  കടയുടെ പേര് (മലയാളം)
                </label>
                <input
                  type="text"
                  className="font-ml"
                  value={nameMl}
                  onChange={(e) => setNameMl(e.target.value)}
                  placeholder="ഉദാ: മലബാർ പ്രൊവിഷൻസ്"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Proprietor / Owner Name (English & Malayalam) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Owner / Proprietor Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  ഉടമയുടെ പേര് (മലയാളം)
                </label>
                <input
                  type="text"
                  className="font-ml"
                  value={ownerMl}
                  onChange={(e) => setOwnerMl(e.target.value)}
                  placeholder="ഉദാ: സുരേഷ് കുമാർ"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* WhatsApp Business Number */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Phone size={13} color="var(--accent)" />
                <span>Business WhatsApp Number (ഫോൺ നമ്പർ) *</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94471 23456"
                style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px', display: 'block' }}>
                {language === 'ml'
                  ? 'ഉപഭോക്താക്കൾക്ക് ഓട്ടോമാറ്റിക് മറുപടികളും ദിവസേനയുള്ള റിപ്പോർട്ടുകളും ലഭിക്കാൻ ഈ നമ്പർ ഉപയോഗിക്കുന്നു.'
                  : 'Used for incoming customer WhatsApp orders and autonomous daily business reports.'}
              </span>
            </div>

            {/* GSTIN Number */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Hash size={13} color="var(--accent)" />
                <span>GSTIN Registration Number</span>
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="32ABCPB9876C1Z1"
                style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* Store Address & Location */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <MapPin size={13} color="var(--accent)" />
                <span>Store Address & City (വിലാസവും സ്ഥലവും)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="G.T. Road, Thrissur, Kerala - 680001"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            {/* Submit button for store profile */}
            <button
              type="submit"
              disabled={isProfileSaving}
              className="btn-primary"
              style={{ marginTop: '8px', width: '100%' }}
            >
              <Save size={16} />
              <span>
                {isProfileSaving 
                  ? (language === 'ml' ? 'സേവ് ചെയ്യുന്നു...' : 'Saving Details...') 
                  : (isProfileSaved ? '✓ Saved Successfully!' : (language === 'ml' ? 'കടയുടെ വിവരങ്ങൾ സേവ് ചെയ്യുക' : 'Save Store Profile'))}
              </span>
            </button>

          </div>
        </form>

        {/* Right Column: Preferences, Payments & Security */}
        <form 
          onSubmit={handlePrefsSubmit} 
          className="glass-panel" 
          style={{ 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px', 
            border: '1px solid var(--line)', 
            background: 'var(--surface)' 
          }}
        >
          <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
            <QrCode size={18} color="var(--accent)" />
            {language === 'ml' ? 'പേയ്മെന്റ് & ഓട്ടോമേഷൻ' : 'Payments & Automation Preferences'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* UPI ID field */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                Default Store UPI ID (for dynamic customer QR codes):
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="storename@okaxis"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px', display: 'block' }}>
                {language === 'ml'
                  ? 'ഉപഭോക്താക്കൾ WhatsApp വഴി ഓർഡർ ചെയ്യുമ്പോൾ തൽക്ഷണം UPI QR ലിങ്ക് അയക്കാൻ ഇത് സഹായിക്കുന്നു.'
                  : 'Automatically embedded into WhatsApp payment links for instant UPI settlements.'}
              </span>
            </div>

            {/* Notification Checkbox 1 */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink)' }}>
              <input 
                type="checkbox"
                checked={notifyWhatsapp}
                onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                style={{ width: '16px', height: '16px', marginTop: '3px', accentColor: 'var(--accent)' }}
              />
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>
                  {language === 'ml' ? 'WhatsApp അന്വേഷണ അറിയിപ്പുകൾ' : 'Customer WhatsApp Inquiries'}
                </span>
                <span className="font-ml" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  {language === 'ml' 
                    ? 'പുതിയ WhatsApp അന്വേഷണങ്ങൾ വരുമ്പോൾ ഫോണിൽ ഉടൻ അറിയിക്കുക' 
                    : 'Receive real-time mobile push & summary alerts for customer inquiries'}
                </span>
              </div>
            </label>

            {/* Notification Checkbox 2 */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink)' }}>
              <input 
                type="checkbox"
                checked={notifyLowStock}
                onChange={(e) => setNotifyLowStock(e.target.checked)}
                style={{ width: '16px', height: '16px', marginTop: '3px', accentColor: 'var(--accent)' }}
              />
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>
                  {language === 'ml' ? 'സ്റ്റോക്ക് തീരാറായ അറിയിപ്പുകൾ' : 'Low Stock Reorder Alerts'}
                </span>
                <span className="font-ml" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  {language === 'ml' 
                    ? 'സാധനങ്ങൾ തീരാറാകുമ്പോൾ ഓർഡർ ചെയ്യാനുള്ള മുന്നറിയിപ്പ് നൽകുക' 
                    : 'Alert me automatically when products fall below safe reorder thresholds'}
                </span>
              </div>
            </label>

            {/* Notification Checkbox 3 */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink)' }}>
              <input 
                type="checkbox"
                checked={autoInvoice}
                onChange={(e) => setAutoInvoice(e.target.checked)}
                style={{ width: '16px', height: '16px', marginTop: '3px', accentColor: 'var(--accent)' }}
              />
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>
                  {language === 'ml' ? 'ഓട്ടോമാറ്റിക് ഇൻവോയ്സ് സിങ്ക്' : 'Automated Invoice Sync'}
                </span>
                <span className="font-ml" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  {language === 'ml' 
                    ? 'ക്യാമറ വഴിയോ വാട്സ്ആപ്പ് വഴിയോ വരുന്ന ബില്ലുകൾ സ്വയം ഇൻവെന്ററിയിലേക്ക് ചേർക്കുക' 
                    : 'Auto-sync scanned bill quantities into active stock levels upon verification'}
                </span>
              </div>
            </label>

            {/* Data Privacy & Backup Card */}
            <div style={{ 
              padding: '14px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--tint)',
              border: '1px solid var(--line)',
              marginTop: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-d)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '4px' }}>
                <Lock size={14} />
                <span>{language === 'ml' ? 'ഡാറ്റാ സംരക്ഷണം ഉറപ്പാണ്' : 'Privacy & Daily Backup Guaranteed'}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                {language === 'ml'
                  ? 'നിങ്ങളുടെ ഉപഭോക്താക്കളുടെ വിവരങ്ങളും ബില്ലുകളും സ്വകാര്യമായി സൂക്ഷിക്കപ്പെടുന്നു. എല്ലാ ദിവസവും പുലർച്ചെ 4 മണിക്ക് ഓട്ടോമാറ്റിക് ക്ലൗഡ് ബാക്കപ്പ് പൂർത്തിയാകുന്നു.'
                  : 'All business accounts and customer receipts are private and protected. Automated backups occur daily at 04:00 AM.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isPrefsSaving}
              className="btn-primary"
              style={{ marginTop: 'auto', padding: '10px 18px', width: '100%' }}
            >
              <Save size={16} />
              <span>
                {isPrefsSaving 
                  ? (language === 'ml' ? 'സേവ് ചെയ്യുന്നു...' : 'Saving Preferences...') 
                  : (isPrefsSaved ? '✓ Saved Successfully!' : (language === 'ml' ? 'ക്രമീകരണങ്ങൾ സേവ് ചെയ്യുക' : 'Save Preferences'))}
              </span>
            </button>

          </div>
        </form>

      </div>

    </div>
  );
};
