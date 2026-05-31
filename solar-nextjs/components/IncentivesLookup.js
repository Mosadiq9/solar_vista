'use client';

import { useState } from 'react';
import { Search, MapPin, DollarSign, Leaf, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function IncentivesLookup() {
  const [zipCode, setZipCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, searching, complete
  const [results, setResults] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Validate exactly 5 digits
    if (!/^\d{5}$/.test(zipCode)) return;
    
    setStatus('searching');
    
    // Simulate API delay
    setTimeout(() => {
      const firstDigit = zipCode.charAt(0);
      let stateData = {};
      
      switch(firstDigit) {
        case '9': // West Coast (CA)
          stateData = {
            state: "California",
            stateTitle: "SGIP Battery Rebate",
            stateDesc: "The Self-Generation Incentive Program offers lucrative rebates for installing solar battery storage systems.",
            stateValue: "Up to $2,500",
            utilityTitle: "Net Energy Metering 3.0",
            utilityDesc: "Export excess solar energy back to the grid for credits to offset your nighttime usage.",
            utilityValue: "Variable",
          };
          break;
        case '7': // South (TX)
          stateData = {
            state: "Texas",
            stateTitle: "Property Tax Exemption",
            stateDesc: "100% exemption from the appraised value increase of your home due to your solar installation.",
            stateValue: "100% Exempt",
            utilityTitle: "Oncor/CenterPoint Rebate",
            utilityDesc: "Local utility incentives for installing energy efficient solar + storage systems.",
            utilityValue: "Up to $3,000",
          };
          break;
        case '3': // Southeast (FL)
          stateData = {
            state: "Florida",
            stateTitle: "Sales Tax Exemption",
            stateDesc: "Florida exempts solar energy systems from the state's 6% sales and use tax.",
            stateValue: "6% Savings",
            utilityTitle: "FPL Net Metering",
            utilityDesc: "Full retail rate credits for excess energy pushed back to the Florida Power & Light grid.",
            utilityValue: "1-to-1 Retail",
          };
          break;
        case '1': // Northeast (NY)
          stateData = {
            state: "New York",
            stateTitle: "NY-Sun Megawatt Block",
            stateDesc: "Direct cash incentives based on the size of your solar system and your region within NY.",
            stateValue: "Up to $1,000",
            utilityTitle: "ConEdison Rebate",
            utilityDesc: "Earn extra cash for feeding battery power back to the grid during peak summer demand.",
            utilityValue: "Variable",
          };
          break;
        default: // National Generic
          stateData = {
            state: "Your Region",
            stateTitle: "State Property Tax Exemption",
            stateDesc: "Most states prevent your property taxes from increasing due to the added value of solar panels.",
            stateValue: "Exempt",
            utilityTitle: "Local Utility Net Metering",
            utilityDesc: "Earn credits on your power bill for the excess clean energy your system generates.",
            utilityValue: "Varies by Utility",
          };
      }
      
      setResults(stateData);
      setStatus('complete');
    }, 1200);
  };

  return (
    <section className="incentives-section">
      <style>{`
        .incentives-section {
          padding: 120px 0;
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          font-family: var(--font-primary, system-ui, sans-serif);
        }
        .inc-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .inc-hero {
          text-align: center;
          margin-bottom: 60px;
        }
        .inc-hero h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 24px;
          line-height: 1.1;
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .inc-hero p {
          color: var(--text-secondary);
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        /* Search Bar */
        .inc-search-box {
          max-width: 500px;
          margin: 0 auto 60px auto;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 8px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          transition: border-color 0.3s;
        }
        .inc-search-box:focus-within {
          border-color: var(--accent-green);
          background: var(--glass-bg);
        }
        .inc-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 16px 24px;
          font-size: 1.1rem;
          color: var(--text-primary);
          outline: none;
          letter-spacing: 2px;
        }
        .inc-input::placeholder { color: var(--text-muted); letter-spacing: normal; }
        .inc-btn {
          background: var(--accent-green);
          color: #022c22;
          border: none;
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, transform 0.2s;
        }
        .inc-btn:hover { background: var(--accent-green); transform: scale(1.02); }
        .inc-btn:disabled { background: #064e3b; color: var(--text-secondary); cursor: not-allowed; transform: none; }
        
        /* Loading State */
        .inc-loading {
          text-align: center;
          padding: 40px;
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        
        /* Results Grid */
        .inc-results {
          animation: slideUp 0.5s ease forwards;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        .results-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 992px) { .cards-grid { grid-template-columns: 1fr; } }
        
        .inc-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s;
        }
        .inc-card:hover {
          transform: translateY(-5px);
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(255,255,255,0.04);
        }
        .inc-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--accent-cyan);
        }
        .inc-card.federal::before { background: var(--accent-cyan); }
        .inc-card.state::before { background: var(--accent-green); }
        .inc-card.utility::before { background: var(--accent-glow); }
        
        .card-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .inc-card.federal .card-icon { background: rgba(56, 189, 248, 0.1); color: var(--accent-cyan); }
        .inc-card.state .card-icon { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); }
        .inc-card.utility .card-icon { background: rgba(251, 191, 36, 0.1); color: var(--accent-glow); }
        
        .inc-card h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; }
        .inc-card p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; flex: 1; margin-bottom: 24px; }
        
        .card-value {
          background: rgba(0,0,0,0.3);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .card-value span { color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 600; }
        .card-value strong { font-size: 1.25rem; }
        .inc-card.federal strong { color: var(--accent-cyan); }
        .inc-card.state strong { color: var(--accent-green); }
        .inc-card.utility strong { color: var(--accent-glow); }

        .cta-box {
          margin-top: 60px;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cta-box h3 { font-size: 1.75rem; margin-bottom: 12px; }
        .cta-box p { color: var(--text-secondary); margin-bottom: 32px; max-width: 500px; }
      `}</style>

      <div className="inc-container">
        <div className="inc-hero">
          <h1>Don't leave <span className="text-gradient">money</span><br/> on the table.</h1>
          <p>Enter your ZIP code to instantly discover thousands of dollars in hidden federal, state, and local utility incentives you qualify for.</p>
        </div>

        <form className="inc-search-box" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="inc-input" 
            placeholder="Enter 5-digit ZIP code" 
            value={zipCode}
            onChange={e => setZipCode(e.target.value.replace(/\\D/g, '').slice(0, 5))}
            maxLength={5}
            required
          />
          <button type="submit" className="inc-btn" disabled={zipCode.length !== 5 || status === 'searching'}>
            {status === 'searching' ? 'Searching...' : <><Search size={20} /> Lookup</>}
          </button>
        </form>

        {status === 'searching' && (
          <div className="inc-loading">
            <Search size={48} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl">Scanning regional databases...</h3>
          </div>
        )}

        {status === 'complete' && results && (
          <div className="inc-results">
            <div className="results-header">
              <MapPin className="text-emerald-500" />
              <span>Incentives found for <strong>{results.state}</strong></span>
              <CheckCircle2 className="text-emerald-500 ml-2" />
            </div>

            <div className="cards-grid">
              {/* Federal */}
              <div className="inc-card federal">
                <div className="card-icon"><ShieldCheck size={28} /></div>
                <h3>Federal ITC</h3>
                <p>The Federal Investment Tax Credit allows you to deduct 30% of the total cost of your solar energy system from your federal taxes.</p>
                <div className="card-value">
                  <span>Savings</span>
                  <strong>30% Credit</strong>
                </div>
              </div>

              {/* State */}
              <div className="inc-card state">
                <div className="card-icon"><Leaf size={28} /></div>
                <h3>{results.stateTitle}</h3>
                <p>{results.stateDesc}</p>
                <div className="card-value">
                  <span>Savings</span>
                  <strong>{results.stateValue}</strong>
                </div>
              </div>

              {/* Utility */}
              <div className="inc-card utility">
                <div className="card-icon"><Zap size={28} /></div>
                <h3>{results.utilityTitle}</h3>
                <p>{results.utilityDesc}</p>
                <div className="card-value">
                  <span>Savings</span>
                  <strong>{results.utilityValue}</strong>
                </div>
              </div>
            </div>

            <div className="cta-box">
              <h3>Claim your rebates today.</h3>
              <p>Incentive programs have limited funding and frequently expire. Lock in your exact rebate amounts by scheduling a free consultation.</p>
              <Link href="/#booking" className="inc-btn px-8 py-4 text-lg">
                Book Consultation <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
