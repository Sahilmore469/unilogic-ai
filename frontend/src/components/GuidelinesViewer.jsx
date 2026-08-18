import React from 'react';
import { BookOpen, FileText, CheckCircle, FileCheck, Hash, Sliders } from 'lucide-react';

export default function GuidelinesViewer() {
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <BookOpen size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>UNILOG Master Content Guidelines & Specification</h2>
          <span className="badge badge-info">Master Reference Rules</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Strict content construction formulas, character limit constraints, UOM standards, and decimal-to-fraction conversion rules.
        </p>
      </div>

      <div className="grid-3">
        
        {/* Rule 1: Description Formulas */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} /> Description Formulas
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div className="glass-card">
              <div style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>INVOICE_DESC</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Constraint: ≤ 40 chars, 100% ALL CAPS. Technical abbreviations required.</div>
            </div>

            <div className="glass-card">
              <div style={{ fontWeight: '700', color: 'var(--accent-purple)' }}>MOBILE_DESC</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Target: 60 to 80 chars. Formula: [Manufacturer] [Brand], [Item Type], [Series], [MPN].</div>
            </div>

            <div className="glass-card">
              <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>SHORT_DESC (Title)</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Formula: [Brand] [Series] [MPN] [Product Name] With [Feature], [Key Attributes].</div>
            </div>
          </div>
        </div>

        {/* Rule 2: Master UOM Standards */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '14px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} /> UOM Standards & Spacing
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div className="glass-card">
              <div style={{ fontWeight: '700', color: '#fff' }}>Approved Units</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>500+ UOM abbreviations (in, ft, V, A, dBA, kW-hr, gpm, psi, deg F).</div>
            </div>

            <div className="glass-card">
              <div style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>Spacing Rule</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Always keep a single space between number and unit (24 in, not 24in; 120 V, not 120V).</div>
            </div>

            <div className="glass-card">
              <div style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>Compound Dimensions</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Format: 24 in W x 24-1/4 in D. Keep 'in' attached to each dimension.</div>
            </div>
          </div>
        </div>

        {/* Rule 3: Decimal to Fraction */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '14px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={18} /> Decimal to Trade Fraction
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div className="glass-card">
              <div style={{ fontWeight: '700', color: '#fff' }}>63 Inch Fractions</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Exact lookups from 1/64 to 63/64. Manufacturers write decimals; trade buyers search fractions.</div>
            </div>

            <div className="glass-card">
              <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>Mixed Fractions</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>50.25 in → 50-1/4 in, 24.25 in → 24-1/4 in, 0.5 in → 1/2 in.</div>
            </div>

            <div className="glass-card">
              <div style={{ fontWeight: '700', color: 'var(--accent-purple)' }}>Symbol Rules</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Preserve registered trademarks (®, ™) on canonical brand and feature names.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
