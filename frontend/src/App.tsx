import React, { useState } from 'react';
import type { Language, NavTab } from './types';
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

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [language, setLanguage] = useState<Language>('ml');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleVoiceCommandSelected = (_cmdText: string) => {
    setViewMode('app');
    setCurrentTab('voice-agent');
  };

  // If in Landing Page view mode, render the rich public landing page
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage 
          language={language}
          onLanguageChange={setLanguage}
          onLaunchApp={() => setViewMode('app')}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />

        {/* Global Quick Voice Modal */}
        <VoiceModal 
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          language={language}
          onSelectCommand={handleVoiceCommandSelected}
        />
      </>
    );
  }

  // If in App view mode, render the merchant operations dashboard
  return (
    <div className="app-container">
      {/* Desktop Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        language={language} 
        onBackToLanding={() => setViewMode('landing')}
      />

      {/* Main Workspace Area */}
      <main className="main-content">
        {/* Top Navigation & Store Header */}
        <Header 
          currentTab={currentTab}
          language={language}
          onLanguageChange={setLanguage}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          onBackToLanding={() => setViewMode('landing')}
        />

        {/* Tab Route Switching */}
        {currentTab === 'overview' && (
          <Overview 
            language={language}
            onNavigate={setCurrentTab}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentTab === 'voice-agent' && (
          <VoiceAgent 
            language={language}
          />
        )}

        {currentTab === 'invoices' && (
          <InvoiceParser 
            language={language}
          />
        )}

        {currentTab === 'whatsapp' && (
          <WhatsAppHub 
            language={language}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryManager 
            language={language}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentTab === 'appointments' && (
          <Appointments 
            language={language}
          />
        )}

        {currentTab === 'settings' && (
          <StoreSettings 
            language={language}
          />
        )}
      </main>

      {/* Thumb-Friendly Mobile Bottom Navigation */}
      <MobileBottomNav 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Floating Quick Voice Modal */}
      <VoiceModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        onSelectCommand={handleVoiceCommandSelected}
      />
    </div>
  );
}

export default App;
