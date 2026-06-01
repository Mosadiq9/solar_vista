'use client';

import { useState } from 'react';
import { Zap, Car, Clock, Smartphone, ShieldCheck, Sun, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EVCharger() {
  const [milesPerMonth, setMilesPerMonth] = useState(1000);
  
  // A typical gas car gets 25 MPG. Gas is ~$3.50/gal -> $0.14 per mile
  // An EV gets ~3.5 miles per kWh. Solar energy cost is essentially $0 (once paid off) or ~$0.05 LCOE -> $0.014 per mile
  const gasCost = milesPerMonth * 0.14;
  const evCost = milesPerMonth * 0.015;
  const monthlySavings = gasCost - evCost;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="ev-section">
      <style>{`
        .ev-section {
          padding-top: 120px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        .ev-hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
          text-align: center;
        }
        .ev-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(168, 85, 247, 0.1);
          color: var(--accent-purple);
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }
        .ev-hero h1 {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 24px;
          line-height: 1.1;
        }
        .ev-hero h1 span {
          background: linear-gradient(135deg, var(--accent-purple) 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ev-hero p {
          color: var(--text-secondary);
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto 40px auto;
        }
        .ev-cta-group {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        
        .ev-specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto 100px auto;
          padding: 0 24px;
        }
        @media (max-width: 992px) {
          .ev-specs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .ev-specs-grid { grid-template-columns: 1fr; }
        }
        .ev-spec-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 32px;
          transition: transform 0.3s;
        }
        .ev-spec-card:hover {
          transform: translateY(-5px);
        }
        .ev-spec-icon {
          width: 56px;
          height: 56px;
          background: rgba(168, 85, 247, 0.1);
          color: var(--accent-purple);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .ev-spec-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .ev-spec-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .ev-calc-wrapper {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 27, 75, 0.8) 100%);
          border-top: 1px solid rgba(168, 85, 247, 0.2);
          border-bottom: 1px solid rgba(168, 85, 247, 0.2);
          padding: 100px 24px;
        }
        .ev-calc-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 992px) {
          .ev-calc-inner { grid-template-columns: 1fr; }
        }

        .calc-box {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          color: #f8fafc;
        }
        .calc-label { display: flex; justify-content: space-between; margin-bottom: 16px; color: #94a3b8; }
        .calc-val { color: #f8fafc; font-weight: 600; font-size: 1.25rem; }
        
        input[type=range] {
          -webkit-appearance: none; width: 100%; background: transparent; margin-bottom: 40px;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 28px; width: 28px; border-radius: 50%;
          background: var(--accent-purple); cursor: pointer; margin-top: -11px;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 6px; cursor: pointer;
          background: rgba(255, 255, 255, 0.1); border-radius: 3px;
        }

        .savings-result {
          display: flex; gap: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 32px; margin-bottom: 32px;
        }
        .s-block { flex: 1; }
        .s-label { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 8px; }
        .s-amount { font-size: 2rem; font-weight: 700; color: var(--accent-green); }

        .calc-btn {
          width: 100%; background: var(--accent-purple); color: white; border: none;
          padding: 16px; border-radius: 12px; font-weight: 600; font-size: 1.1rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: filter 0.2s;
          text-decoration: none;
        }
        .calc-btn:hover { filter: brightness(1.1); }
      `}</style>

      <div className="ev-hero">
        <div className="ev-badge"><Car size={16} /> Level 2 EV Charger</div>
        <h1>Fuel Your Car <br/>With <span>Sunshine</span></h1>
        <p>Bypass the gas station forever. Our Level 2 EV Charger integrates seamlessly with your solar ecosystem to power your commute for a fraction of the cost.</p>
        <div className="ev-cta-group">
          <Link href="/#booking" className="btn-primary">Get a Free Quote</Link>
          <a href="#calculator" className="btn-secondary">Calculate Savings</a>
        </div>
      </div>

      <div className="ev-specs-grid">
        <div className="ev-spec-card">
          <div className="ev-spec-icon"><Zap size={24} /></div>
          <h3>Lightning Fast</h3>
          <p>Charge up to 9x faster than a standard wall outlet. Add up to 50 miles of range per hour of charging.</p>
        </div>
        <div className="ev-spec-card">
          <div className="ev-spec-icon"><Clock size={24} /></div>
          <h3>Smart Scheduling</h3>
          <p>Set your charger to automatically draw power during peak solar production hours or off-peak utility rates.</p>
        </div>
        <div className="ev-spec-card">
          <div className="ev-spec-icon"><Car size={24} /></div>
          <h3>Universal Compatibility</h3>
          <p>Equipped with a standard J1772 connector and NACS adapter, it works with every EV on the market, including Tesla.</p>
        </div>
        <div className="ev-spec-card">
          <div className="ev-spec-icon"><ShieldCheck size={24} /></div>
          <h3>Weather Resistant</h3>
          <p>NEMA 4-rated enclosure ensures safe, reliable charging whether installed inside your garage or outside in the elements.</p>
        </div>
        <div className="ev-spec-card">
          <div className="ev-spec-icon"><Smartphone size={24} /></div>
          <h3>App Control</h3>
          <p>Monitor charging status, adjust amperage, and view energy consumption history directly from the SolarVista app.</p>
        </div>
        <div className="ev-spec-card">
          <div className="ev-spec-icon"><Sun size={24} /></div>
          <h3>Solar Integration</h3>
          <p>When paired with SolarVista panels, you can charge your car using 100% clean, renewable energy.</p>
        </div>
      </div>

      <div id="calculator" className="ev-calc-wrapper">
        <div className="ev-calc-inner">
          <div className="calc-info" style={{maxWidth: '500px'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px'}}>Calculate Your EV Savings</h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6'}}>
              See how much you could save by switching from gas to a solar-powered electric vehicle.
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 className="text-emerald-400" size={20} /> Zero gas station visits</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 className="text-emerald-400" size={20} /> Wake up with a full tank every morning</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 className="text-emerald-400" size={20} /> 30% Federal Tax Credit applies</div>
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
              Book a Consultation <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
