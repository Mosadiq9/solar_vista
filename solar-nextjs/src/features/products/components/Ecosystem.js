'use client';

import { useState } from 'react';
import { Sun, Battery, Car, Home, Zap, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Ecosystem() {
  const [milesPerMonth, setMilesPerMonth] = useState(1000);
  
  // A typical gas car gets 25 MPG. Gas is ~$3.50/gal -> $0.14 per mile
  // An EV gets ~3.5 miles per kWh. Solar energy cost is essentially $0 (once paid off) or ~$0.05 LCOE -> $0.014 per mile
  const gasCost = milesPerMonth * 0.14;
  const evCost = milesPerMonth * 0.015;
  const monthlySavings = gasCost - evCost;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="eco-section">
      <style>{`
        .eco-section {
          padding: 120px 0;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-primary, system-ui, sans-serif);
          overflow: hidden;
        }
        .eco-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .eco-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .eco-header h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 24px;
          line-height: 1.1;
        }
        .eco-header h1 span {
          background: linear-gradient(135deg, var(--accent-purple) 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .eco-header p {
          color: var(--text-secondary);
          font-size: 1.15rem;
          max-width: 700px;
          margin: 0 auto;
        }

        /* SVG Flow Diagram */
        .eco-flow-diagram {
          position: relative;
          max-width: 800px;
          margin: 0 auto 100px auto;
          aspect-ratio: 16/9;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 32px;
          padding: 40px;
        }
        .flow-node {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 2px solid #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          transition: transform 0.3s, border-color 0.3s;
        }
        .flow-node:hover {
          transform: scale(1.1);
        }
        .node-sun { top: 10%; left: 10%; border-color: var(--accent-glow); color: var(--accent-glow); box-shadow: 0 0 30px rgba(251,191,36,0.2); }
        .node-panels { top: 10%; left: 50%; transform: translateX(-50%); border-color: var(--accent-cyan); color: var(--accent-cyan); }
        .node-panels:hover { transform: translateX(-50%) scale(1.1); }
        .node-battery { top: 50%; left: 50%; transform: translate(-50%, -50%); border-color: var(--accent-green); color: var(--accent-green); }
        .node-battery:hover { transform: translate(-50%, -50%) scale(1.1); }
        .node-home { bottom: 10%; left: 20%; border-color: #f43f5e; color: #f43f5e; }
        .node-ev { bottom: 10%; right: 20%; border-color: var(--accent-purple); color: var(--accent-purple); }
        .node-app { top: 50%; right: 10%; transform: translateY(-50%); border-color: #6366f1; color: #6366f1; }
        .node-app:hover { transform: translateY(-50%) scale(1.1); }

        .node-label {
          position: absolute;
          bottom: -30px;
          white-space: nowrap;
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
          left: 50%;
          transform: translateX(-50%);
        }

        /* SVG Lines */
        .flow-lines {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
        }
        .line-path {
          fill: none;
          stroke: rgba(255,255,255,0.1);
          stroke-width: 4;
          stroke-dasharray: 10, 10;
        }
        .line-animated {
          fill: none;
          stroke: var(--accent-glow);
          stroke-width: 4;
          stroke-dasharray: 10, 10;
          animation: flowAnim 20s linear infinite;
        }
        .line-animated.blue { stroke: var(--accent-cyan); }
        .line-animated.green { stroke: var(--accent-green); }
        .line-animated.purple { stroke: var(--accent-purple); }

        @keyframes flowAnim {
          to { stroke-dashoffset: -1000; }
        }

        /* Feature Cards */
        .eco-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-bottom: 100px;
        }
        @media (max-width: 768px) { .eco-grid { grid-template-columns: 1fr; } }
        
        .eco-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          display: flex;
          gap: 24px;
          transition: background 0.3s;
        }
        .eco-card:hover { background: rgba(255,255,255,0.04); }
        .eco-card-icon {
          width: 64px; height: 64px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .eco-card h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 12px; }
        .eco-card p { color: var(--text-secondary); line-height: 1.6; }

        .c-solar { background: rgba(56,189,248,0.1); color: var(--accent-cyan); }
        .c-battery { background: rgba(16,185,129,0.1); color: var(--accent-green); }
        .c-ev { background: rgba(168,85,247,0.1); color: var(--accent-purple); }
        .c-app { background: rgba(99,102,241,0.1); color: #6366f1; }

        /* Calculator Section */
        .ev-calc-section {
          background: linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(99,102,241,0.1) 100%);
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: 32px;
          padding: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 992px) { .ev-calc-section { grid-template-columns: 1fr; padding: 40px 24px; } }
        
        .calc-info h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 16px; }
        .calc-info p { color: #cbd5e1; font-size: 1.1rem; line-height: 1.6; margin-bottom: 32px; }
        .calc-features { display: flex; flex-direction: column; gap: 16px; }
        .calc-feature { display: flex; align-items: center; gap: 12px; color: #e2e8f0; }

        .calc-box {
          background: rgba(15,23,42,0.95);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
          color: var(--text-primary);
        }
        .calc-label { display: flex; justify-content: space-between; margin-bottom: 16px; color: var(--text-secondary); }
        .calc-val { color: var(--text-primary); font-weight: 600; font-size: 1.25rem; }
        
        input[type=range] {
          -webkit-appearance: none; width: 100%; background: transparent; margin-bottom: 40px;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 28px; width: 28px; border-radius: 50%;
          background: var(--accent-purple); cursor: pointer; margin-top: -11px;
          box-shadow: 0 0 15px rgba(168,85,247,0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 6px; cursor: pointer;
          background: rgba(255,255,255,0.1); border-radius: 3px;
        }

        .savings-result {
          display: flex; gap: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 32px; margin-bottom: 32px;
        }
        .s-block { flex: 1; }
        .s-label { color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; margin-bottom: 8px; }
        .s-amount { font-size: 2rem; font-weight: 700; color: var(--accent-green); }

        .calc-btn {
          width: 100%; background: var(--accent-purple); color: var(--text-primary); border: none;
          padding: 16px; border-radius: 12px; font-weight: 600; font-size: 1.1rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s;
        }
        .calc-btn:hover { background: var(--accent-purple); }
      `}</style>

      <div className="eco-container">
        <div className="eco-header">
          <h1>The Complete <span>Energy Ecosystem</span></h1>
          <p>Don't just generate power. Store it, manage it, and use it to fuel your life. See how all the pieces fit perfectly together.</p>
        </div>

        {/* Interactive Diagram */}
        <div className="eco-flow-diagram hidden md:block">
          <svg className="flow-lines" viewBox="0 0 800 450" preserveAspectRatio="none">
            {/* Sun to Panels */}
            <path className="line-path" d="M 120 85 Q 260 85 400 85" />
            <path className="line-animated" d="M 120 85 Q 260 85 400 85" />
            
            {/* Panels to Battery */}
            <path className="line-path" d="M 400 125 L 400 225" />
            <path className="line-animated blue" d="M 400 125 L 400 225" />
            
            {/* Battery to Home */}
            <path className="line-path" d="M 360 265 Q 240 265 240 365" />
            <path className="line-animated green" d="M 360 265 Q 240 265 240 365" />
            
            {/* Battery to EV */}
            <path className="line-path" d="M 440 265 Q 560 265 560 365" />
            <path className="line-animated green" d="M 440 265 Q 560 265 560 365" />

            {/* Battery to App */}
            <path className="line-path" d="M 440 225 Q 640 225 640 225" />
            <path className="line-animated blue" d="M 440 225 Q 640 225 640 225" />
          </svg>

          <div className="flow-node node-sun"><Sun size={32} /> <span className="node-label">The Sun</span></div>
          <div className="flow-node node-panels"><Zap size={32} /> <span className="node-label">Solar Array</span></div>
          <div className="flow-node node-battery"><Battery size={32} /> <span className="node-label">Smart Battery</span></div>
          <div className="flow-node node-home"><Home size={32} /> <span className="node-label">Your Home</span></div>
          <div className="flow-node node-ev"><Car size={32} /> <span className="node-label">EV Charger</span></div>
          <div className="flow-node node-app"><Smartphone size={32} /> <span className="node-label">Mobile App</span></div>
        </div>

        {/* Feature Cards */}
        <div className="eco-grid">
          <div className="eco-card">
            <div className="eco-card-icon c-solar"><Zap size={32} /></div>
            <div>
              <h3>1. Generate</h3>
              <p>High-efficiency monocrystalline panels convert sunlight directly into clean, free DC electricity for your home.</p>
            </div>
          </div>
          <div className="eco-card">
            <div className="eco-card-icon c-battery"><Battery size={32} /></div>
            <div>
              <h3>2. Store</h3>
              <p>The Smart Battery captures excess daytime solar energy, keeping your lights on at night and protecting you from grid outages.</p>
            </div>
          </div>
          <div className="eco-card">
            <div className="eco-card-icon c-ev"><Car size={32} /></div>
            <div>
              <h3>3. Drive</h3>
              <p>Our integrated Level 2 EV Charger allows you to fuel your electric vehicle using 100% clean, free sunshine directly from your roof.</p>
            </div>
          </div>
          <div className="eco-card">
            <div className="eco-card-icon c-app"><Smartphone size={32} /></div>
            <div>
              <h3>4. Control</h3>
              <p>The centralized mobile app gives you real-time visibility and control over where every single watt of energy is flowing.</p>
            </div>
          </div>
        </div>

        {/* EV Upsell Calculator */}
        <div className="ev-calc-section">
          <div className="calc-info">
            <h2>Charge on Sunshine, Not Gasoline.</h2>
            <p>Integrating a Level 2 EV charger into your solar installation allows you to bypass the gas station forever. See how much you could save.</p>
            <div className="calc-features">
              <div className="calc-feature"><CheckCircle2 className="text-emerald-400" size={20} /> Zero gas station visits</div>
              <div className="calc-feature"><CheckCircle2 className="text-emerald-400" size={20} /> Charge overnight on stored battery power</div>
              <div className="calc-feature"><CheckCircle2 className="text-emerald-400" size={20} /> 30% Federal Tax Credit applies to the charger too</div>
            </div>
          </div>

          <div className="calc-box">
            <div className="calc-label">
              <span>Miles driven per month</span>
              <span className="calc-val">{milesPerMonth.toLocaleString()} miles</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="3000" 
              step="100" 
              value={milesPerMonth} 
              onChange={e => setMilesPerMonth(parseInt(e.target.value))} 
            />

            <div className="savings-result">
              <div className="s-block">
                <div className="s-label">Monthly Savings</div>
                <div className="s-amount">${Math.round(monthlySavings).toLocaleString()}</div>
              </div>
              <div className="s-block">
                <div className="s-label">Yearly Savings</div>
                <div className="s-amount">${Math.round(yearlySavings).toLocaleString()}</div>
              </div>
            </div>

            <Link href="/#booking" className="calc-btn">
              Design My Ecosystem <ArrowRight size={20} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
