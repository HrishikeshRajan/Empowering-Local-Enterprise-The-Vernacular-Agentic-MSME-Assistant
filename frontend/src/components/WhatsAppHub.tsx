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
        background: 'linear-gradient(135deg, #e7f5ec 0%, #f0f6f1 100%)',
        border: '1px solid var(--line)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="glass-badge glass-badge-emerald">
                <MessageSquare size={14} />
                {language === 'ml' ? 'വാട്സ്ആപ്പ് ബിസിനസ് കണക്റ്റഡ്' : 'WhatsApp Business Connected'}
              </span>
              <span className="glass-badge glass-badge-emerald">
                {language === 'ml' ? '24 മണിക്കൂറും സജീവം' : 'Active 24/7'}
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--ink)' }}>
              {language === 'ml' 
                ? 'വാട്സ്ആപ്പ് ബിസിനസ് & ഓർഡർ ഹബ്ബ്' 
                : 'Automated WhatsApp Business & Customer Hub'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'ഉപഭോക്താക്കൾ അയക്കുന്ന മലയാളം ചോദ്യങ്ങൾക്ക് സ്വയമേവ മറുപടി നൽകുകയും, ഇൻവോയ്സ് അയക്കുകയും, UPI പേയ്മെന്റ് ലിങ്കുകൾ ഉടൻ പങ്കുവെക്കുകയും ചെയ്യുന്നു.'
                : 'Instant automated customer service in Malayalam and English. Answers price inquiries, sends digital bills, and shares instant UPI QR payment links directly in chat.'}
            </p>
          </div>

          <div className="glass-badge glass-badge-emerald" style={{ padding: '8px 14px' }}>
            <Clock size={14} />
            <span>{language === 'ml' ? 'കസ്റ്റമർ ചാറ്റ് സജീവം' : 'Customer Session: Active'}</span>
          </div>
        </div>
      </div>

      {/* Main Container: Chat Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '20px', minHeight: '620px' }}>
        
        {/* Contact List */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--line)' }}>
            <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)' }}>
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
                    borderColor: isSelected ? 'var(--line)' : 'transparent',
                    background: isSelected ? 'var(--soft)' : 'transparent',
                    textAlign: 'left',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50% 50% 50% 12%', 
                    background: isSelected ? 'var(--accent)' : 'var(--tint)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#fff' : 'var(--accent-d)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    {chat.customerName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span className="font-ml" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.customerName}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.messages[chat.messages.length - 1]?.text}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span style={{
                      backgroundColor: 'var(--accent)',
                      color: '#fff',
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
          background: 'var(--surface)',
          border: '1px solid var(--line)'
        }}>
          
          {/* WhatsApp Header */}
          <div style={{ 
            padding: '12px 20px', 
            backgroundColor: 'var(--surface)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--line)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50% 50% 50% 12%', 
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700
              }}>
                {selectedChat.customerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-ml" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>
                  {selectedChat.customerName}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--muted)' }}>
                  <span>{selectedChat.customerPhone}</span>
                  <span>•</span>
                  <span style={{ color: 'var(--accent-d)', fontWeight: 500 }}>
                    {selectedChat.isSessionActive ? `⏳ Session active (${selectedChat.sessionExpiryHours}h left)` : 'Template required'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--muted)' }}>
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
            backgroundColor: 'var(--tint)',
            backgroundImage: 'radial-gradient(var(--line) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}>
            
            {/* Session Info Badge */}
            <div style={{ alignSelf: 'center', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--surface)', fontSize: '0.72rem', color: 'var(--muted)', border: '1px solid var(--line)', boxShadow: '0 1px 3px rgba(27,42,35,0.04)' }}>
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
                    backgroundColor: isAgent ? 'var(--accent)' : 'var(--surface)',
                    color: isAgent ? '#ffffff' : 'var(--ink)',
                    padding: '10px 14px',
                    borderRadius: isAgent ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    boxShadow: isAgent ? '0 4px 14px rgba(63, 122, 92, 0.2)' : '0 1px 3px rgba(27, 42, 35, 0.05)',
                    border: isAgent ? 'none' : '1px solid var(--line)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <p className="font-ml" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {msg.text}
                  </p>

                  {/* Payment Link Card if attached */}
                  {msg.hasPaymentLink && (
                    <div style={{ 
                      marginTop: '6px', 
                      padding: '10px 14px', 
                      borderRadius: '8px', 
                      background: isAgent ? 'rgba(255, 255, 255, 0.15)' : 'var(--soft)', 
                      border: isAgent ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(63, 122, 92, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: isAgent ? '#e3efe7' : 'var(--accent-d)', fontWeight: 700 }}>
                          RAZORPAY UPI INSTANT PAY
                        </span>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: isAgent ? '#ffffff' : 'var(--ink)' }}>
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
                          background: isAgent ? '#ffffff' : 'var(--accent)',
                          color: isAgent ? 'var(--accent-d)' : '#ffffff',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        <QrCode size={14} />
                        View QR Code
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.68rem', color: isAgent ? 'rgba(255, 255, 255, 0.85)' : 'var(--muted)' }}>
                    <span>{msg.time}</span>
                    {isAgent && <CheckCheck size={14} color="#e3efe7" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Vernacular Actions */}
          <div style={{ padding: '10px 16px', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--line)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', alignSelf: 'center', flexShrink: 0 }}>
              Quick Templates:
            </span>
            <button
              onClick={() => handleQuickTemplate('ഇൻവോയ്സ് MS/23-24/1156 തുക ₹38,055 അയച്ചിട്ടുണ്ട്.')}
              className="font-ml"
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'var(--soft)', color: 'var(--accent-d)', border: '1px solid rgba(63, 122, 92, 0.2)', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
            >
              📄 ബിൽ അയക്കുക
            </button>
            <button
              onClick={() => handleQuickTemplate('നന്ദി! നിങ്ങളുടെ ഓർഡർ പാക്കിംഗ് പൂർത്തിയായി വരുന്നു.')}
              className="font-ml"
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'var(--soft)', color: 'var(--accent-d)', border: '1px solid rgba(63, 122, 92, 0.2)', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
            >
              📦 ഓർഡർ സ്ഥിരീകരണം
            </button>
            <button
              onClick={() => handleQuickTemplate('ദയവായി തുക താഴെ കാണുന്ന UPI ലിങ്ക് വഴി നൽകുമല്ലോ.')}
              className="font-ml"
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'var(--soft)', color: 'var(--accent-d)', border: '1px solid rgba(63, 122, 92, 0.2)', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
            >
              💳 UPI പേയ്മെന്റ് ലിങ്ക്
            </button>
          </div>

          {/* WhatsApp Message Input Bar */}
          <form 
            onSubmit={handleSendMessage}
            style={{ 
              padding: '12px 16px', 
              backgroundColor: 'var(--surface)', 
              borderTop: '1px solid var(--line)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px' 
            }}
          >
            <Paperclip size={20} color="var(--muted)" style={{ cursor: 'pointer' }} />
            
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type message in Malayalam or English..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--tint)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
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
                background: replyText.trim() ? 'var(--accent)' : 'var(--tint)',
                color: replyText.trim() ? '#fff' : 'var(--muted)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: replyText.trim() ? 'pointer' : 'default',
                boxShadow: replyText.trim() ? '0 4px 12px rgba(63, 122, 92, 0.25)' : 'none'
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
