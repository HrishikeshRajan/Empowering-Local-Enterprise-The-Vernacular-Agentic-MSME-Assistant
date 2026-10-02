import React, { useState } from 'react';
import type { Language, WhatsAppConversation, WhatsAppMessage } from '../types';
import { MOCK_WHATSAPP_CONVERSATIONS } from '../mockData';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  X, 
  Sparkles,
  Play,
  FileText
} from 'lucide-react';

interface WhatsAppHubProps {
  language: Language;
}

export const WhatsAppHub: React.FC<WhatsAppHubProps> = ({ language }) => {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(MOCK_WHATSAPP_CONVERSATIONS);
  const [selectedChat, setSelectedChat] = useState<WhatsAppConversation>(MOCK_WHATSAPP_CONVERSATIONS[0]);
  const [replyText, setReplyText] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAmount, setQrAmount] = useState<number>(38055);
  const [isAudioPlaying, setIsAudioPlaying] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: 'm-' + Date.now(),
      sender: 'agent',
      text: replyText,
      textMl: replyText,
      time: 'Just now',
      status: 'delivered'
    };

    const updated = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg]
    };

    setSelectedChat(updated);
    setConversations(conversations.map(c => c.id === updated.id ? updated : c));
    setReplyText('');
  };

  const handleQuickTemplate = (text: string) => {
    setReplyText(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(37, 211, 102, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="glass-badge" style={{ backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25d366', borderColor: 'rgba(37, 211, 102, 0.4)' }}>
                <MessageSquare size={14} />
                {language === 'ml' ? 'വാട്സ്ആപ്പ് ബിസിനസ് കണക്റ്റഡ്' : 'WhatsApp Business Connected'}
              </span>
              <span className="glass-badge glass-badge-emerald">
                {language === 'ml' ? '24 മണിക്കൂറും സജീവം' : 'Active 24/7'}
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {language === 'ml' 
                ? 'വാട്സ്ആപ്പ് ബിസിനസ് & ഓർഡർ ഹബ്ബ്' 
                : 'Automated WhatsApp Business & Customer Hub'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'ഉപഭോക്താക്കൾ അയക്കുന്ന മലയാളം ചോദ്യങ്ങൾക്ക് സ്വയമേവ മറുപടി നൽകുകയും, ഇൻവോയ്സ് അയക്കുകയും, UPI പേയ്മെന്റ് ലിങ്കുകൾ ഉടൻ പങ്കുവെക്കുകയും ചെയ്യുന്നു.'
                : 'Instant automated customer service in Malayalam and English. Answers price inquiries, sends digital bills, and shares instant UPI QR payment links directly in chat.'}
            </p>
          </div>

          <div className="glass-badge" style={{ padding: '8px 14px', background: 'rgba(37, 211, 102, 0.12)', color: '#25d366' }}>
            <Clock size={14} />
            <span>{language === 'ml' ? 'കസ്റ്റമർ ചാറ്റ് സജീവം' : 'Customer Session: Active'}</span>
          </div>
        </div>
      </div>

      {/* Main Container: Chat Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '20px', minHeight: '620px' }}>
        
        {/* Contact List */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700 }}>
              {language === 'ml' ? 'ഉപഭോക്താക്കൾ (Chats)' : 'Active Conversations'}
            </h3>
            <span className="glass-badge glass-badge-emerald" style={{ fontSize: '0.68rem' }}>
              {conversations.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            {conversations.map((chat) => {
              const isSelected = selectedChat.id === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: isSelected ? 'rgba(37, 211, 102, 0.4)' : 'transparent',
                    background: isSelected ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #128c7e 0%, #075e54 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    {chat.customerName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span className="font-ml" style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.customerName}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.messages[chat.messages.length - 1]?.text}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span style={{
                      backgroundColor: '#25d366',
                      color: '#000',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 800
                    }}>
                      {chat.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Realistic Phone / Chat Viewport */}
        <div className="glass-panel" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          background: '#0b141a',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          
          {/* WhatsApp Header */}
          <div style={{ 
            padding: '12px 20px', 
            backgroundColor: '#202c33', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#128c7e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700
              }}>
                {selectedChat.customerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-ml" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e9edef' }}>
                  {selectedChat.customerName}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#8696a0' }}>
                  <span>{selectedChat.customerPhone}</span>
                  <span>•</span>
                  <span style={{ color: '#25d366' }}>
                    {selectedChat.isSessionActive ? `⏳ Session active (${selectedChat.sessionExpiryHours}h left)` : 'Template required'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#aebac1' }}>
              <Phone size={18} style={{ cursor: 'pointer' }} />
              <Video size={18} style={{ cursor: 'pointer' }} />
              <MoreVertical size={18} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}>
            
            {/* Session Info Badge */}
            <div style={{ alignSelf: 'center', padding: '4px 12px', borderRadius: 'var(--radius-sm)', background: '#182229', fontSize: '0.7rem', color: '#8696a0', border: '1px solid rgba(255,255,255,0.05)' }}>
              🔒 Messages are end-to-end encrypted • Vernacular Assistant Connected
            </div>

            {selectedChat.messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div 
                  key={msg.id}
                  style={{
                    alignSelf: isAgent ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    backgroundColor: isAgent ? '#005c4b' : '#202c33',
                    color: '#e9edef',
                    padding: '10px 14px',
                    borderRadius: isAgent ? '12px 0 12px 12px' : '0 12px 12px 12px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <p className="font-ml" style={{ fontSize: '0.875rem', lineHeight: 1.45 }}>
                    {msg.text}
                  </p>

                  {/* Payment Link Card if attached */}
                  {msg.hasPaymentLink && (
                    <div style={{ 
                      marginTop: '6px', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      background: 'rgba(0, 0, 0, 0.25)', 
                      border: '1px solid rgba(37, 211, 102, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#25d366', fontWeight: 700 }}>
                          RAZORPAY UPI INSTANT PAY
                        </span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                          ₹{msg.paymentAmount?.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setQrAmount(msg.paymentAmount || 38055);
                          setShowQrModal(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#25d366',
                          color: '#000',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        <QrCode size={14} />
                        View QR Code
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.65rem', color: '#8696a0' }}>
                    <span>{msg.time}</span>
                    {isAgent && <CheckCheck size={14} color="#53bdeb" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Vernacular Actions */}
          <div style={{ padding: '8px 16px', backgroundColor: '#111b21', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.72rem', color: '#8696a0', alignSelf: 'center', flexShrink: 0 }}>
              Quick Templates:
            </span>
            <button
              onClick={() => handleQuickTemplate('ഇൻവോയ്സ് MS/23-24/1156 തുക ₹38,055 അയച്ചിട്ടുണ്ട്.')}
              className="font-ml"
              style={{ padding: '4px 10px', borderRadius: '14px', background: '#202c33', color: '#e9edef', border: 'none', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
            >
              📄 ബിൽ അയക്കുക
            </button>
            <button
              onClick={() => handleQuickTemplate('നന്ദി! നിങ്ങളുടെ ഓർഡർ പാക്കിംഗ് പൂർത്തിയായി വരുന്നു.')}
              className="font-ml"
              style={{ padding: '4px 10px', borderRadius: '14px', background: '#202c33', color: '#e9edef', border: 'none', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
            >
              📦 ഓർഡർ സ്ഥിരീകരണം
            </button>
            <button
              onClick={() => handleQuickTemplate('ദയവായി തുക താഴെ കാണുന്ന UPI ലിങ്ക് വഴി നൽകുമല്ലോ.')}
              className="font-ml"
              style={{ padding: '4px 10px', borderRadius: '14px', background: '#202c33', color: '#e9edef', border: 'none', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
            >
              💳 UPI പേയ്മെന്റ് ലിങ്ക്
            </button>
          </div>

          {/* WhatsApp Message Input Bar */}
          <form 
            onSubmit={handleSendMessage}
            style={{ 
              padding: '12px 16px', 
              backgroundColor: '#202c33', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px' 
            }}
          >
            <Paperclip size={20} color="#8696a0" style={{ cursor: 'pointer' }} />
            
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type message in Malayalam or English..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                background: '#2a3942',
                border: 'none',
                color: '#e9edef',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              disabled={!replyText.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: replyText.trim() ? '#00a884' : '#2a3942',
                color: replyText.trim() ? '#fff' : '#8696a0',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: replyText.trim() ? 'pointer' : 'default'
              }}
            >
              <Send size={18} />
            </button>
          </form>

        </div>

      </div>

      {/* Razorpay UPI QR Code Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '380px',
            width: '100%',
            padding: '24px',
            backgroundColor: '#0f172a',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <span className="glass-badge glass-badge-emerald" style={{ marginBottom: '8px' }}>
                Razorpay Verified Merchant
              </span>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Scan to Pay via UPI
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Malabar Spices & Provisions (Thrissur)
              </p>
            </div>

            {/* Simulated UPI QR Graphic */}
            <div style={{ 
              padding: '16px', 
              background: '#fff', 
              borderRadius: '12px', 
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <QrCode size={180} color="#000" />
              <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                UPI ID: malabarspices@okaxis
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amount Payable:</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                ₹{qrAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                GPay • PhonePe • Paytm • BHIM UPI
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Simulate Customer Payment Received ✓
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
