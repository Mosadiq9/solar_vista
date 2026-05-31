'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, MapPin, Crosshair, Zap, DollarSign, Sun, ArrowRight, Activity, Layers, ShieldCheck } from 'lucide-react';

export default function RoofPreview() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('idle'); // idle, searching, analyzing, complete
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  
  // Settings
  const [systemSize, setSystemSize] = useState(6.0); // kW
  const PANEL_WATTAGE = 400; // 400W per panel
  const panelCount = Math.ceil((systemSize * 1000) / PANEL_WATTAGE);
  
  // Metrics
  const estimatedGeneration = systemSize * 1450; // kWh per year
  const estimatedSavings = estimatedGeneration * 0.15; // assuming $0.15/kWh

  const handleSearch = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setStatus('searching');
    setProgress(0);
    setProgressText('Connecting to satellite network...');
    
    // Simulate complex AI analysis sequence
    setTimeout(() => { setProgress(25); setProgressText('Locating property boundaries...'); }, 800);
    setTimeout(() => { setStatus('analyzing'); setProgress(50); setProgressText('Calculating roof pitch & azimuth...'); }, 1600);
    setTimeout(() => { setProgress(75); setProgressText('Running historical irradiance models...'); }, 2400);
    setTimeout(() => { setProgress(100); setProgressText('Optimizing panel placement...'); }, 3200);
    setTimeout(() => { setStatus('complete'); }, 3800);
  };

  return (
    <section className="roof-preview-section">
      <style>{`
        .roof-preview-section {
          padding: 120px 0 80px 0;
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          font-family: var(--font-primary, system-ui, sans-serif);
        }
        .rp-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .rp-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .rp-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--accent-cyan) 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .rp-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .rp-search-bar {
          max-width: 600px;
          margin: 0 auto 40px auto;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--glass-bg);
          padding: 8px;
          border-radius: 100px;
          border: 1px solid var(--glass-border);
          box-shadow: 0 10px 25px var(--bg-tertiary);
          transition: border-color 0.3s;
        }
        .rp-search-bar:focus-within {
          border-color: var(--accent-cyan);
          background: var(--glass-bg);
        }
        .rp-search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          padding: 12px 24px;
          font-size: 1rem;
          outline: none;
        }
        .rp-search-input::placeholder { color: var(--text-muted); }
        .rp-search-btn {
          background: var(--accent-cyan);
          color: var(--bg-secondary);
          border: none;
          padding: 12px 28px;
          border-radius: 100px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, background 0.2s;
        }
        .rp-search-btn:hover { background: var(--accent-blue); transform: scale(1.02); }
        .rp-search-btn:disabled { background: #475569; color: var(--text-secondary); cursor: not-allowed; transform: none; }

        .rp-loading-container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          padding: 40px;
          background: var(--glass-bg);
          border-radius: 24px;
          border: 1px solid var(--glass-border);
        }
        .rp-progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          margin: 20px 0;
          overflow: hidden;
        }
        .rp-progress-fill {
          height: 100%;
          background: var(--accent-cyan);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .rp-loading-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .rp-results-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 32px;
          animation: slideUp 0.6s ease-out forwards;
        }
        @media (max-width: 992px) { .rp-results-grid { grid-template-columns: 1fr; } }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rp-map-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .rp-map-image {
          object-fit: cover;
          transition: transform 0.3s;
        }
        .rp-map-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: var(--bg-tertiary);
          pointer-events: none;
        }
        
        .rp-panel-grid {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(15deg);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          pointer-events: none;
        }
        .rp-panel {
          width: 28px;
          height: 48px;
          background: var(--nav-bg);
          border: 1px solid var(--accent-cyan);
          border-radius: 2px;
          box-shadow: inset 0 0 10px rgba(56, 189, 248, 0.3);
          transition: all 0.3s ease;
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
          transform: scale(0.5);
        }
        @keyframes popIn { to { opacity: 1; transform: scale(1); } }

        .rp-hud {
          position: absolute;
          bottom: 20px; left: 20px;
          background: var(--nav-bg);
          backdrop-filter: blur(12px);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          display: flex;
          gap: 16px;
        }
        .rp-hud-item { display: flex; flex-direction: column; }
        .rp-hud-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; }
        .rp-hud-val { font-size: 1rem; font-weight: 600; color: var(--text-primary); }

        .rp-controls {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .rp-slider-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .rp-slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rp-slider-label { color: var(--text-secondary); font-weight: 500; }
        .rp-slider-val { color: var(--accent-cyan); font-size: 1.5rem; font-weight: 700; }
        
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px; width: 24px;
          border-radius: 50%;
          background: var(--accent-cyan);
          cursor: pointer;
          margin-top: -9px;
          box-shadow: 0 0 10px rgba(56,189,248,0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 6px;
          cursor: pointer;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .rp-metrics {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .rp-metric {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: 16px;
        }
        .rp-metric-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: rgba(56,189,248,0.1);
          color: var(--accent-cyan);
          display: flex; align-items: center; justify-content: center;
        }
        .rp-metric-icon.green { background: rgba(16,185,129,0.1); color: var(--accent-green); }
        .rp-metric-info h4 { color: var(--text-secondary); font-size: 0.9rem; margin: 0 0 4px 0; }
        .rp-metric-info .val { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); }
      `}</style>

      <div className="rp-container">
        <div className="rp-header" data-animate>
          <h1>AI Roof Analysis</h1>
          <p>Enter your address to instantly see how solar panels will fit on your roof and calculate your estimated savings.</p>
        </div>

        {status === 'idle' && (
          <form className="rp-search-bar" onSubmit={handleSearch} data-animate>
            <MapPin className="text-slate-400 ml-2" />
            <input 
              type="text" 
              className="rp-search-input" 
              placeholder="Enter your home address..." 
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
            <button type="submit" className="rp-search-btn">
              <Search size={18} /> Analyze
            </button>
          </form>
        )}

        {(status === 'searching' || status === 'analyzing') && (
          <div className="rp-loading-container">
            <div className="mb-6"><Crosshair size={48} className="text-sky-400 animate-spin mx-auto" style={{ animationDuration: '3s' }} /></div>
            <h3 className="text-xl font-semibold mb-2">Analyzing Property</h3>
            <div className="rp-progress-bar">
              <div className="rp-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="rp-loading-text"><Activity size={16} className="animate-pulse" /> {progressText}</div>
          </div>
        )}

        {status === 'complete' && (
          <div className="rp-results-grid">
            {/* Map Canvas */}
            <div className="rp-map-container">
              <Image 
                src="/satellite-roof.png" 
                alt="Satellite Roof View" 
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="rp-map-image"
                priority
              />
              <div className="rp-map-overlay"></div>
              
              {/* Dynamic Panel Grid */}
              <div className="rp-panel-grid">
                {Array.from({ length: panelCount }).map((_, i) => (
                  <div key={i} className="rp-panel" style={{ animationDelay: `${i * 0.05}s` }}></div>
                ))}
              </div>

              {/* HUD */}
              <div className="rp-hud">
                <div className="rp-hud-item">
                  <span className="rp-hud-label">Azimuth</span>
                  <span className="rp-hud-val">184° S</span>
                </div>
                <div className="rp-hud-item">
                  <span className="rp-hud-label">Pitch</span>
                  <span className="rp-hud-val">22°</span>
                </div>
                <div className="rp-hud-item">
                  <span className="rp-hud-label">Shading</span>
                  <span className="rp-hud-val text-emerald-400">Minimal</span>
                </div>
              </div>
            </div>

            {/* Controls & Metrics */}
            <div className="rp-controls">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-sky-400" size={24} />
                <h2 className="text-xl font-semibold">{address}</h2>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Our AI has identified optimal mounting planes on your roof. Adjust your system size below to see the impact.
              </p>

              <div className="rp-slider-group">
                <div className="rp-slider-header">
                  <span className="rp-slider-label">System Size</span>
                  <span className="rp-slider-val">{systemSize.toFixed(1)} kW</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="12" 
                  step="0.4" 
                  value={systemSize}
                  onChange={(e) => setSystemSize(parseFloat(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Small (3kW)</span>
                  <span>Large (12kW)</span>
                </div>
              </div>

              <div className="rp-metrics">
                <div className="rp-metric">
                  <div className="rp-metric-icon"><Layers size={24} /></div>
                  <div className="rp-metric-info">
                    <h4>Required Panels</h4>
                    <div className="val">{panelCount} x 400W Maxeon</div>
                  </div>
                </div>
                <div className="rp-metric">
                  <div className="rp-metric-icon"><Zap size={24} /></div>
                  <div className="rp-metric-info">
                    <h4>Estimated Yearly Generation</h4>
                    <div className="val">{estimatedGeneration.toLocaleString()} kWh</div>
                  </div>
                </div>
                <div className="rp-metric">
                  <div className="rp-metric-icon green"><DollarSign size={24} /></div>
                  <div className="rp-metric-info">
                    <h4>Estimated 20-Year Savings</h4>
                    <div className="val text-emerald-400">${(estimatedSavings * 20).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <a href="#contact" className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <ShieldCheck size={20} /> Request Formal Design
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
