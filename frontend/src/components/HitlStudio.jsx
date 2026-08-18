import React, { useState } from 'react';
import { UserCheck, AlertTriangle, CheckCircle2, Edit3, ShieldAlert, Save } from 'lucide-react';

const FLAGGED_ITEMS = [
  {
    id: 1,
    Mfg_Part_Num: 'DCB518ASTS06G',
    Part_Desc: 'Diablo 5 in 18T T-Shank Jig Saw Blade 5-Pack',
    Part_Manuf: 'Freud Inc (2435)',
    MANUFACTURER_NAME: 'Freud Inc',
    BRAND_NAME: 'Freud®',
    INVOICE_DESC: 'JIG SAW BLADE 5IN 18T 5PK',
    _CONFIDENCE_SCORE: 0.78,
    _FLAG_REASON: 'Manufacturer string contained supplier code (2435). Brand verified.'
  },
  {
    id: 2,
    Mfg_Part_Num: '3MABR-7100048736',
    Part_Desc: '3M Cloth Belt 777F 2 in x 72 in 80 Y-weight',
    Part_Manuf: 'Jam Industrial Supply LLC (JAMIN)',
    MANUFACTURER_NAME: '3M',
    BRAND_NAME: '3M®',
    INVOICE_DESC: 'CLOTH BELT 2IN X 72IN 80Y',
    _CONFIDENCE_SCORE: 0.82,
    _FLAG_REASON: 'Complex UOM compound format (2 in x 72 in) requires review.'
  }
];

export default function HitlStudio() {
  const [queue, setQueue] = useState(FLAGGED_ITEMS);
  const [selectedItem, setSelectedItem] = useState(FLAGGED_ITEMS[0]);
  const [editBrand, setEditBrand] = useState(FLAGGED_ITEMS[0].BRAND_NAME);
  const [editInvoice, setEditInvoice] = useState(FLAGGED_ITEMS[0].INVOICE_DESC);
  const [isApproved, setIsApproved] = useState(false);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setEditBrand(item.BRAND_NAME);
    setEditInvoice(item.INVOICE_DESC);
    setIsApproved(false);
  };

  const handleApprove = () => {
    setIsApproved(true);
    setQueue(prev => prev.map(q => q.id === selectedItem.id ? { ...q, _CONFIDENCE_SCORE: 1.0, BRAND_NAME: editBrand, INVOICE_DESC: editInvoice } : q));
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <UserCheck size={24} style={{ color: 'var(--accent-amber)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Human-In-The-Loop (HITL) Review Queue</h2>
            <span className="badge badge-warning">{queue.length} Flagged Items</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Empower domain data stewards to inspect low-confidence predictions, edit field values inline, and approve records for delivery.
          </p>
        </div>
      </div>

      <div className="grid-2">
        
        {/* Left: Queue List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: 'var(--accent-amber)' }} />
            Review Queue
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {queue.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  borderColor: selectedItem.id === item.id ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                  background: selectedItem.id === item.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#fff' }}>{item.Mfg_Part_Num}</span>
                  <span className={`badge ${item._CONFIDENCE_SCORE === 1.0 ? 'badge-success' : 'badge-warning'}`}>
                    {Math.round(item._CONFIDENCE_SCORE * 100)}% Confidence
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{item.Part_Desc}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} /> {item._FLAG_REASON}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inline Audit & Approval Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit3 size={18} style={{ color: 'var(--primary)' }} />
            Data Steward Inspection & Override
          </h3>

          {selectedItem && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Mfg_Part_Num</label>
                <div className="code-block">{selectedItem.Mfg_Part_Num}</div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Canonical Brand Name (With Symbol)</label>
                <input
                  type="text"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-cyan)', fontWeight: '600' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Invoice Description (≤40 Chars, ALL CAPS)</label>
                <input
                  type="text"
                  value={editInvoice}
                  onChange={(e) => setEditInvoice(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', textAlign: 'right' }}>
                  {editInvoice.length} / 40 characters
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button className="btn btn-primary" onClick={handleApprove} disabled={isApproved} style={{ flex: 1 }}>
                  {isApproved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                  {isApproved ? 'Approved & Verified ✓' : 'Save Override & Approve Record'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
