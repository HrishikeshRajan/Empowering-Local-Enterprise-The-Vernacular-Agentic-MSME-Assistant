import React, { useState } from 'react';
import type { Language } from '../types';
import { MOCK_INVOICE_DATA } from '../mockData';
import { 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Upload, 
  ArrowRight, 
  Send, 
  Sparkles, 
  RefreshCw,
  ExternalLink,
  Receipt,
  AlertTriangle
} from 'lucide-react';

interface InvoiceParserProps {
  language: Language;
}

export const InvoiceParser: React.FC<InvoiceParserProps> = ({ language }) => {
  const [invoice, setInvoice] = useState(MOCK_INVOICE_DATA);
  const [isScanning, setIsScanning] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setSyncSuccess(false);
    setWhatsappSent(false);

    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const handleSyncInventory = () => {
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3500);
  };

  const handleSendWhatsApp = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Info Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #e7f5ec 0%, #f0f6f1 100%)',
        border: '1px solid var(--line)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="glass-badge glass-badge-saffron">
                <Receipt size={14} />
                {language === 'ml' ? 'സ്മാർട്ട് ബിൽ വായന' : 'Instant Bill Scanner'}
              </span>
              <span className="glass-badge glass-badge-emerald">
                {language === 'ml' ? '98.7% കൃത്യത' : '98.7% Accuracy'}
              </span>
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--ink)' }}>
              {language === 'ml' 
                ? 'സപ്ലയർ ബില്ലുകൾ & ഇൻവോയ്സ് വായന' 
                : 'Smart Document & Supplier Invoice Reader'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'സപ്ലയർമാർ തരുന്ന ബില്ലിന്റെയോ റസീറ്റിന്റെയോ ഫോട്ടോ എടുത്താൽ മതി! ഉൽപ്പന്നങ്ങളുടെ പേര്, അളവ്, ജിഎസ്ടി, ആകെ തുക എന്നിവ കൃത്യമായി വായിച്ച് സ്റ്റോക്കിലേക്ക് സ്വയം മാറ്റും.'
                : 'Snap or upload supplier receipts and tax bills. All item names, quantities, and GST calculations are read automatically and double-checked for zero mathematical errors.'}
            </p>
          </div>

          <button 
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="btn-primary"
            style={{ padding: '12px 20px', gap: '10px' }}
          >
            <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
            <span className="font-ml">
              {isScanning 
                ? (language === 'ml' ? 'സ്കാൻ ചെയ്യുന്നു...' : 'Scanning Vision...') 
                : (language === 'ml' ? 'ഇൻവോയ്സ് വീണ്ടും സ്കാൻ ചെയ്യുക' : 'Rescan Sample Invoice')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Split View: Left Document Image, Right Extracted Entities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Authentic Kerala Invoice Preview */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-d)" />
              {language === 'ml' ? 'യഥാർത്ഥ ഇൻവോയ്സ് രേഖ' : 'Original Invoice Document'}
            </h3>
            <span className="glass-badge glass-badge-emerald">
              No: {invoice.invoiceNo}
            </span>
          </div>

          {/* Document Container with Scanning Overlay */}
          <div style={{ 
            position: 'relative', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            border: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            boxShadow: 'var(--shadow)'
          }}>
            <img 
              src={invoice.imageUrl} 
              alt="Real Kerala Tax Invoice" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                transition: 'transform 0.3s ease',
                transform: zoomImage ? 'scale(1.15)' : 'scale(1)'
              }} 
            />

            {/* Scanning Laser Line Animation */}
            {isScanning && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, transparent, var(--emerald-light), #fff, var(--emerald-light), transparent)',
                boxShadow: '0 0 15px var(--emerald-light)',
                animation: 'scanLaser 1.8s infinite ease-in-out'
              }}>
                <style>{`
                  @keyframes scanLaser {
                    0% { top: 0%; opacity: 0.8; }
                    50% { top: 96%; opacity: 1; }
                    100% { top: 0%; opacity: 0.8; }
                  }
                `}</style>
              </div>
            )}

            {/* Bounding Box Highlights */}
            <div style={{
              position: 'absolute',
              top: '17%',
              left: '18%',
              width: '64%',
              height: '8%',
              border: '2px dashed var(--emerald-light)',
              borderRadius: '4px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              pointerEvents: 'none'
            }}>
              <span style={{ 
                position: 'absolute', 
                top: '-22px', 
                left: '0', 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                backgroundColor: 'var(--emerald-main)', 
                color: '#fff', 
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                Vendor: Malabar Spices (99.2%)
              </span>
            </div>

            <div style={{
              position: 'absolute',
              top: '64%',
              left: '60%',
              width: '32%',
              height: '8%',
              border: '2px dashed var(--saffron-main)',
              borderRadius: '4px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              pointerEvents: 'none'
            }}>
              <span style={{ 
                position: 'absolute', 
                bottom: '-22px', 
                right: '0', 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                backgroundColor: 'var(--saffron-main)', 
                color: '#000', 
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                Grand Total: ₹38,055 (100%)
              </span>
            </div>

            {/* Zoom Toggle Button */}
            <button
              onClick={() => setZoomImage(!zoomImage)}
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Eye size={14} />
              {zoomImage ? 'Reset Zoom' : 'Zoom Document'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Dated: {invoice.date}</span>
            <span>Buyer: {invoice.buyerName}</span>
          </div>

        </div>

        {/* Right Column: Extracted Entities & Financial Checksum */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--emerald-light)" />
              {language === 'ml' ? 'വായിച്ചെടുത്ത വിവരങ്ങൾ' : 'Extracted Bill Items & Totals'}
            </h3>
            <span className="glass-badge glass-badge-emerald">
              <CheckCircle2 size={12} />
              {language === 'ml' ? 'പരിശോധിച്ചു' : '100% Verified'}
            </span>
          </div>

          {/* Mathematical Checksum Guardrail Card */}
          <div style={{ 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            background: 'var(--soft)',
            border: '1px solid rgba(63, 122, 92, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={18} color="var(--accent-d)" />
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-d)' }}>
                {language === 'ml' ? 'കണക്കുകൂട്ടൽ പരിശോധന (Exact Match)' : 'Calculation & GST Check (Exact Match)'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              ∑ Line Items (₹32,250.00) + CGST 9% (₹2,902.50) + SGST 9% (₹2,902.50) = <strong>₹38,055.00</strong>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--accent-d)', fontWeight: 600 }}>✓ Variance: ₹0.00 (Tolerance ±₹1.00)</span>
              <span style={{ color: 'var(--accent-d)', fontWeight: 600 }}>✓ GST 18% Verified</span>
            </div>
          </div>

          {/* Vendor Details Box */}
          <div style={{ 
            padding: '14px', 
            borderRadius: 'var(--radius-md)', 
            background: 'var(--tint)',
            border: '1px solid var(--line)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Vendor</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-d)', fontWeight: 600 }}>Confidence: 99.4%</span>
            </div>
            <p className="font-ml" style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>
              {invoice.vendorName} ({invoice.vendorNameMl})
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '2px' }}>
              GSTIN: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-d)', fontWeight: 600 }}>{invoice.vendorGstin}</span> • {invoice.vendorAddress}
            </p>
          </div>

          {/* Extracted Line Items Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
              {language === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ (Extracted Line Items - 5 Rows)' : 'Extracted Commodities (5 Items)'}
            </span>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                    <th style={{ padding: '6px 8px' }}>Item (മലയാളം)</th>
                    <th style={{ padding: '6px 8px' }}>HSN</th>
                    <th style={{ padding: '6px 8px' }}>Qty</th>
                    <th style={{ padding: '6px 8px' }}>Rate</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '8px' }}>
                        <p className="font-ml" style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {item.nameMl}
                        </p>
                      </td>
                      <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
                        {item.hsn}
                      </td>
                      <td style={{ padding: '8px', color: 'var(--ink)', fontWeight: 600 }}>
                        {item.qty}
                      </td>
                      <td style={{ padding: '8px', color: 'var(--muted)' }}>
                        ₹{item.rate.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', color: 'var(--accent-d)', fontWeight: 600 }}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals Summary */}
          <div style={{ 
            padding: '14px', 
            borderRadius: 'var(--radius-md)', 
            background: 'var(--tint)',
            border: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
              <span>Sub Total (തുക)</span>
              <span>₹{invoice.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
              <span>CGST (9%)</span>
              <span>₹{invoice.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
              <span>SGST (9%)</span>
              <span>₹{invoice.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              color: 'var(--ink)', 
              fontWeight: 700, 
              fontSize: '1.05rem', 
              borderTop: '1px solid var(--line)',
              paddingTop: '8px',
              marginTop: '4px'
            }}>
              <span>Grand Total (ആകെ തുക)</span>
              <span style={{ color: 'var(--accent-d)' }}>
                ₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleSyncInventory}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <CheckCircle2 size={16} />
              <span className="font-ml">
                {syncSuccess 
                  ? (language === 'ml' ? 'സ്റ്റോക്കിൽ ചേർത്തു! ✓' : 'Inventory Synced! ✓') 
                  : (language === 'ml' ? 'സ്റ്റോക്കിലേക്ക് മാറ്റുക' : 'Push to Inventory')}
              </span>
            </button>

            <button 
              onClick={handleSendWhatsApp}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              <Send size={16} color="var(--emerald-light)" />
              <span className="font-ml">
                {whatsappSent 
                  ? (language === 'ml' ? 'WhatsApp അയച്ചു! ✓' : 'Dispatched! ✓') 
                  : (language === 'ml' ? 'WhatsApp വഴി ബിൽ അയക്കുക' : 'Send via WhatsApp')}
              </span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
