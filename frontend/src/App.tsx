import React, { useState, useEffect } from 'react';
import type { Language, NavTab, StoreProfile } from './types';
import './styles/dashboard.css';
import { STORE_PROFILE } from './mockData';
import { getStoreSettings, updateStoreProfile, getAuthToken, clearAuthToken } from './api/client';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Overview } from './components/Overview';
import { VoiceAgent } from './components/VoiceAgent';
import { InvoiceParser } from './components/InvoiceParser';
import { WhatsAppHub } from './components/WhatsAppHub';
import { InventoryManager } from './components/InventoryManager';
import { Appointments } from './components/Appointments';
import { StoreSettings } from './components/StoreSettings';
import { VoiceModal } from './components/VoiceModal';
import { KadaIconSprite } from './components/ui';

interface AuthSession {
  phone: string;
  authenticated: boolean;
  token?: string;
  loginTime?: string;
}

function getStoredAuth(): AuthSession | null {
  try {
    const raw = localStorage.getItem('kada_auth_session');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function isDashboardRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path.startsWith('/dashboard') || hash.includes('dashboard') || hash.includes('app');
}

export function App() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => getStoredAuth());
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => isDashboardRoute() ? 'app' : 'landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('kada_language');
      if (saved === 'en') return 'en';
      if (saved === 'ml') {
        // User requested replace Malayalam with English as default
        localStorage.setItem('kada_language', 'en');
        return 'en';
      }
    } catch {}
    return 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('kada_language', lang);
    } catch {}
  };
  const [autoMode, setAutoMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kada_auto_mode');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const handleToggleAutoMode = () => {
    setAutoMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('kada_auto_mode', String(next));
      } catch {}
      return next;
    });
  };

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(() => {
    try {
      const saved = localStorage.getItem('kada_store_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return STORE_PROFILE;
  });

  useEffect(() => {
    getStoreSettings().then(res => {
      if (res?.profile) {
        setStoreProfile(prev => {
          try {
            const saved = localStorage.getItem('kada_store_profile');
            if (saved) return JSON.parse(saved);
          } catch {}
          return prev;
        });
      }
    }).catch(console.warn);
  }, []);

  const handleUpdateProfile = async (newProfile: Partial<StoreProfile>): Promise<StoreProfile> => {
    try {
      const updated = await updateStoreProfile(newProfile);
      setStoreProfile(updated);
      try {
        localStorage.setItem('kada_store_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    } catch {
      const fallback: StoreProfile = { ...storeProfile, ...newProfile } as StoreProfile;
      setStoreProfile(fallback);
      try {
        localStorage.setItem('kada_store_profile', JSON.stringify(fallback));
      } catch {}
      return fallback;
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const dashboard = isDashboardRoute();
      setViewMode(dashboard ? 'app' : 'landing');
      if (dashboard) document.documentElement.classList.remove('kada-lock');
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    if (isDashboardRoute()) {
      document.documentElement.classList.remove('kada-lock');
    }
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleLaunchApp = () => {
    if (!authSession?.authenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.history.pushState({}, '', '/dashboard');
    }
    document.documentElement.classList.remove('kada-lock');
    setViewMode('app');
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (rawPhone: string, authData?: any) => {
    const cleanDigits = rawPhone.replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;
    const token = authData?.token || getAuthToken() || `kada_jwt_${Date.now()}`;
    const session: AuthSession = {
      phone: formattedPhone,
      authenticated: true,
      token,
      loginTime: new Date().toISOString()
    };
    setAuthSession(session);

    const isDemo = formattedPhone === '+91 94471 23456';
    const profileFromBackend = authData?.profile;

    let finalProfile: StoreProfile;
    if (profileFromBackend && profileFromBackend.name) {
      finalProfile = {
        ...profileFromBackend,
        phone: formattedPhone
      };
    } else if (isDemo) {
      finalProfile = {
        ...STORE_PROFILE,
        phone: formattedPhone
      };
    } else {
      // Registered as a brand-new user (not Suresh)
      finalProfile = {
        name: 'New Enterprise',
        nameMl: 'പുതിയ കട',
        owner: `Merchant (${cleanDigits})`,
        ownerMl: 'വ്യാപാരി',
        location: 'Kerala, India',
        gstin: '',
        phone: formattedPhone,
        monthlyRevenue: 0,
        cashInHand: 0,
        pendingInvoices: 0,
        whatsappQueriesToday: 0,
        tasksAutoCompleted: 100
      };
    }

    setStoreProfile(finalProfile);
    try {
      localStorage.setItem('kada_auth_session', JSON.stringify(session));
      localStorage.setItem('kada_store_profile', JSON.stringify(finalProfile));
    } catch {}
    setIsLoginModalOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.history.pushState({}, '', '/dashboard');
    }
    document.documentElement.classList.remove('kada-lock');
    setViewMode('app');
  };

  const handleQuickTry = () => {
    setIsLoginModalOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.history.pushState({}, '', '/dashboard');
    }
    document.documentElement.classList.remove('kada-lock');
    setViewMode('app');
  };

  const handleLogout = () => {
    setAuthSession(null);
    clearAuthToken();
    try {
      localStorage.removeItem('kada_auth_session');
      localStorage.removeItem('kada_store_profile');
    } catch {}
    setStoreProfile(STORE_PROFILE);
    handleBackToLanding();
  };

  const [stockRefreshKey, setStockRefreshKey] = useState(0);

  const handleBackToLanding = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setViewMode('landing');
  };

  const handleVoiceCommandSelected = (_cmdText: string) => {
    setStockRefreshKey(k => k + 1);
    handleLaunchApp();
    setCurrentTab('inventory');
  };

  if (viewMode === 'landing') {
    return (
      <>
        <KadaIconSprite />
        <LandingPage
          language={language}
          onLanguageChange={handleLanguageChange}
          onLaunchApp={handleLaunchApp}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          onOpenLogin={handleOpenLogin}
        />
        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          language={language}
          onSelectCommand={handleVoiceCommandSelected}
        />
        <LoginModal
          open={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
          onQuickTry={handleQuickTry}
        />
      </>
    );
  }

  return (
    <>
      <KadaIconSprite />
      <div className="app">
        {/* Sidebar (desktop ≥ 900 px) */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          language={language}
          onBackToLanding={handleBackToLanding}
          storeProfile={storeProfile}
          onLogout={handleLogout}
          onLanguageChange={handleLanguageChange}
          autoMode={autoMode}
          onToggleAutoMode={handleToggleAutoMode}
        />

        {/* Main column */}
        <div>
          {/* Top bar (mobile) */}
          <Header
            currentTab={currentTab}
            language={language}
            onLanguageChange={handleLanguageChange}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onBackToLanding={handleBackToLanding}
            storeProfile={storeProfile}
          />

          <main className="main">
            {currentTab === 'overview' && (
              <Overview
                key={stockRefreshKey}
                language={language}
                onNavigate={setCurrentTab}
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                storeProfile={storeProfile}
                autoMode={autoMode}
                onToggleAutoMode={handleToggleAutoMode}
              />
            )}
            {currentTab === 'whatsapp' && <WhatsAppHub language={language} />}
            {currentTab === 'invoices' && <InvoiceParser language={language} />}
            {currentTab === 'voice-agent' && (
              <VoiceAgent 
                language={language} 
                onStockUpdated={() => setStockRefreshKey(k => k + 1)} 
              />
            )}
            {currentTab === 'inventory' && (
              <InventoryManager 
                key={stockRefreshKey} 
                language={language} 
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)} 
              />
            )}
            {currentTab === 'appointments' && <Appointments language={language} />}
            {currentTab === 'settings' && (
              <StoreSettings 
                language={language} 
                storeProfile={storeProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </main>
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Voice sheet */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        onSelectCommand={handleVoiceCommandSelected}
      />

      {/* Login modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onQuickTry={handleQuickTry}
      />
    </>
  );
}

export default App;
