import React, { useState } from 'react';
import type { Language } from '../types';
import { MOCK_VOICE_PRESETS } from '../mockData';
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Play, 
  Layers, 
  TrendingUp, 
  Zap, 
  Smartphone, 
  Lock,
  Receipt,
  QrCode,
  DollarSign,
  HeartHandshake
} from 'lucide-react';

interface LandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLaunchApp: () => void;
  onOpenVoiceModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onLanguageChange,
  onLaunchApp,
  onOpenVoiceModal
}) => {
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const currentPreset = MOCK_VOICE_PRESETS[activeVoiceIndex];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Sticky Glass Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(8, 12, 20, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  Sahāyi AI
                </span>
                <span className="font-ml" style={{ color: 'var(--emerald-light)', fontSize: '0.95rem', fontWeight: 700 }}>
                  (സഹായി)
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {language === 'ml' ? 'പ്രാദേശിക വ്യാപാര സഹായി' : 'Smart Assistant for Local MSMEs'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="landing-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              {language === 'ml' ? 'സവിശേഷതകൾ' : 'Features'}
            </a>
            <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              {language === 'ml' ? 'പ്രവർത്തന രീതി' : 'How It Works'}
            </a>
            <a href="#benefits" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              {language === 'ml' ? 'പ്രയോജനങ്ങൾ' : 'Why Sahāyi'}
            </a>
            <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              {language === 'ml' ? 'വില വിവരങ്ങൾ' : 'Pricing'}
            </a>
          </div>

          {/* Right: Language Toggle & Launch App CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Language Switcher */}
            <div style={{ 
              display: 'flex', 
              background: 'rgba(255, 255, 255, 0.06)', 
              padding: '2px', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => onLanguageChange('en')}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: language === 'en' ? 'var(--emerald-main)' : 'transparent',
                  color: language === 'en' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ml')}
                className="font-ml"
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: language === 'ml' ? 'var(--emerald-main)' : 'transparent',
                  color: language === 'ml' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                മലയാളം
              </button>
            </div>

            {/* Launch App Button */}
            <button
              onClick={onLaunchApp}
              className="btn-primary animate-glow"
              style={{ padding: '9px 18px', fontSize: '0.85rem' }}
            >
              <span className="font-ml">
                {language === 'ml' ? 'ലൈവ് ഡെമോ തുറക്കുക' : 'Launch Live Demo'}
              </span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '70px 24px 80px 24px', 
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Pill Badge */}
          <div className="glass-badge glass-badge-emerald" style={{ padding: '8px 18px', fontSize: '0.85rem', marginBottom: '24px' }}>
            <Sparkles size={16} />
            <span>
              {language === 'ml' 
                ? 'നിങ്ങളുടെ കടയ്ക്ക് ഒരു വിശ്വസ്ത ഡിജിറ്റൽ സഹായി' 
                : 'Smart Voice Operations Assistant for Local Enterprises'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display" style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 4rem)', 
            fontWeight: 800, 
            lineHeight: 1.15, 
            letterSpacing: '-0.03em', 
            color: '#fff',
            maxWidth: '960px'
          }}>
            {language === 'ml' ? (
              <span className="font-ml">
                നിങ്ങളുടെ കടയിലെ കാര്യങ്ങൾ മലയാളത്തിൽ പറയൂ, <span style={{ color: 'var(--emerald-light)' }}>സഹായി കൃത്യമായി ചെയ്തുതീർക്കും!</span>
              </span>
            ) : (
              <span>
                Run Your Local Enterprise With Ease Using <span style={{ color: 'var(--emerald-light)' }}>Voice & WhatsApp</span>
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: 'var(--text-secondary)', 
            maxWidth: '820px', 
            marginTop: '20px', 
            lineHeight: 1.6 
          }}>
            {language === 'ml' ? (
              <span className="font-ml">
                സപ്ലയർ ബില്ലുകൾ ഫോട്ടോ എടുത്ത് രേഖപ്പെടുത്താം, പുതിയ സ്റ്റോക്കുകൾ ഫോണിൽ സംസാരിച്ച് ചേർക്കാം, കസ്റ്റമർമാർക്ക് WhatsApp വഴി നേരിട്ട് ബില്ലും UPI പേയ്മെന്റ് ലിങ്കുകളും അയക്കാം.
              </span>
            ) : (
              <span>
                Manage stock, read messy paper bills with your phone camera, and answer customer inquiries on WhatsApp with instant UPI payment links — all hands-free using natural voice commands.
              </span>
            )}
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={onLaunchApp}
              className="btn-primary animate-glow"
              style={{ padding: '14px 28px', fontSize: '1rem', gap: '10px' }}
            >
              <Zap size={18} />
              <span className="font-ml">
                {language === 'ml' ? 'കടയുടെ ഡാഷ്‌ബോർഡ് കാണുക' : 'Explore Merchant Dashboard'}
              </span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="btn-secondary"
              style={{ padding: '14px 24px', fontSize: '1rem', gap: '10px' }}
            >
              <Mic size={18} color="var(--emerald-light)" />
              <span className="font-ml">
                {language === 'ml' ? 'ശബ്ദം പരീക്ഷിക്കുക' : 'Try Voice Command'}
              </span>
            </button>
          </div>

          {/* Key Merchant Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            width: '100%', 
            maxWidth: '1000px', 
            marginTop: '60px' 
          }}>
            <div className="glass-panel" style={{ padding: '18px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                {language === 'ml' ? 'മിന്നൽ വേഗത' : '< 0.3s'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'ml' ? 'ശബ്ദം ഉടൻ മനസ്സിലാക്കുന്നു' : 'Instant Voice Understanding'}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '18px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c7d2fe' }}>100%</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'ml' ? 'കണക്കുകളിലെ കൃത്യത' : 'Calculation & GST Accuracy'}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '18px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--saffron-light)' }}>
                {language === 'ml' ? 'ലളിതം' : 'Zero Setup'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'ml' ? 'ഫോണിൽ ഉടൻ തുടങ്ങാം' : 'Works on Any Smartphone'}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '18px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>24/7</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'ml' ? 'വാട്സ്ആപ്പ് ഓർഡറുകൾ' : 'WhatsApp Customer Service'}
              </p>
            </div>
          </div>

          {/* Interactive Voice Demo Preview Card */}
          <div className="glass-panel" style={{ 
            width: '100%', 
            maxWidth: '1100px', 
            marginTop: '40px', 
            padding: '24px', 
            border: '1px solid var(--border-glow)',
            textAlign: 'left',
            boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--emerald-main)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                  {language === 'ml' ? 'തത്സമയ ശബ്ദ പരീക്ഷണം' : 'Interactive Voice-to-Action Demo'}
                </span>
                <span className="glass-badge glass-badge-emerald" style={{ fontSize: '0.7rem' }}>
                  {language === 'ml' ? 'സജീവം' : 'Ready'}
                </span>
              </div>
              
              <button 
                onClick={onLaunchApp}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--emerald-light)', 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {language === 'ml' ? 'പൂർണ്ണ ഡാഷ്‌ബോർഡ് കാണുക →' : 'Open Full Screen Dashboard →'}
              </button>
            </div>

            {/* Split Visual: Input Command vs Execution */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
              
              {/* Left: Malayalam Voice Input */}
              <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Mic size={16} color="var(--emerald-light)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {language === 'ml' ? 'താഴെയുള്ള സാമ്പിൾ തിരഞ്ഞെടുക്കുക:' : 'Select a sample voice command:'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {MOCK_VOICE_PRESETS.slice(0, 3).map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveVoiceIndex(idx)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: activeVoiceIndex === idx ? 'var(--emerald-main)' : 'rgba(255, 255, 255, 0.05)',
                        background: activeVoiceIndex === idx ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      <p className="font-ml" style={{ fontWeight: 600 }}>"{p.malayalamAudioText}"</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.englishTranslation}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: How the Assistant Works */}
              <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--emerald-light)' }}>
                    {language === 'ml' ? 'പ്രവർത്തന ഘട്ടങ്ങൾ' : 'Step-by-Step Action'}
                  </span>
                  <span className="glass-badge glass-badge-emerald" style={{ fontSize: '0.68rem' }}>
                    {language === 'ml' ? 'പരിശോധിച്ചു ഉറപ്പുവരുത്തി' : 'Verified Accurate'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.3)', borderLeft: '3px solid var(--emerald-main)' }}>
                    <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>1. {language === 'ml' ? 'ശബ്ദം തിരിച്ചറിഞ്ഞു:' : 'Understood:'}</span> "{currentPreset.malayalamAudioText}"
                  </div>

                  <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.3)', borderLeft: '3px solid var(--indigo-main)' }}>
                    <span style={{ color: '#a5b4fc', fontWeight: 600 }}>2. {language === 'ml' ? 'നടപടി എടുത്തു:' : 'Action Taken:'}</span> {activeVoiceIndex === 0 ? 'തക്കാളി സ്റ്റോക്ക് 15 കിലോ വർദ്ധിപ്പിച്ചു, വില ₹40/kg നിശ്ചയിച്ചു' : activeVoiceIndex === 1 ? 'അപ്പോയിന്റ്മെന്റ് ബുക്കിംഗ് കലണ്ടറിൽ ഉറപ്പിച്ചു' : 'ബില്ലും UPI പേയ്മെന്റ് ലിങ്കും തയ്യാറാക്കി'}
                  </div>

                  <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.3)', borderLeft: '3px solid var(--saffron-main)' }}>
                    <span style={{ color: 'var(--saffron-light)', fontWeight: 600 }}>3. {language === 'ml' ? 'വില പരിശോധന:' : 'Price Verified:'}</span> അളവും തുകയും പരിശോധിച്ചു, തെറ്റുകളൊന്നുമില്ലെന്ന് ഉറപ്പുവരുത്തി
                  </div>

                  <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid var(--emerald-main)' }}>
                    <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>4. {language === 'ml' ? 'പൂർത്തിയായി:' : 'Completed:'}</span> കടയുടെ കണക്കുകളിൽ സുരക്ഷിതമായി രേഖപ്പെടുത്തി കഴിഞ്ഞു ✓
                  </div>
                </div>

                <button
                  onClick={onLaunchApp}
                  className="btn-primary"
                  style={{ marginTop: 'auto', width: '100%', fontSize: '0.85rem', padding: '10px' }}
                >
                  <Sparkles size={16} />
                  <span>{language === 'ml' ? 'ഡാഷ്‌ബോർഡിൽ പരീക്ഷിക്കുക →' : 'Try in Full Dashboard →'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. The Problem vs. Solution Section */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="glass-badge glass-badge-saffron" style={{ marginBottom: '12px' }}>
              {language === 'ml' ? 'കച്ചവടത്തിലെ മാറ്റങ്ങൾ' : 'The Real Difference'}
            </span>
            <h2 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
              {language === 'ml' 
                ? 'പഴയ ബുദ്ധിമുട്ടുകൾക്ക് വിട, പുതിയ രീതിയിലേക്ക് സ്വാഗതം' 
                : 'Say Goodbye to Manual Headaches'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '680px', margin: '12px auto 0 auto' }}>
              {language === 'ml'
                ? 'ദിവസേനയുള്ള കണക്കുകൾ എഴുതിവെക്കാനും കസ്റ്റമർ മെസ്സേജുകൾക്ക് മറുപടി നൽകാനും ഇനി സമയം പാഴാക്കേണ്ടതില്ല.'
                : 'Save 3 to 4 hours every single day by letting your vernacular assistant handle repetitive business operations.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* The Old Way */}
            <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(244, 63, 94, 0.2)', background: 'rgba(244, 63, 94, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="glass-badge glass-badge-rose">
                  {language === 'ml' ? 'പഴയ രീതി' : 'Without Sahāyi AI'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fda4af', marginBottom: '16px' }}>
                {language === 'ml' ? 'നിങ്ങൾ നേരിടുന്ന പ്രശ്നങ്ങൾ' : 'Daily Manual Frustrations'}
              </h3>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--rose-main)', fontWeight: 700 }}>✕</span>
                  <span>ദിവസേനയുള്ള വിൽപനയും ബാക്കി തുകയും പഴയ കണക്കുപുസ്തകത്തിൽ കൈകൊണ്ട് എഴുതിവെക്കേണ്ടി വരുന്നു.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--rose-main)', fontWeight: 700 }}>✕</span>
                  <span>കടയിൽ തിരക്കുള്ള സമയത്ത് WhatsApp-ൽ വരുന്ന കസ്റ്റമർ ഓർഡറുകൾ ശ്രദ്ധിക്കാൻ കഴിയാതെ പോകുന്നു.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--rose-main)', fontWeight: 700 }}>✕</span>
                  <span>ഇംഗ്ലീഷിലുള്ള സങ്കീർണ്ണമായ കമ്പ്യൂട്ടർ സോഫ്റ്റ്‌വെയറുകൾ ഉപയോഗിക്കാനുള്ള പ്രയാസം.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--rose-main)', fontWeight: 700 }}>✕</span>
                  <span>പ്രധാനപ്പെട്ട സാധനങ്ങൾ സ്റ്റോക്ക് തീരുന്നത് മുൻകൂട്ടി അറിയാൻ കഴിയാത്തത് മൂലം വിൽപന നഷ്ടപ്പെടുന്നു.</span>
                </li>
              </ul>
            </div>

            {/* The Sahāyi AI Way */}
            <div className="glass-panel" style={{ padding: '28px', border: '1px solid var(--border-glow)', background: 'rgba(16, 185, 129, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="glass-badge glass-badge-emerald">
                  {language === 'ml' ? 'സഹായിക്കൊപ്പം' : 'With Sahāyi AI'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--emerald-light)', marginBottom: '16px' }}>
                {language === 'ml' ? 'ലളിതവും സമാധാനപരവുമായ കച്ചവടം' : 'Effortless Automated Operations'}
              </h3>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>മലയാളത്തിൽ സംസാരിക്കാം:</strong> വിൽപനയും വിലയും മലയാളത്തിൽ വെറുതെ പറഞ്ഞാൽ മതി, റെക്കോർഡുകളിൽ സ്വയം ചേരും.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>24 മണിക്കൂറും WhatsApp മറുപടി:</strong> സാധനങ്ങളുടെ വില പറയുകയും ഓർഡറുകൾ ഉറപ്പിക്കുകയും തുകയ്ക്കുള്ള UPI QR കോഡ് അയക്കുകയും ചെയ്യും.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>ബില്ലുകൾ ഫോട്ടോ എടുക്കാം:</strong> സപ്ലയർമാർ തരുന്ന ബില്ലിന്റെ ഫോട്ടോ എടുത്താൽ ഉൽപ്പന്നങ്ങളും ജിഎസ്ടിയും സ്വയം രേഖപ്പെടുത്തും.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>സ്റ്റോക്ക് തീരാറാകുമ്പോൾ ഓർമ്മപ്പെടുത്തും:</strong> സാധനങ്ങൾ തീരുന്നതിന് മുമ്പ് തന്നെ ഓർഡർ ചെയ്യാനുള്ള നിർദ്ദേശം നൽകും.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Why Merchants Love Sahāyi AI */}
      <section id="benefits" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="glass-badge glass-badge-emerald" style={{ marginBottom: '12px' }}>
              {language === 'ml' ? 'പ്രധാന നേട്ടങ്ങൾ' : 'Merchant Peace of Mind'}
            </span>
            <h2 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
              {language === 'ml' 
                ? 'എന്തുകൊണ്ട് ചെറുകിട വ്യാപാരികൾ സഹായി ഇഷ്ടപ്പെടുന്നു?' 
                : 'Built With Care for Small Businesses'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '680px', margin: '12px auto 0 auto' }}>
              {language === 'ml'
                ? 'സാങ്കേതിക ജ്ഞാനമില്ലാത്ത സാധാരണക്കാർക്കും എളുപ്പത്തിൽ ഉപയോഗിക്കാൻ സാധിക്കുന്ന വിധത്തിലാണ് ഇത് രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്.'
                : 'Simple, private, reliable, and respectful of your local language and daily business workflow.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {/* Benefit 1 */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-light)' }}>
                <Mic size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {language === 'ml' ? 'സ്വാഭാവിക മലയാള സംസാരം' : 'Natural Vernacular Speech'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {language === 'ml'
                  ? 'തൃശ്ശൂർ, മലബാർ, തിരുവിതാംകൂർ ശൈലികളിലുള്ള സംസാരവും പ്രാദേശിക വാക്കുകളും തെറ്റുകൂടാതെ തിരിച്ചറിയുന്നു.'
                  : 'Understands regional dialects and colloquial business terms without forcing you to speak formal English.'}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {language === 'ml' ? 'വിലയും കണക്കുകളും 100% കൃത്യം' : 'Zero Calculation Errors'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {language === 'ml'
                  ? 'ഓരോ ബില്ലിലെയും തുകകളും ജിഎസ്ടിയും രണ്ടുതവണ പരിശോധിച്ച് ഉറപ്പുവരുത്തിയ ശേഷം മാത്രമേ സേവ് ചെയ്യുകയുള്ളൂ.'
                  : 'Every single receipt, tax calculation, and price entry is cross-checked to ensure complete mathematical accuracy.'}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--saffron-light)' }}>
                <Lock size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {language === 'ml' ? 'പൂർണ്ണ സുരക്ഷിതത്വവും സ്വകാര്യതയും' : '100% Private & Protected'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {language === 'ml'
                  ? 'നിങ്ങളുടെ കടയിലെ വിൽപന വിവരങ്ങളും കസ്റ്റമർ ഫോൺ നമ്പറുകളും നിങ്ങളുടെ സ്വന്തം നിയന്ത്രണത്തിൽ മാത്രം സുരക്ഷിതമായിരിക്കും.'
                  : 'Your customer records, turnover, and supplier bills are encrypted and private to your business.'}
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25d366' }}>
                <QrCode size={24} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {language === 'ml' ? 'തൽക്ഷണ UPI പേയ്മെന്റുകൾ' : 'Instant UPI Payments'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {language === 'ml'
                  ? 'കസ്റ്റമർമാർക്ക് ബില്ലിനൊപ്പം നേരിട്ട് GPay, PhonePe, Paytm വഴി പണമടയ്ക്കാനുള്ള ലിങ്കുകളും QR കോഡുകളും നൽകുന്നു.'
                  : 'Customers receive instant payment QR links in chat, making collections fast and reducing pending credit.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Pricing Tiers */}
      <section id="pricing" style={{ padding: '80px 24px', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="glass-badge glass-badge-emerald" style={{ marginBottom: '12px' }}>
              {language === 'ml' ? 'വില വിവരങ്ങൾ' : 'Transparent Pricing'}
            </span>
            <h2 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
              {language === 'ml' ? 'നിങ്ങളുടെ കടയ്ക്കനുയോജ്യമായ പ്ലാനുകൾ' : 'Affordable Plans For Every Merchant'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '680px', margin: '12px auto 0 auto' }}>
              {language === 'ml'
                ? 'സൗജന്യമായി പരീക്ഷിച്ചുനോക്കാം. ആവശ്യമനുസരിച്ച് മാത്രം മാറ്റങ്ങൾ വരുത്താം.'
                : 'Start completely free. Upgrade only when your order volume grows.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {/* Free Tier */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span className="glass-badge" style={{ marginBottom: '8px' }}>
                  {language === 'ml' ? 'സൗജന്യം' : 'Free Trial'}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {language === 'ml' ? 'തുടക്കക്കാർക്ക്' : 'Free Trial'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {language === 'ml' ? 'കടയിൽ പരീക്ഷിച്ചു നോക്കാൻ' : 'Perfect for testing in your shop'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>₹0</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {language === 'ml' ? '/ എപ്പോഴും' : '/ forever'}
                </span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>✓ 50 WhatsApp മെസ്സേജുകൾ/മാസം</li>
                <li>✓ 10 ബില്ലുകൾ സ്കാൻ ചെയ്യാം</li>
                <li>✓ മലയാളം ശബ്ദ സഹായി</li>
                <li>✓ ഒരൊറ്റ ഫോണിൽ ഉപയോഗിക്കാം</li>
              </ul>

              <button 
                onClick={onLaunchApp}
                className="btn-secondary" 
                style={{ marginTop: 'auto', width: '100%' }}
              >
                {language === 'ml' ? 'സൗജന്യമായി തുടങ്ങൂ' : 'Start Free'}
              </button>
            </div>

            {/* Starter Tier (Highlighted) */}
            <div className="glass-panel" style={{ 
              padding: '28px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              border: '2px solid var(--emerald-main)',
              background: 'rgba(16, 185, 129, 0.06)',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--emerald-main)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: '12px'
              }}>
                {language === 'ml' ? 'പലചരക്ക് കടകൾക്ക് ഏറ്റവും അനുയോജ്യം' : 'MOST POPULAR FOR SHOPS'}
              </span>

              <div>
                <span className="glass-badge glass-badge-emerald" style={{ marginBottom: '8px' }}>
                  {language === 'ml' ? 'സ്റ്റാർട്ടർ' : 'Starter'}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Starter</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {language === 'ml' ? 'റീട്ടെയിൽ & പലചരക്ക് കടകൾക്ക്' : 'For retail provisions & spice shops'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--emerald-light)' }}>₹499</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {language === 'ml' ? '/ മാസം' : '/ month'}
                </span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <li>✓ <strong>500 WhatsApp മെസ്സേജുകൾ</strong>/മാസം</li>
                <li>✓ <strong>പരിധിയില്ലാതെ</strong> ബില്ലുകൾ സ്കാൻ ചെയ്യാം</li>
                <li>✓ പൂർണ്ണ മലയാളം ശബ്ദ സഹായി</li>
                <li>✓ തൽക്ഷണ UPI പേയ്മെന്റ് QR കോഡ്</li>
                <li>✓ സ്റ്റോക്ക് തീരാറാകുമ്പോൾ മുന്നറിയിപ്പുകൾ</li>
              </ul>

              <button 
                onClick={onLaunchApp}
                className="btn-primary" 
                style={{ marginTop: 'auto', width: '100%' }}
              >
                {language === 'ml' ? 'ലൈവ് ഡെമോ കാണുക' : 'Launch Live Demo'}
              </button>
            </div>

            {/* Pro Tier */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span className="glass-badge glass-badge-indigo" style={{ marginBottom: '8px' }}>
                  {language === 'ml' ? 'പ്രോ പ്ലാൻ' : 'Pro Plan'}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Pro</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {language === 'ml' ? 'മൊത്തക്കച്ചവടക്കാർക്കും ക്ലിനിക്കുകൾക്കും' : 'For wholesalers & busy clinics'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>₹1,499</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {language === 'ml' ? '/ മാസം' : '/ month'}
                </span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>✓ പരിധിയില്ലാത്ത WhatsApp കസ്റ്റമർ മെസ്സേജുകൾ</li>
                <li>✓ മലയാളം, തമിഴ്, ഹിന്ദി ഭാഷകൾ</li>
                <li>✓ അപ്പോയിന്റ്മെന്റ് & ബുക്കിംഗ് കലണ്ടർ</li>
                <li>✓ വാട്സ്ആപ്പ് സപ്പോർട്ട്</li>
                <li>✓ ഒന്നിൽക്കൂടുതൽ ഫോണുകളിൽ ഉപയോഗിക്കാം</li>
              </ul>

              <button 
                onClick={onLaunchApp}
                className="btn-secondary" 
                style={{ marginTop: 'auto', width: '100%' }}
              >
                {language === 'ml' ? 'പ്രോ തിരഞ്ഞെടുക്കൂ' : 'Explore Pro'}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FAQ Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              {language === 'ml' ? 'സാധാരണ സംശയങ്ങൾ (FAQ)' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                q: language === 'ml' ? "ഇതിന് സാധാരണ മലയാളം സംസാരം മനസ്സിലാകുമോ?" : "Does it really understand natural spoken Malayalam?",
                a: language === 'ml' ? "തീർച്ചയായും! തൃശ്ശൂർ, മലബാർ, തിരുവിതാംകൂർ തുടങ്ങി കേരളത്തിലെ വിവിധ പ്രാദേശിക ശൈലികളിലുള്ള സംസാരം സഹായി കൃത്യമായി മനസ്സിലാക്കുന്നു." : "Yes! The assistant is tuned for regional Malayalam accents and colloquial trade terms."
              },
              {
                q: language === 'ml' ? "കണക്കുകൂട്ടലുകളിൽ തെറ്റുകൾ വരാൻ സാധ്യതയുണ്ടോ?" : "Can there be any calculation errors in bills?",
                a: language === 'ml' ? "ഇല്ല. രേഖപ്പെടുത്തുന്നതിന് മുമ്പ് ഓരോ ഉൽപ്പന്നത്തിന്റെയും വിലയും ജിഎസ്ടിയും സ്വയം പരിശോധിച്ച് ഉറപ്പുവരുത്തുന്നതിനാൽ തെറ്റുകൾ ഉണ്ടാകുന്നില്ല." : "No. All numbers pass through automatic mathematical checks ensuring zero discrepancy with receipt totals."
              },
              {
                q: language === 'ml' ? "എന്റെ കടയിലെ വിവരങ്ങൾ സുരക്ഷിതമായിരിക്കുമോ?" : "Is my store and customer data safe?",
                a: language === 'ml' ? "അതെ. നിങ്ങളുടെ ഉപഭോക്താക്കളുടെ വിവരങ്ങളും വിൽപനക്കണക്കുകളും പൂർണ്ണമായും സ്വകാര്യമായിരിക്കും. ദിവസേന ഓട്ടോമാറ്റിക് ബാക്കപ്പും ഉറപ്പാക്കിയിട്ടുണ്ട്." : "Yes. All store records and customer communications are encrypted and 100% private to your shop."
              },
              {
                q: language === 'ml' ? "ഇത് ഉപയോഗിക്കാൻ വലിയ കമ്പ്യൂട്ടറോ ടെക്നിക്കൽ അറിവോ വേണമെന്നുണ്ടോ?" : "Do I need technical skills or a computer?",
                a: language === 'ml' ? "ആവശ്യമില്ല! സാധാരണ സ്മാർട്ട്ഫോണിലോ ടാബ്‌ലെറ്റിലോ വാട്സ്ആപ്പ് ഉപയോഗിക്കാൻ അറിയാവുന്ന ആർക്കും വളരെ എളുപ്പത്തിൽ ഇത് ഉപയോഗിക്കാം." : "Not at all. If you know how to use WhatsApp on your phone, you can use Sahāyi AI in minutes."
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="glass-panel"
                style={{ padding: '20px', cursor: 'pointer' }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                    {faq.q}
                  </h4>
                  <span style={{ fontSize: '1.2rem', color: 'var(--emerald-light)', marginLeft: '12px' }}>
                    {faqOpenIndex === idx ? '−' : '+'}
                  </span>
                </div>
                {faqOpenIndex === idx && (
                  <p style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ 
          maxWidth: '960px', 
          margin: '0 auto', 
          padding: '50px 32px', 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(99, 102, 241, 0.16) 100%)',
          border: '1px solid var(--border-glow)'
        }}>
          <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
            {language === 'ml' 
              ? 'നിങ്ങളുടെ കടയെ ഇന്ന് തന്നെ സഹായിയോടൊപ്പം മുന്നോട്ട് കൊണ്ടുപോകൂ!' 
              : 'Empower Your Shop With Sahāyi AI Today'}
            </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '12px auto 28px auto' }}>
            {language === 'ml'
              ? 'തത്സമയ ഡെമോയിൽ ബില്ലുകൾ സ്കാൻ ചെയ്തു നോക്കൂ, മലയാളത്തിൽ സംസാരിച്ച് സ്റ്റോക്ക് ചേർക്കൂ.'
              : 'Experience real bill scanning, voice operations, and WhatsApp customer service in the live interactive demo.'}
          </p>
          <button
            onClick={onLaunchApp}
            className="btn-primary animate-glow"
            style={{ padding: '14px 32px', fontSize: '1rem', gap: '10px' }}
          >
            <span>{language === 'ml' ? 'ലൈവ് ഡെമോ കാണുക' : 'Launch Interactive Demo'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 8. Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-subtle)', 
        padding: '32px 24px', 
        backgroundColor: '#05080f', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>Sahāyi AI (സഹായി)</span>
            <span>• {language === 'ml' ? 'കേരളത്തിലെ ചെറുകിട വ്യാപാരികൾക്കായി സമർപ്പിക്കുന്നു' : 'Dedicated to Local Enterprises in Kerala & India'}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>{language === 'ml' ? 'ഡാറ്റാ സംരക്ഷണം ഉറപ്പ്' : 'Private & Secure Data'}</span>
            <span>•</span>
            <span>{language === 'ml' ? 'ദിവസേന ബാക്കപ്പ്' : 'Daily Automated Backups'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
