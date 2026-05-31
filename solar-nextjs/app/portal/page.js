'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sun, LogOut, Activity, FileText, Calendar, Wrench, ShieldCheck, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import CustomCursor from '../../components/CustomCursor';
import ThemeInit from '../../components/ThemeInit';

export default function PortalDashboard() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState('idle'); // idle, sending, sent

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    
    setTicketStatus('sending');
    setTimeout(() => {
      setTicketStatus('sent');
      setTicketSubject('');
      setTicketMessage('');
      setTimeout(() => setTicketStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <>
      <CustomCursor />
      <ThemeInit />
      
      <div className="portal-wrapper">
        <style>{`
          .portal-wrapper {
            min-height: 100vh;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font-primary, system-ui, sans-serif);
          }
          
          .portal-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 40px;
            background: var(--glass-bg);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .portal-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
          }
          .portal-user-actions {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          .user-greeting {
            color: var(--text-secondary);
            font-size: 0.95rem;
          }
          .user-greeting strong { color: var(--text-primary); }
          .logout-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: background 0.2s;
          }
          .logout-btn:hover { background: rgba(239, 68, 68, 0.2); }
          
          .portal-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 24px;
          }
          
          .portal-header {
            margin-bottom: 40px;
          }
          .portal-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .portal-header p {
            color: var(--text-secondary);
            font-size: 1.1rem;
          }
          
          .portal-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 24px;
          }
          
          .panel {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
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
          .panel-header h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
          }
          
          /* Specific Panels */
          .panel-health { grid-column: span 8; }
          .panel-warranty { grid-column: span 4; }
          .panel-docs { grid-column: span 6; }
          .panel-maintenance { grid-column: span 6; }
          .panel-support { grid-column: span 12; }
          
          @media (max-width: 992px) {
            .panel-health, .panel-warranty, .panel-docs, .panel-maintenance, .panel-support {
              grid-column: span 12;
            }
          }
          
          /* System Health */
          .health-status {
            display: flex;
            align-items: center;
            gap: 24px;
            padding: 24px;
            background: rgba(16, 185, 129, 0.05);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 16px;
          }
          .status-icon {
            width: 64px; height: 64px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-green);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
          }
          .status-info h4 { font-size: 1.5rem; color: var(--accent-green); margin: 0 0 4px 0; }
          .status-info p { color: var(--text-secondary); margin: 0; }
          
          .health-metrics {
            display: flex;
            gap: 24px;
            margin-top: 24px;
          }
          .h-metric {
            flex: 1;
            background: var(--bg-tertiary);
            padding: 16px;
            border-radius: 12px;
          }
          .h-metric-label { color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px; }
          .h-metric-val { font-size: 1.5rem; font-weight: 700; }
          
          /* Docs List */
          .doc-list { display: flex; flex-direction: column; gap: 12px; }
          .doc-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: var(--bg-tertiary);
            border-radius: 12px;
            transition: background 0.2s;
          }
          .doc-item:hover { background: var(--glass-bg); }
          .doc-info { display: flex; align-items: center; gap: 12px; }
          .doc-info span { font-weight: 500; }
          .download-btn {
            color: var(--accent-cyan);
            background: rgba(56, 189, 248, 0.1);
            padding: 8px 12px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
          }
          .download-btn:hover { background: rgba(56, 189, 248, 0.2); }
          
          /* Support Form */
          .support-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .form-group-full { grid-column: span 2; }
          .s-input, .s-textarea {
            width: 100%;
            background: var(--bg-tertiary);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 16px;
            color: var(--text-primary);
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
          }
          .s-input:focus, .s-textarea:focus { border-color: var(--accent-cyan); }
          .s-textarea { min-height: 120px; resize: vertical; }
          .s-submit {
            background: var(--accent-cyan);
            color: var(--bg-secondary);
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
          }
          .s-submit:hover { transform: translateY(-2px); }
          .s-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
          
        `}</style>
        
        <nav className="portal-nav">
          <Link href="/" className="portal-logo">
            <Sun className="text-sky-400" size={28} /> SolarVista Portal
          </Link>
          <div className="portal-user-actions">
            <span className="user-greeting">Welcome back, <strong>Demo User</strong></span>
            <Link href="/login" className="logout-btn"><LogOut size={16} /> Logout</Link>
          </div>
        </nav>
        
        <div className="portal-container">
          <div className="portal-header">
            <h1>Customer Dashboard</h1>
            <p>Manage your solar system, view documents, and request support.</p>
          </div>
          
          <div className="portal-grid">
            
            {/* System Health */}
            <div className="panel panel-health">
              <div className="panel-header">
                <Activity className="text-sky-400" /> <h3>System Health Overview</h3>
              </div>
              <div className="health-status">
                <div className="status-icon"><CheckCircle2 size={32} /></div>
                <div className="status-info">
                  <h4>All Systems Operational</h4>
                  <p>Your solar array and Powerwall are communicating normally. No issues detected.</p>
                </div>
              </div>
              <div className="health-metrics">
                <div className="h-metric">
                  <div className="h-metric-label">Inverter Status</div>
                  <div className="h-metric-val text-emerald-400">Online</div>
                </div>
                <div className="h-metric">
                  <div className="h-metric-label">Grid Connection</div>
                  <div className="h-metric-val text-emerald-400">Stable</div>
                </div>
                <div className="h-metric">
                  <div className="h-metric-label">Last Ping</div>
                  <div className="h-metric-val text-slate-300">Just now</div>
                </div>
              </div>
            </div>
            
            {/* Warranty */}
            <div className="panel panel-warranty">
              <div className="panel-header">
                <ShieldCheck className="text-emerald-400" /> <h3>Warranty Status</h3>
              </div>
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                  <span className="text-3xl font-bold">25</span>
                </div>
                <h4 className="text-xl font-semibold">Years Remaining</h4>
                <p className="text-slate-400 text-sm mt-2">Comprehensive Bumper-to-Bumper Coverage</p>
              </div>
            </div>
            
            {/* Documents */}
            <div className="panel panel-docs">
              <div className="panel-header">
                <FileText className="text-sky-400" /> <h3>Document Center</h3>
              </div>
              <div className="doc-list">
                <div className="doc-item">
                  <div className="doc-info"><FileText size={18} className="text-slate-400" /> <span>Purchase_Agreement_Signed.pdf</span></div>
                  <button className="download-btn"><Download size={16} /></button>
                </div>
                <div className="doc-item">
                  <div className="doc-info"><FileText size={18} className="text-slate-400" /> <span>Interconnection_Approval.pdf</span></div>
                  <button className="download-btn"><Download size={16} /></button>
                </div>
                <div className="doc-item">
                  <div className="doc-info"><FileText size={18} className="text-slate-400" /> <span>Warranty_Certificate.pdf</span></div>
                  <button className="download-btn"><Download size={16} /></button>
                </div>
              </div>
            </div>
            
            {/* Maintenance */}
            <div className="panel panel-maintenance">
              <div className="panel-header">
                <Calendar className="text-amber-400" /> <h3>Maintenance Schedule</h3>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-700 space-y-8 mt-4">
                <div className="relative">
                  <div className="absolute -left-[31px] bg-amber-400 w-4 h-4 rounded-full border-4 border-slate-900"></div>
                  <h4 className="font-semibold text-lg">Next Upcoming: Panel Cleaning</h4>
                  <p className="text-slate-400 text-sm">October 12, 2026</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] bg-slate-700 w-4 h-4 rounded-full border-4 border-slate-900"></div>
                  <h4 className="font-semibold text-lg text-slate-300">Annual Inverter Inspection</h4>
                  <p className="text-slate-500 text-sm">January 05, 2027</p>
                </div>
              </div>
            </div>
            
            {/* Support Tickets */}
            <div className="panel panel-support">
              <div className="panel-header">
                <Wrench className="text-sky-400" /> <h3>Open a Service Ticket</h3>
              </div>
              <form className="support-form" onSubmit={handleTicketSubmit}>
                <div className="form-group-full">
                  <label className="block text-slate-400 text-sm mb-2">Issue Subject</label>
                  <input 
                    type="text" 
                    className="s-input" 
                    placeholder="Brief description of the issue"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-full">
                  <label className="block text-slate-400 text-sm mb-2">Detailed Description</label>
                  <textarea 
                    className="s-textarea" 
                    placeholder="Please provide as much detail as possible..."
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div>
                  <button type="submit" className="s-submit" disabled={ticketStatus !== 'idle'}>
                    {ticketStatus === 'idle' && <>Submit Ticket</>}
                    {ticketStatus === 'sending' && <>Submitting...</>}
                    {ticketStatus === 'sent' && <><CheckCircle2 size={18} /> Sent Successfully</>}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
