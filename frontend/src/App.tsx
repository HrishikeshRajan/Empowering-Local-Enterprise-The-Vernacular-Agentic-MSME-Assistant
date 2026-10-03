import React, { useState, useEffect } from 'react';
import type { Language, NavTab } from './types';
import './styles/dashboard.css';
import { LandingPage } from './components/LandingPage';
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

function isDashboardRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path.startsWith('/dashboard') || hash.includes('dashboard') || hash.includes('app');
}

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => isDashboardRoute() ? 'app' : 'landing');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [language, setLanguage] = useState<Language>('ml');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const dashboard = isDashboardRoute();
      setViewMode(dashboard ? 'app' : 'landing');
      if (dashboard) document.documentElement.classList.remove('kada-lock');
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    if (isDashboardRoute()) document.documentElement.classList.remove('kada-lock');
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleLaunchApp = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.history.pushState({}, '', '/dashboard');
    }
    document.documentElement.classList.remove('kada-lock');
    setViewMode('app');
  };

  const handleBackToLanding = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setViewMode('landing');
  };

  const handleVoiceCommandSelected = (_cmdText: string) => {
    handleLaunchApp();
    setCurrentTab('voice-agent');
  };

  if (viewMode === 'landing') {
    return (
      <>
        <KadaIconSprite />
        <LandingPage
          language={language}
          onLanguageChange={setLanguage}
          onLaunchApp={handleLaunchApp}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          language={language}
          onSelectCommand={handleVoiceCommandSelected}
        />
      </>
    );
  }

  return (
    <>
      <KadaIconSprite />
      <div className="app">
        {/* Ambient background (desktop) */}
        <div className="aura" aria-hidden="true"><i /><i /><i /></div>

        {/* Sidebar (desktop ≥ 900 px) */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          language={language}
          onBackToLanding={handleBackToLanding}
        />

        {/* Main column */}
        <div>
          {/* Top bar (mobile) */}
          <Header
            currentTab={currentTab}
            language={language}
            onLanguageChange={setLanguage}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onBackToLanding={handleBackToLanding}
          />

          <main className="main">
            {currentTab === 'overview' && (
              <Overview
                language={language}
                onNavigate={setCurrentTab}
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              />
            )}
            {currentTab === 'whatsapp' && <WhatsAppHub language={language} />}
            {currentTab === 'invoices' && <InvoiceParser language={language} />}
            {currentTab === 'voice-agent' && <VoiceAgent language={language} />}
            {currentTab === 'inventory' && (
              <InventoryManager language={language} onOpenVoiceModal={() => setIsVoiceModalOpen(true)} />
            )}
            {currentTab === 'appointments' && <Appointments language={language} />}
            {currentTab === 'settings' && <StoreSettings language={language} />}
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
    </>
  );
}

export default App;
