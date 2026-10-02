import React from 'react';
import type { Language } from '../types';
import { MOCK_SYSTEM_HEALTH } from '../mockData';
import { 
  Server, 
  Cpu, 
  Database, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingDown, 
  Zap, 
  Layers,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface SystemHealthProps {
  language: Language;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ language }) => {
  const h = MOCK_SYSTEM_HEALTH;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="glass-badge glass-badge-emerald">
                <Server size={14} />
                Single VPS Architecture (CX32)
              </span>
              <span className="glass-badge glass-badge-indigo">
                Live Telemetry
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {language === 'ml' 
                ? 'ഹോസ്റ്റിംഗ് വിവരങ്ങൾ & പ്രതിമാസ ചെലവ് (₹765/മാസം)' 
                : 'Personal Self-Hosted VPS & Low-Cost Infrastructure Tracker'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'വലിയ കമ്പനികളുടെ പതിനായിരക്കണക്കിന് രൂപയുടെ ക്ലൗഡ് ബില്ലുകൾക്ക് പകരം, സ്വന്തം ഒറ്റ Hetzner സെർവറിൽ whisper.cpp-യും pgvector-ഉം സൗജന്യ Gemini മോഡലും ഉപയോഗിച്ച് പ്രവർത്തിപ്പിക്കുന്നു.'
                : 'Engineered specifically for affordable personal hosting. Replaced expensive managed services with self-hosted whisper.cpp, PostgreSQL pgvector, and Gemini free tier.'}
            </p>
          </div>

          <div style={{ 
            padding: '16px 20px', 
            borderRadius: 'var(--radius-lg)', 
            background: 'rgba(16, 185, 129, 0.12)', 
            border: '1px solid var(--border-glow)',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Monthly Burn Rate
            </span>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--emerald-light)', lineHeight: 1.1 }}>
              ₹{h.totalMonthlyBurn} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ month</span>
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-emerald)' }}>
              ⚡ 95% cheaper than AWS ECS stack
            </span>
          </div>
        </div>
      </div>

      {/* Cost Comparison Cards: Lean vs Enterprise */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Your Lean Stack Card */}
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-glow)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald-light)' }}>
              ✓ Your Lean Stack (Self-Hosted)
            </h3>
            <span className="glass-badge glass-badge-emerald">
              ₹765 / mo
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Hetzner CX32 (4 vCPU, 8GB RAM)</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>₹700 / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>whisper.cpp (Self-Hosted Voice)</span>
              <span style={{ fontWeight: 600, color: 'var(--emerald-light)' }}>₹0 (Local CPU)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Google Gemini 2.0 Flash</span>
              <span style={{ fontWeight: 600, color: 'var(--emerald-light)' }}>₹0 (Free Tier 15 RPM)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PostgreSQL + pgvector</span>
              <span style={{ fontWeight: 600, color: 'var(--emerald-light)' }}>₹0 (On VPS)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Meta WhatsApp Cloud API</span>
              <span style={{ fontWeight: 600, color: 'var(--emerald-light)' }}>₹0 (1K Free msgs)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cloudflare R2 + CDN + SSL</span>
              <span style={{ fontWeight: 600, color: 'var(--emerald-light)' }}>₹0 (Free 10GB)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Domain (.in amortized)</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>₹65 / mo</span>
            </div>
          </div>
        </div>

        {/* Enterprise Alternative Card */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(244, 63, 94, 0.03)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fda4af' }}>
              ✕ Enterprise Stack Cost
            </h3>
            <span className="glass-badge glass-badge-rose">
              ₹15,400 / mo
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>AWS ECS Fargate + ALB</span>
              <span>~₹5,200 / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>Pinecone Vector DB (Minimum)</span>
              <span>₹5,800 / mo ($70)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>OpenAI Whisper API</span>
              <span>~₹900 / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>Clerk Auth ($25/mo)</span>
              <span>₹2,100 / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>AWS S3 + CloudWatch + Secrets</span>
              <span>~₹1,400 / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fda4af', fontWeight: 700, paddingTop: '4px' }}>
              <span>Wasted Monthly Overhead:</span>
              <span>+ ₹14,635 / month</span>
            </div>
          </div>
        </div>

      </div>

      {/* Live Resource Utilization Gauges */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
          Hetzner CX32 Node Metrics (Live Telemetry)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          
          {/* CPU Gauge */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CPU (4 vCPUs)</span>
              <span style={{ fontWeight: 700, color: 'var(--emerald-light)' }}>{h.vps.cpuUsage}%</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${h.vps.cpuUsage}%`, background: 'var(--emerald-main)' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              whisper.cpp benchmark: 168ms latency
            </p>
          </div>

          {/* RAM Gauge */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>RAM (8 GB)</span>
              <span style={{ fontWeight: 700, color: 'var(--indigo-main)' }}>2.4 / 8.0 GB ({h.vps.ramUsage}%)</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${h.vps.ramUsage}%`, background: 'var(--indigo-main)' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              PostgreSQL + Redis + NestJS in memory
            </p>
          </div>

          {/* SSD Gauge */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>NVMe SSD (80 GB)</span>
              <span style={{ fontWeight: 700, color: 'var(--saffron-light)' }}>14.4 / 80 GB ({h.vps.diskUsage}%)</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${h.vps.diskUsage}%`, background: 'var(--saffron-main)' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Docker containers & local database
            </p>
          </div>

          {/* Gemini Free Tier Gauge */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gemini 2.0 Flash Quota</span>
              <span style={{ fontWeight: 700, color: 'var(--emerald-light)' }}>{h.llm.rpmQuotaUsed}</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '13%', background: 'var(--emerald-main)' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              {h.llm.dailyTokensUsed} / 1,000,000 free tokens today
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
