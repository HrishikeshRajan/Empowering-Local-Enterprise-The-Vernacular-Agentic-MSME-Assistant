import React, { useState } from 'react';
import type { Language, Appointment } from '../types';
import { MOCK_APPOINTMENTS } from '../mockData';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  Phone, 
  Send, 
  Plus,
  AlertCircle
} from 'lucide-react';

interface AppointmentsProps {
  language: Language;
}

export const Appointments: React.FC<AppointmentsProps> = ({ language }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const handleConfirm = (id: string) => {
    setConfirmedId(id);
    setTimeout(() => {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
      setConfirmedId(null);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="glass-badge glass-badge-indigo">
                <Calendar size={14} />
                Calendar Sync & Slot Booking
              </span>
              <span className="glass-badge glass-badge-emerald">
                {appointments.length} Scheduled
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {language === 'ml' 
                ? 'അപ്പോയിന്റ്മെന്റുകൾ & കസ്റ്റമർ ബുക്കിംഗ്' 
                : 'Appointments & Service Schedule'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'ഉപഭോക്താക്കൾ WhatsApp വഴിയോ ശബ്ദ നിർദ്ദേശത്തിലൂടെയോ ആവശ്യപ്പെടുന്ന മീറ്റിംഗുകളും സാധനങ്ങൾ എടുക്കാനുള്ള സമയവും സ്വയമേവ കലണ്ടറിൽ രേഖപ്പെടുത്തുന്നു.'
                : 'Automated booking agent for retail visits, B2B wholesale reviews, and deliveries. Dispatches instant confirmation and calendar reminders to clients over WhatsApp.'}
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {appointments.map((apt) => (
          <div 
            key={apt.id}
            className="glass-panel glass-panel-hover"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className={`glass-badge ${apt.status === 'confirmed' ? 'glass-badge-emerald' : 'glass-badge-saffron'}`} style={{ fontSize: '0.68rem', marginBottom: '6px' }}>
                  {apt.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending Confirmation'}
                </span>
                <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  {apt.customerName}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {apt.phone}
                </p>
              </div>

              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#a5b4fc'
              }}>
                <Clock size={18} />
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <p className="font-ml" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {language === 'ml' ? apt.serviceMl : apt.service}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>📅 {apt.date}</span>
                <span>⏱ {apt.timeSlot}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              "{apt.notes}"
            </p>

            {apt.status === 'pending' && (
              <button
                onClick={() => handleConfirm(apt.id)}
                disabled={confirmedId === apt.id}
                className="btn-primary"
                style={{ width: '100%', marginTop: 'auto', fontSize: '0.8rem', padding: '8px' }}
              >
                <CheckCircle2 size={14} />
                <span className="font-ml">
                  {confirmedId === apt.id 
                    ? 'സ്ഥിരീകരിക്കുന്നു...' 
                    : (language === 'ml' ? 'WhatsApp വഴി സ്ഥിരീകരിക്കുക' : 'Confirm & Notify WhatsApp')}
                </span>
              </button>
            )}

            {apt.status === 'confirmed' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--emerald-light)', marginTop: 'auto' }}>
                <CheckCircle2 size={14} />
                <span>WhatsApp reminder scheduled 1h before slot</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
