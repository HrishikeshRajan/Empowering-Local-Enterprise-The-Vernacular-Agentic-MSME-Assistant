import React, { useState } from 'react';
import type { Language, NavTab } from '../types';
import {
  KadaPageHeader, KadaSwitch, KadaTiles, KadaTile,
  KadaTwo, KadaCard, KadaRow, KadaDot, KadaBadge, KadaButton, KadaIcon,
} from './ui';
import { STORE_PROFILE, INITIAL_AGENT_LOGS } from '../mockData';

interface OverviewProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ language, onNavigate, onOpenVoiceModal }) => {
  const [autoMode, setAutoMode] = useState(true);

  const agentLabel = autoMode
    ? (language === 'ml' ? 'Kada സന്ദേശങ്ങൾ കൈകാര്യം ചെയ്യുന്നു' : 'Kada is handling messages')
    : (language === 'ml' ? 'നിങ്ങൾ നിയന്ത്രണത്തിലാണ്' : 'You are in control');
  const agentSub = autoMode
    ? (language === 'ml' ? 'ഓഫ് ചെയ്‌ത് നിങ്ങൾ ഏറ്റെടുക്കാം.' : 'Switch off to take control yourself.')
    : (language === 'ml' ? 'പുതിയ സന്ദേശങ്ങൾ കാത്തിരിക്കും.' : 'New messages wait for you.');

  // Pull recent flagged items from agent logs
  const flagged = INITIAL_AGENT_LOGS.filter(l => l.status === 'FLAGGED').slice(0, 2);
  const recent = INITIAL_AGENT_LOGS.filter(l => l.status === 'SUCCESS').slice(0, 3);

  return (
    <section className="pg on" id="p-home">
      <KadaPageHeader
        eyebrow={language === 'ml' ? 'നമസ്കാരം' : 'Good morning'}
        title={language === 'ml' ? `സ്വാഗതം, ${STORE_PROFILE.ownerMl}` : `Welcome, ${STORE_PROFILE.owner.split(' ')[0]}`}
        subtitle={language === 'ml' ? 'Kada ഇന്ന് ഇത് ചെയ്തു.' : 'Here is what Kada handled for you today.'}
      />

      {/* Agent mode toggle */}
      <KadaSwitch
        checked={autoMode}
        onChange={setAutoMode}
        label="Auto mode"
        title={agentLabel}
        subtitle={agentSub}
      />

      {/* Stat tiles */}
      <KadaTiles>
        <KadaTile value={STORE_PROFILE.tasksAutoCompleted} label={language === 'ml' ? 'ബുക്കിംഗ്' : 'Bookings'} />
        <KadaTile value="5" label={language === 'ml' ? 'ബില്ലുകൾ' : 'Bills read'} />
        <KadaTile value={STORE_PROFILE.whatsappQueriesToday} label={language === 'ml' ? 'ചാറ്റ്' : 'Chats handled'} />
        <KadaTile value={flagged.length || 2} label={language === 'ml' ? 'ശ്രദ്ധ വേണം' : 'Need you'} warn />
      </KadaTiles>

      {/* Two-col cards */}
      <KadaTwo>
        {/* Needs attention */}
        <KadaCard>
          <h3>{language === 'ml' ? 'ശ്രദ്ധ വേണം' : 'Needs you'}</h3>
          <KadaRow
            dot={<KadaDot warn>!</KadaDot>}
            title={language === 'ml' ? 'രാഹുലിൽ നിന്ന് ബൾക്ക് ഓർഡർ' : 'Bulk order from Rahul'}
            sub={language === 'ml' ? '40 യൂണിഫോം 15 ന്' : '40 uniforms by the 15th'}
            right={<time>10:42</time>}
            clickable
            onClick={() => onNavigate('whatsapp')}
            href="#inbox"
          />
          <KadaRow
            dot={<KadaDot warn>!</KadaDot>}
            title={language === 'ml' ? 'അരി സ്റ്റോക്ക് കുറഞ്ഞു' : 'Rice stock is low'}
            sub={language === 'ml' ? '20 കി.ഗ്രാം ബാക്കി, ഓർഡർ തയ്യാർ' : '20 kg left, reorder drafted'}
            right={<time>09:05</time>}
            clickable
            onClick={() => onNavigate('voice-agent')}
            href="#activity"
          />
        </KadaCard>

        {/* Today's bookings */}
        <KadaCard>
          <h3>{language === 'ml' ? 'ഇന്നത്തെ ബുക്കിംഗ്' : "Today's bookings"}</h3>
          <KadaRow
            dot={<KadaDot>10</KadaDot>}
            title={language === 'ml' ? 'സുരേഷ്, 2 പേർ' : 'Suresh, 2 people'}
            sub={language === 'ml' ? 'ഫിറ്റിംഗ്, 10:30 ലേക്ക് മാറ്റി' : 'Fitting, moved to 10:30'}
            right={<KadaBadge>{language === 'ml' ? 'ബുക്ക്' : 'Booked'}</KadaBadge>}
          />
          <KadaRow
            dot={<KadaDot>4</KadaDot>}
            title={language === 'ml' ? 'മീര' : 'Meera'}
            sub={language === 'ml' ? 'ബ്ലൗസ് ഫിറ്റിംഗ്, 4:00 pm' : 'Blouse fitting, 4:00 pm'}
            right={<KadaBadge>{language === 'ml' ? 'ബുക്ക്' : 'Booked'}</KadaBadge>}
          />
        </KadaCard>
      </KadaTwo>

      {/* Recent agent activity */}
      <KadaCard>
        <h3>{language === 'ml' ? 'ഏജന്റ് ആക്ടിവിറ്റി' : 'Recent activity'}</h3>
        {recent.map(log => (
          <KadaRow
            key={log.id}
            dot={<KadaDot>✓</KadaDot>}
            title={language === 'ml' ? log.outputSummaryMl : log.outputSummary}
            sub={log.timestamp.split('T')[1]?.slice(0, 5) ?? ''}
            right={<KadaBadge>{language === 'ml' ? 'ചെയ്തു' : 'Done'}</KadaBadge>}
          />
        ))}
        <div style={{ paddingTop: '.6rem' }}>
          <KadaButton
            ghost small
            onClick={() => onNavigate('voice-agent')}
            style={{ fontSize: '.82rem' }}
          >
            {language === 'ml' ? 'എല്ലാം കാണൂ →' : 'See all →'}
          </KadaButton>
        </div>
      </KadaCard>

      <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>
        {language === 'ml' ? 'ഇത് സാമ്പിൾ ഡേറ്റ ആണ്.' : 'Sample data for illustration.'}
      </p>

      {/* Desktop: speak button */}
      <KadaButton
        className="dfab"
        onClick={onOpenVoiceModal}
        style={{ gap: '.5rem' }}
      >
        <KadaIcon id="i-mic" />
        {language === 'ml' ? 'ഒരു കമ്മാൻഡ് പറയൂ' : 'Speak a command'}
      </KadaButton>
    </section>
  );
};
