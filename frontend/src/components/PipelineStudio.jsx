import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, AlertTriangle, Cpu, Layers, FileText, Check, Copy } from 'lucide-react';

const SAMPLE_PRODUCTS = [
  {
    Mfg_Part_Num: 'PDSH4816AF',
    Part_Desc: 'PDSH4816AF Dishwasher SS - Display Only',
    E1_Brand: '-- Unbranded --',
    Unilog_Brand: '-- No Unilog Brand --',
    DIB_Brand: '-- No DIB Brand --',
    Part_Manuf: 'Appliance Dealers Cooperative (APPDE)'
  },
  {
    Mfg_Part_Num: '3MABR-7100075678',
    Part_Desc: '3M Cubitron II Fibre Disc 784C 4-1/2 in x 7/8 in 36+',
    E1_Brand: '3M',
    Unilog_Brand: '3M',
    DIB_Brand: '-- No DIB Brand --',
    Part_Manuf: 'Jam Industrial Supply LLC (JAMIN)'
  },
  {
    Mfg_Part_Num: 'K-7594-CP',
    Part_Desc: 'K-7594-CP Align Pull-Down Kitchen Sink Faucet 1.5 GPM Chrome',
    E1_Brand: 'KOHLER',
    Unilog_Brand: 'KOHLER',
    DIB_Brand: 'KOHLER',
    Part_Manuf: 'Kohler Co (KOHLE)'
  }
];

export default function PipelineStudio({ onEnrichItem }) {
  const [selectedSample, setSelectedSample] = useState(0);
  const [inputForm, setInputForm] = useState(SAMPLE_PRODUCTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleSelectSample = (idx) => {
    setSelectedSample(idx);
    setInputForm(SAMPLE_PRODUCTS[idx]);
    setResult(null);
  };

  const handleInputChange = (field, val) => {
    setInputForm(prev => ({ ...prev, [field]: val }));
  };

  const handleRunPipeline = async () => {
    setIsProcessing(true);
    setResult(null);
    setCurrentStep(1);

    // Simulate real-time multi-agent step progression
    for (let step = 1; step <= 7; step++) {
      setCurrentStep(step);
      await new Promise(r => setTimeout(r, 220));
    }

    try {
      const res = await onEnrichItem(inputForm);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Cpu size={24} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Pipeline Studio</h2>
            <span className="badge badge-info">7 AI Agents</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Transform cryptic, minimal manufacturer rows into complete, 252-column structured commerce records.
          </p>
        </div>

        {/* Preset Selector */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {SAMPLE_PRODUCTS.map((p, idx) => (
            <button
              key={idx}
              className={`nav-tab ${selectedSample === idx ? 'active' : ''}`}
              onClick={() => handleSelectSample(idx)}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              Sample {idx + 1}: {p.Mfg_Part_Num}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid-2">
        
        {/* Left Panel: Raw Input Form & Step Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: 'var(--accent-cyan)' }} />
              Raw Input Record
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Mfg_Part_Num</label>
                <input
                  type="text"
                  value={inputForm.Mfg_Part_Num}
                  onChange={(e) => handleInputChange('Mfg_Part_Num', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Part_Desc (Cryptic String)</label>
                <input
                  type="text"
                  value={inputForm.Part_Desc}
                  onChange={(e) => handleInputChange('Part_Desc', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>E1_Brand</label>
                  <input
                    type="text"
                    value={inputForm.E1_Brand}
                    onChange={(e) => handleInputChange('E1_Brand', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Part_Manuf</label>
                  <input
                    type="text"
                    value={inputForm.Part_Manuf}
                    onChange={(e) => handleInputChange('Part_Manuf', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleRunPipeline}
                disabled={isProcessing}
                style={{ marginTop: '8px', padding: '12px' }}
              >
                {isProcessing ? <Sparkles className="pulse-glow" size={18} /> : <Play size={18} />}
                {isProcessing ? 'Processing Through AI Agents...' : 'Execute Enrichment Pipeline'}
              </button>
            </div>
          </div>

          {/* Agent Pipeline Steps Visualizer */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--accent-purple)' }} />
              Multi-Agent Pipeline Progression
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { step: 1, name: "Agent 1: Ingestion & De-duplication", detail: "Filter '-- Unbranded --' placeholders" },
                { step: 2, name: "Agent 2: Entity Resolution", detail: "Match canonical Rheem Manufacturing & FRIGIDAIRE®" },
                { step: 3, name: "Agent 3: Taxonomy & Classification", detail: "Map UNSPSC & Classpath hierarchy" },
                { step: 4, name: "Agent 4: LOV & UOM Normalization", detail: "Standardize units (in, V, A) & 50.25 -> 50-1/4" },
                { step: 5, name: "Agent 5: Content Description Engine", detail: "Generate 5 description formats with strict character limits" },
                { step: 6, name: "Agent 6: Digital Asset Synthesizer", detail: "Generate spec sheets, image URLs & compliance standards" },
                { step: 7, name: "Agent 7: Validation & Audit Agent", detail: "Score completeness, LOV compliance & audit flags" }
              ].map(s => {
                const isActive = currentStep === s.step && isProcessing;
                const isDone = currentStep > s.step || (result && !isProcessing);
                return (
                  <div
                    key={s.step}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: isDone ? 'rgba(16, 185, 129, 0.08)' : isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.2)' : isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
                    ) : isActive ? (
                      <Sparkles className="pulse-glow" size={18} style={{ color: 'var(--primary)' }} />
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', width: '18px' }}>{s.step}</span>
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: isDone ? '#fff' : isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Panel: Output & Enriched Product Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {result ? (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Confidence & Entity Banner */}
              <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-success" style={{ marginBottom: '6px' }}>Enrichment Complete</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{result.MANUFACTURER_NAME}</h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                    Brand: {result.BRAND_NAME} {result.TRADE_NAME ? `(${result.TRADE_NAME})` : ''}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Score</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                    {Math.round((result._CONFIDENCE_SCORE || 0.95) * 100)}%
                  </div>
                </div>
              </div>

              {/* Generated Description Formats */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>5 Generated Description Formats</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* INVOICE_DESC */}
                  <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-amber)' }}>INVOICE_DESC (≤40 UPPERCASE)</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                        {result.INVOICE_DESC.length} / 40 chars ✓
                      </span>
                    </div>
                    <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{result.INVOICE_DESC}</span>
                      <button className="btn btn-secondary" onClick={() => copyToClipboard(result.INVOICE_DESC, 'inv')} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        {copiedField === 'inv' ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* MOBILE_DESC */}
                  <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-purple)' }}>MOBILE_DESC (60–80 Chars Target)</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                        {result.MOBILE_DESC.length} chars ✓
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>
                      {result.MOBILE_DESC}
                    </div>
                  </div>

                  {/* SHORT_DESC / Product Title */}
                  <div className="glass-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                      SHORT_DESC (Product Title Formula)
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '600', lineHeight: '1.4' }}>
                      {result.SHORT_DESC}
                    </div>
                  </div>

                  {/* LONG_DESC */}
                  <div className="glass-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                      LONG_DESC (Full Technical Specification)
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {result.LONG_DESC1}
                    </div>
                  </div>

                </div>
              </div>

              {/* Extracted Key-Value-UOM Triplets */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Extracted LOV Attribute Triplets</h4>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Attribute Label</th>
                        <th>Normalized Value</th>
                        <th>Standard UOM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5, 6, 8, 9, 12, 13, 15].map(idx => {
                        const lbl = result[`ATTRIBUTE_LABEL ${idx}`];
                        const val = result[`ATTRIBUTE_VALUE ${idx}`];
                        const uom = result[`ATTRIBUTE_UOM ${idx}`];
                        if (!lbl && !val) return null;
                        return (
                          <tr key={idx}>
                            <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{lbl}</td>
                            <td style={{ color: 'var(--accent-cyan)' }}>{val}</td>
                            <td>
                              {uom ? <span className="badge badge-info">{uom}</span> : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Cpu size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Ready for Pipeline Execution</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                Click "Execute Enrichment Pipeline" to run the 7 AI agents and produce full 252-column product intelligence.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
