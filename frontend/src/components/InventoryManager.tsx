import React, { useState } from 'react';
import type { Language, InventoryItem } from '../types';
import { MOCK_INVENTORY } from '../mockData';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Send, 
  TrendingUp, 
  Search,
  Filter,
  Sparkles
} from 'lucide-react';

interface InventoryManagerProps {
  language: Language;
  onOpenVoiceModal: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ language, onOpenVoiceModal }) => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [restockedItemId, setRestockedItemId] = useState<string | null>(null);

  const handleQuickRestock = (item: InventoryItem) => {
    setRestockedItemId(item.id);
    setTimeout(() => {
      setItems(items.map(i => i.id === item.id ? { ...i, currentStock: i.currentStock + 20, lastRestocked: 'Just now (Agent Order)' } : i));
      setRestockedItemId(null);
    }, 1500);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.nameMl.includes(searchQuery);
    const matchesCat = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const lowStockCount = items.filter(i => i.currentStock <= i.reorderLevel).length;

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
                <Package size={14} />
                Prisma ORM • PostgreSQL
              </span>
              {lowStockCount > 0 && (
                <span className="glass-badge glass-badge-rose">
                  <AlertTriangle size={14} />
                  {lowStockCount} Items Low Stock
                </span>
              )}
            </div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--ink)' }}>
              {language === 'ml' 
                ? 'സ്റ്റോക്ക് & ഉൽപ്പന്ന മാനേജ്‌മെന്റ്' 
                : 'Inventory & Commodities Management'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '780px', marginTop: '4px' }}>
              {language === 'ml'
                ? 'സ്റ്റോക്ക് തീരാറാകുമ്പോൾ ഏജന്റ് സ്വയം മുന്നറിയിപ്പ് നൽകുന്നു. ഒരൊറ്റ ക്ലിക്കിലൂടെയോ ശബ്ദ നിർദ്ദേശത്തിലൂടെയോ മൊത്തക്കച്ചവടക്കാരന് WhatsApp വഴി ഓർഡർ നൽകാം.'
                : 'Real-time inventory levels synced automatically via voice commands and invoice scans. Trigger supplier restocking orders over WhatsApp with one click.'}
            </p>
          </div>

          <button 
            onClick={onOpenVoiceModal}
            className="btn-primary"
            style={{ padding: '12px 20px', gap: '8px' }}
          >
            <Plus size={16} />
            <span className="font-ml">
              {language === 'ml' ? 'ശബ്ദം വഴി സ്റ്റോക്ക് ചേർക്കുക' : 'Add Stock via Voice'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--muted)" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ തിരയുക (ഉദാ: ഏലക്ക, കുരുമുളക്)...' : 'Search commodities (e.g. Cardamom, Pepper)...'}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ink)',
              fontSize: '0.9rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'spices', 'oils', 'grains', 'vegetables'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--line)' : 'transparent',
                background: selectedCategory === cat ? 'var(--soft)' : 'var(--tint)',
                color: selectedCategory === cat ? 'var(--accent-d)' : 'var(--muted)',
                fontSize: '0.78rem',
                fontWeight: selectedCategory === cat ? 600 : 500,
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Commodity Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredItems.map((item) => {
          const isLowStock = item.currentStock <= item.reorderLevel;
          const percentage = Math.min(100, Math.round((item.currentStock / (item.reorderLevel * 3)) * 100));

          return (
            <div 
              key={item.id}
              className="glass-panel glass-panel-hover"
              style={{ 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px',
                border: isLowStock ? '1px solid #f6cfcf' : '1px solid var(--line)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="glass-badge glass-badge-indigo" style={{ fontSize: '0.68rem', marginBottom: '6px' }}>
                    {language === 'ml' ? item.categoryMl : item.category}
                  </span>
                  <h3 className="font-ml" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)' }}>
                    {item.nameMl}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {item.name}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-d)' }}>
                    ₹{item.unitPrice}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    /{item.unit}
                  </span>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '2px' }}>
                    Cost: ₹{item.costPrice}
                  </p>
                </div>
              </div>

              {/* Stock Gauge / Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: isLowStock ? 'var(--rose-main)' : 'var(--muted)', fontWeight: 600 }}>
                    {isLowStock ? '⚠️ Low Stock Alert' : 'Stock In Hand'}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    {item.currentStock} {item.unit} (Min: {item.reorderLevel} {item.unit})
                  </span>
                </div>

                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--tint)', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${percentage}%`, 
                    backgroundColor: isLowStock ? 'var(--rose-main)' : 'var(--accent)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                <span>Restocked: {item.lastRestocked}</span>
                
                <button
                  onClick={() => handleQuickRestock(item)}
                  disabled={restockedItemId === item.id}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.72rem', gap: '6px' }}
                >
                  <Send size={12} color="var(--accent-d)" />
                  <span className="font-ml">
                    {restockedItemId === item.id 
                      ? 'ഓർഡർ ചെയ്യുന്നു...' 
                      : (language === 'ml' ? 'സപ്ലയർക്ക് WhatsApp ഓർഡർ' : 'Reorder via WhatsApp')}
                  </span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
