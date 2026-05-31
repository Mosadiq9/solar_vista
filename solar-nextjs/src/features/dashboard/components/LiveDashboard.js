'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Home, Battery, BatteryCharging, Zap, Leaf, DollarSign, Activity } from 'lucide-react';

const generateHistoricalData = () => {
  const data = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate Solar: bell curve peaking at noon
    let solar = 0;
    if (hour > 6 && hour < 19) {
      solar = Math.max(0, 8 * Math.sin(((hour - 6) / 13) * Math.PI) + (Math.random() * 1.5 - 0.75));
    }
    
    // Simulate Home Usage: peaks in morning and evening
    let usage = 1.0 + Math.random() * 0.5;
    if (hour >= 7 && hour <= 9) usage += 2.0;
    if (hour >= 18 && hour <= 22) usage += 3.5;
    
    data.push({
      time: `${hour}:00`,
      solar: Number(solar.toFixed(2)),
      usage: Number(usage.toFixed(2))
    });
  }
  return data;
};

export default function LiveDashboard() {
  const [data, setData] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({
    solar: 0,
    usage: 0,
    battery: 100,
    grid: 0
  });

  const [impact, setImpact] = useState({
    co2: 12.4, // tons
    savings: 4520 // dollars
  });

  useEffect(() => {
    setData(generateHistoricalData());

    const interval = setInterval(() => {
      const hour = new Date().getHours();
      
      let newSolar = 0;
      if (hour > 6 && hour < 19) {
        newSolar = Math.max(0, 8 * Math.sin(((hour - 6) / 13) * Math.PI) + (Math.random() * 0.5));
      }
      
      let newUsage = 1.0 + Math.random() * 0.5;
      if (hour >= 7 && hour <= 9) newUsage += 2.0;
      if (hour >= 18 && hour <= 22) newUsage += 3.5;

      let newGrid = 0;
      let newBatteryLevel = liveMetrics.battery;
      
      // Basic power flow logic
      const net = newSolar - newUsage;
      if (net > 0) {
        // Charging battery or exporting to grid
        if (newBatteryLevel < 100) {
          newBatteryLevel = Math.min(100, newBatteryLevel + (net * 0.1));
        } else {
          newGrid = -net; // Exporting
        }
      } else {
        // Discharging battery or importing from grid
        if (newBatteryLevel > 20) {
          newBatteryLevel = Math.max(20, newBatteryLevel + (net * 0.2));
        } else {
          newGrid = -net; // Importing (net is negative, so newGrid is positive)
        }
      }

      setLiveMetrics({
        solar: Number(newSolar.toFixed(1)),
        usage: Number(newUsage.toFixed(1)),
        battery: Number(newBatteryLevel.toFixed(1)),
        grid: Number(newGrid.toFixed(1))
      });

      // Increment savings slowly for demo effect
      setImpact(prev => ({
        co2: prev.co2 + 0.0001,
        savings: prev.savings + 0.01
      }));

    }, 2000);

    return () => clearInterval(interval);
  }, [liveMetrics.battery]);

  return (
    <section className="dashboard-wrapper">
      <style>{`
        .dashboard-wrapper {
          padding: 120px 0 80px 0;
          background: #09090b;
          color: #f8fafc;
          min-height: 100vh;
        }
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .dashboard-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dashboard-header p {
          color: #94a3b8;
          font-size: 1.1rem;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        .metric-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          backdrop-filter: blur(12px);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .metric-card:hover {
          transform: translateY(-5px);
          border-color: rgba(251, 191, 36, 0.4);
        }
        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
        }
        .metric-icon.solar { color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
        .metric-icon.home { color: #38bdf8; background: rgba(56, 189, 248, 0.1); }
        .metric-icon.battery { color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .metric-icon.grid { color: #8b5cf6; background: rgba(139, 92, 246, 0.1); }
        
        .metric-details h3 {
          font-size: 0.9rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .metric-details .value {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .metric-details .unit {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        
        @media (max-width: 992px) {
          .main-content { grid-template-columns: 1fr; }
        }
        
        .chart-panel, .impact-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(12px);
        }
        .panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .panel-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .impact-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          margin-bottom: 16px;
        }
        .impact-item .icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .impact-item .icon.green { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .impact-item .icon.blue { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
        .impact-info h4 { color: #94a3b8; font-size: 0.9rem; margin-bottom: 4px; }
        .impact-info .val { font-size: 1.75rem; font-weight: 700; color: #fff; }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Live Energy Dashboard</h1>
          <p>Real-time monitoring of your solar ecosystem</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon solar"><Sun size={28} /></div>
            <div className="metric-details">
              <h3>Solar Power</h3>
              <div className="value">{liveMetrics.solar} <span className="unit">kW</span></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon home"><Home size={28} /></div>
            <div className="metric-details">
              <h3>Home Usage</h3>
              <div className="value">{liveMetrics.usage} <span className="unit">kW</span></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon battery">
              {liveMetrics.solar > liveMetrics.usage ? <BatteryCharging size={28} /> : <Battery size={28} />}
            </div>
            <div className="metric-details">
              <h3>Powerwall</h3>
              <div className="value">{liveMetrics.battery} <span className="unit">%</span></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon grid"><Zap size={28} /></div>
            <div className="metric-details">
              <h3>Grid {liveMetrics.grid < 0 ? 'Export' : 'Import'}</h3>
              <div className="value">{Math.abs(liveMetrics.grid)} <span className="unit">kW</span></div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="chart-panel">
            <div className="panel-header">
              <Activity className="text-amber-400" />
              <h2>Generation vs. Consumption (24h)</h2>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="solar" name="Solar Generation (kW)" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorSolar)" />
                  <Area type="monotone" dataKey="usage" name="Home Usage (kW)" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="impact-panel">
            <div className="panel-header">
              <Leaf className="text-emerald-400" />
              <h2>Lifetime Impact</h2>
            </div>
            <div className="impact-item">
              <div className="icon green"><Leaf size={24} /></div>
              <div className="impact-info">
                <h4>CO₂ Offset</h4>
                <div className="val">{impact.co2.toFixed(4)} <span style={{fontSize: '1rem', color: '#94a3b8', fontWeight: 500}}>Tons</span></div>
              </div>
            </div>
            <div className="impact-item">
              <div className="icon blue"><DollarSign size={24} /></div>
              <div className="impact-info">
                <h4>Estimated Savings</h4>
                <div className="val">${impact.savings.toFixed(2)}</div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-400 leading-relaxed">
              This interactive dashboard demonstrates the comprehensive telemetry available to all SolarVista customers post-installation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
