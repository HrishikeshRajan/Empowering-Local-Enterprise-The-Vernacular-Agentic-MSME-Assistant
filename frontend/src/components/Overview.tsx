import React, { useState } from 'react';
import type { Language, NavTab, StoreProfile } from '../types';
import { KadaIcon } from './ui';
import { STORE_PROFILE, INITIAL_AGENT_LOGS } from '../mockData';

interface OverviewProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
  storeProfile?: StoreProfile;
}

const t = (en: string, ml: string, lang: Language) => lang === 'ml' ? ml : en;

export const Overview: React.FC<OverviewProps> = ({ language: lang, onNavigate, onOpenVoiceModal, storeProfile }) => {
  const profile = storeProfile || STORE_PROFILE;
  const [autoMode, setAutoMode] = useState(true);
  const [attItems, setAttItems] = useState([
    { id: 'a1', icon: 'i-alert', title: t('Bulk order from Rahul',  'രാഹുലിൽ നിന്ന് ബൾക്ക് ഓർഡർ', lang), sub: t('40 uniforms by the 15th · 10:42', '40 യൂണിഫോം 15 ന് · 10:42', lang), action: t('Reply', 'മറുപടി', lang) },
    { id: 'a2', icon: 'i-box',   title: t('Rice stock is low',      'അരി സ്റ്റോക്ക് കുറഞ്ഞു',     lang), sub: t('20 kg left, reorder drafted · 09:05', '20 കി.ഗ്രാം ബാക്കി, ഓർഡർ തയ്യാർ · 09:05', lang), action: t('Order', 'ഓർഡർ ചെയ്യൂ', lang) },
  ]);

  const recent = INITIAL_AGENT_LOGS.filter(l => l.status === 'SUCCESS').slice(0, 3);

  const dismiss = (id: string) => {
    const el = document.getElementById(`att-item-${id}`);
    if (el) el.classList.add('out');
    setTimeout(() => setAttItems(prev => prev.filter(i => i.id !== id)), 300);
  };

  const agentLabel = autoMode
    ? t('Kada is handling messages',  'Kada സന്ദേശങ്ങൾ കൈകാര്യം ചെയ്യുന്നു', lang)
    : t('You are in control',         'നിങ്ങൾ നിയന്ത്രണത്തിലാണ്',              lang);
  const agentSub = autoMode
    ? t('Switch off to take control yourself.', 'ഓഫ് ചെയ്‌ത് നിങ്ങൾ ഏറ്റെടുക്കാം.', lang)
    : t('New messages wait for you.',           'പുതിയ സന്ദേശങ്ങൾ നിങ്ങൾക്കായി കാത്തിരിക്കും.', lang);

  const ownerFirst = (profile.owner || 'Merchant').split(' ')[0];
  const ownerGreetingMl = profile.ownerMl || profile.owner || 'സുഹൃത്തേ';

  return (
    <section className="pg" id="p-home">

      {/* ── Page header ── */}
      <header className="hd">
        <div>
          <small>{t('Good morning', 'നമസ്കാരം', lang)}</small>
          <h1>{t(`Welcome, ${ownerFirst}`, `സ്വാഗതം, ${ownerGreetingMl}`, lang)}</h1>
          <p>{t(
            `${profile.name} is running smoothly today.`, 
            `${profile.nameMl || profile.name} ഇന്ന് സുഗമമായി പ്രവർത്തിക്കുന്നു.`, 
            lang
          )}</p>
        </div>
        <button className="vbtn" onClick={onOpenVoiceModal}>
          <KadaIcon id="i-mic" />
          {t('Speak a command', 'ഒരു കമ്മാൻഡ് പറയൂ', lang)}
        </button>
      </header>

      <div className="grid">

        {/* ── Hero: agent toggle ── */}
        <div className={`g-hero${autoMode ? '' : ' man'}`}>
          <div className="t">
            <b><span className="pulse" aria-hidden="true" />{agentLabel}</b>
            <small>{agentSub}</small>
          </div>
          <button
            className="sw"
            role="switch"
            aria-checked={autoMode}
            aria-label={t('Auto mode', 'ഓട്ടോ മോഡ്', lang)}
            onClick={() => setAutoMode(v => !v)}
          />
        </div>

        {/* ── Stat tiles ── */}
        <div className="tiles g-tiles">
          <div className="tile">
            <span className="ic"><KadaIcon id="i-cal" /></span>
            <b>{STORE_PROFILE.tasksAutoCompleted}</b>
            <span>{t('Bookings', 'ബുക്കിംഗ്', lang)}</span>
          </div>
          <div className="tile">
            <span className="ic"><KadaIcon id="i-doc" /></span>
            <b>5</b>
            <span>{t('Bills read', 'ബില്ലുകൾ', lang)}</span>
          </div>
          <div className="tile">
            <span className="ic"><KadaIcon id="i-chat" /></span>
            <b>{STORE_PROFILE.whatsappQueriesToday}</b>
            <span>{t('Chats handled', 'ചാറ്റ്', lang)}</span>
          </div>
          <button
            className={`tile w${attItems.length === 0 ? ' ok' : ''}`}
            onClick={() => document.getElementById('att')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            <span className="ic"><KadaIcon id="i-alert" /></span>
            <b>{attItems.length}</b>
            <span>{t('Need attention', 'ശ്രദ്ധ വേണം', lang)}</span>
          </button>
        </div>

        {/* ── Needs attention ── */}
        <div className="card g-att" id="att">
          <div className="ch">
            <h2>{t('Needs you', 'ശ്രദ്ധ വേണം', lang)}</h2>
            {attItems.length > 0 && <span className="cnt">{attItems.length}</span>}
          </div>

          {attItems.map(item => (
            <div key={item.id} id={`att-item-${item.id}`} className="item">
              <span className="dot w"><KadaIcon id={item.icon} /></span>
              <span className="x">
                <b>{item.title}</b>
                <small>{item.sub}</small>
              </span>
              <button className="act" onClick={() => dismiss(item.id)}>{item.action}</button>
            </div>
          ))}

          {attItems.length === 0 && (
            <p className="empty">{t('All clear. Kada is watching. ✓', 'എല്ലാം ശരിയാണ്. Kada നോക്കിക്കൊള്ളും. ✓', lang)}</p>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div className="quick g-quick" aria-label={t('Quick actions', 'വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ', lang)}>
          <button className="chip" onClick={() => onNavigate('invoices')}>
            <span><KadaIcon id="i-doc" /></span>
            {t('Add bill', 'ബിൽ ചേർക്കൂ', lang)}
          </button>
          <button className="chip" onClick={() => onNavigate('inventory')}>
            <span><KadaIcon id="i-box" /></span>
            {t('Add stock', 'സ്റ്റോക്ക് ചേർക്കൂ', lang)}
          </button>
          <button className="chip" onClick={() => onNavigate('appointments')}>
            <span><KadaIcon id="i-cal" /></span>
            {t('New booking', 'ബുക്കിംഗ് ചേർക്കൂ', lang)}
          </button>
          <button className="chip" onClick={() => onNavigate('whatsapp')}>
            <span><KadaIcon id="i-chat" /></span>
            {t('Reply customer', 'മറുപടി നൽകൂ', lang)}
          </button>
        </div>

        {/* ── Today's bookings ── */}
        <div className="card g-book">
          <div className="ch">
            <h2>{t("Today's bookings", 'ഇന്നത്തെ ബുക്കിംഗ്', lang)}</h2>
          </div>
          <div className="slot">
            <time>10:30<small>{t('AM', 'രാവിലെ', lang)}</small></time>
            <span className="x">
              <b>{t('Suresh, 2 people', 'സുരേഷ്, 2 പേർ', lang)}</b>
              <small>{t('Fitting, moved to 10:30', 'ഫിറ്റിംഗ്, 10:30 ലേക്ക് മാറ്റി', lang)}</small>
            </span>
            <span className="bd">{t('Booked', 'ബുക്ക്', lang)}</span>
          </div>
          <div className="slot">
            <time>4:00<small>{t('PM', 'വൈകീട്ട്', lang)}</small></time>
            <span className="x">
              <b>{t('Meera', 'മീര', lang)}</b>
              <small>{t('Blouse fitting', 'ബ്ലൗസ് ഫിറ്റിംഗ്', lang)}</small>
            </span>
            <span className="bd">{t('Booked', 'ബുക്ക്', lang)}</span>
          </div>
        </div>

        {/* ── Agent activity ── */}
        <div className="card g-act">
          <div className="ch">
            <h2>{t('Agent activity', 'ഏജന്റ് ആക്ടിവിറ്റി', lang)}</h2>
            <button className="bd" onClick={() => onNavigate('voice-agent')}>
              {t('See all →', 'എല്ലാം കാണൂ →', lang)}
            </button>
          </div>
          {recent.map(log => (
            <div key={log.id} className="item">
              <span className="dot"><KadaIcon id="i-check" /></span>
              <span className="x">
                <b className="clamp">{lang === 'ml' ? log.outputSummaryMl : log.outputSummary}</b>
              </span>
              <span className="bd">{t('Done', 'ചെയ്തു', lang)}</span>
            </div>
          ))}
        </div>

      </div>

      <p className="note">{t('Sample data for illustration.', 'ഇത് സാമ്പിൾ ഡേറ്റ ആണ്.', lang)}</p>
    </section>
  );
};
