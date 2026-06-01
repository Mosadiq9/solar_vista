'use client';
import { Sun, X, LayoutDashboard, Users, FileText, Box, Mail, Settings, LogOut, Menu, Bell, Edit2, Trash2, CalendarCheck, FolderKanban, MessageSquare } from 'lucide-react';
import DynamicIcon from '@/shared/components/DynamicIcon';
import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@/shared/utils/supabase/client';
import Image from 'next/image';

const supabase = createBrowserClient();

// Helpers
function esc(str) { return str ?? ''; }
function capitalise(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('editor'); // default
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Toasts
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 4000);
  };

  // Auth Check
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.id) {
        // Fetch role
        const { data } = await supabase.from('admin_users').select('role').eq('user_id', session.user.id).single();
        if (data) setUserRole(data.role || 'editor');
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session);
      if (data.session?.user?.id) {
        const res = await supabase.from('admin_users').select('role').eq('user_id', data.session.user.id).single();
        if (res.data) setUserRole(res.data.role || 'editor');
      }
    } catch (err) {
      showToast('Login failed: ' + err.message, 'error');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (isLoading) {
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><i className="lucide-loader animate-spin" style={{width: 48, height: 48}}></i></div>;
  }

  if (!session) {
    return (
      <div id="login-view" className="admin-view active">
        <div className="login-card glass-card">
          <div className="logo">
            <Sun className="logo-icon text-solar"></Sun>
            <span>SolarVista Admin</span>
          </div>
          <form id="admin-login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" id="login-email" placeholder="admin@solarvista.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" id="login-password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-primary w-100">Sign In</button>
          </form>
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  return (
    <div id="dashboard-view" className="admin-view active">
      <div id="sidebar-overlay" className={`sidebar-overlay ${isMobileSidebarOpen ? 'active' : ''}`} onClick={() => setIsMobileSidebarOpen(false)}></div>
      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`} id="admin-sidebar">
        <div className="logo">
          <Sun className="logo-icon text-solar"></Sun>
          <span>SolarVista</span>
          <button id="close-sidebar-btn" className="mobile-only-btn" onClick={() => setIsMobileSidebarOpen(false)}><X></X></button>
        </div>
        <nav className="admin-nav">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}>
            <LayoutDashboard></LayoutDashboard> Dashboard
          </button>
          <button className={`nav-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => { setActiveTab('leads'); setIsMobileSidebarOpen(false); }}>
            <Users></Users> Leads
          </button>
          <button className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => { setActiveTab('bookings'); setIsMobileSidebarOpen(false); }}>
            <CalendarCheck></CalendarCheck> Bookings
          </button>
          <button className={`nav-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => { setActiveTab('blogs'); setIsMobileSidebarOpen(false); }}>
            <FileText></FileText> Blog CMS
          </button>
          <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}>
            <Box></Box> Product CMS
          </button>
          <button className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => { setActiveTab('projects'); setIsMobileSidebarOpen(false); }}>
            <FolderKanban></FolderKanban> Projects CMS
          </button>
          <button className={`nav-btn ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => { setActiveTab('testimonials'); setIsMobileSidebarOpen(false); }}>
            <MessageSquare></MessageSquare> Testimonials CMS
          </button>
          <button className={`nav-btn ${activeTab === 'subscribers' ? 'active' : ''}`} onClick={() => { setActiveTab('subscribers'); setIsMobileSidebarOpen(false); }}>
            <Mail></Mail> Subscribers
          </button>
          {(userRole === 'super_admin' || userRole === 'admin') && (
            <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}>
              <Settings></Settings> Settings
            </button>
          )}
        </nav>
        <button id="logout-btn" className="nav-btn logout-btn" onClick={handleLogout}>
          <LogOut></LogOut> Sign Out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button id="mobile-menu-btn" className="mobile-only-btn" onClick={() => setIsMobileSidebarOpen(true)}><Menu></Menu></button>
            <h1 id="page-title">{capitalise(activeTab) || 'Dashboard'}</h1>
          </div>
        </header>

        {activeTab === 'dashboard' && <DashboardSection setActiveTab={setActiveTab} />}
        {activeTab === 'leads' && <LeadsSection showToast={showToast} />}
        {activeTab === 'bookings' && <BookingsSection showToast={showToast} />}
        {activeTab === 'blogs' && <BlogsSection showToast={showToast} />}
        {activeTab === 'products' && <ProductsSection showToast={showToast} />}
        {activeTab === 'projects' && <ProjectsSection showToast={showToast} />}
        {activeTab === 'testimonials' && <TestimonialsSection showToast={showToast} />}
        {activeTab === 'subscribers' && <SubscribersSection />}
        {activeTab === 'settings' && (userRole === 'super_admin' || userRole === 'admin') && <SettingsSection showToast={showToast} userRole={userRole} />}
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

// =============================================
// TOAST CONTAINER
// =============================================
function ToastContainer({ toasts }) {
  return (
    <div id="toast-container" className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type} ${t.hiding ? 'hiding' : ''}`}>
          <DynamicIcon name={t.type === 'success' ? 'check-circle' : t.type === 'error' ? 'x-circle' : 'info'}></DynamicIcon>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// =============================================
// DASHBOARD SECTION
// =============================================
function DashboardSection({ setActiveTab }) {
  const [stats, setStats] = useState({ leads: 0, newLeads: 0, products: 0, blogs: 0, bookings: 0, projects: 0, testimonials: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [funnelData, setFunnelData] = useState({ new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      try {
        const [leadsRes, blogsRes, productsRes, bookingsRes, projectsRes, testimonialsRes] = await Promise.all([
          supabase.from('leads').select('id, status', { count: 'exact' }),
          supabase.from('blogs').select('id', { count: 'exact' }),
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('bookings').select('id', { count: 'exact' }),
          supabase.from('projects').select('id', { count: 'exact' }),
          supabase.from('testimonials').select('id', { count: 'exact' })
        ]);
        
        const leadsData = leadsRes.data || [];
        const newLeads = leadsData.filter(l => !l.status || l.status === 'new').length;
        
        const funnel = { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 };
        leadsData.forEach(l => {
          const s = l.status || 'new';
          if (funnel[s] !== undefined) funnel[s]++;
        });
        setFunnelData(funnel);

        setStats({
          leads: leadsRes.count ?? leadsData.length,
          newLeads,
          products: productsRes.count ?? 0,
          blogs: blogsRes.count ?? 0,
          bookings: bookingsRes.count ?? 0,
          projects: projectsRes.count ?? 0,
          testimonials: testimonialsRes.count ?? 0
        });

        const [recentLRes, recentBRes] = await Promise.all([
          supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5)
        ]);
        setRecentLeads(recentLRes.data || []);
        setRecentBookings(recentBRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="content-section active">
      <div className="stats-grid" id="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-icon"><Users></Users></div>
          <div className="stat-value">{loading ? '—' : stats.leads}</div>
          <div className="stat-label">Total Leads</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CalendarCheck></CalendarCheck></div>
          <div className="stat-value">{loading ? '—' : stats.bookings}</div>
          <div className="stat-label">Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FolderKanban></FolderKanban></div>
          <div className="stat-value">{loading ? '—' : stats.projects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><MessageSquare></MessageSquare></div>
          <div className="stat-value">{loading ? '—' : stats.testimonials}</div>
          <div className="stat-label">Testimonials</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Box></Box></div>
          <div className="stat-value">{loading ? '—' : stats.products}</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FileText></FileText></div>
          <div className="stat-value">{loading ? '—' : stats.blogs}</div>
          <div className="stat-label">Articles</div>
        </div>
      </div>

      {/* Funnel & Trends */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1', minWidth: '300px', padding: '24px' }}>
          <h3 className="dashboard-section-title">Lead Conversion Funnel</h3>
          <div style={{ display: 'flex', gap: '8px', height: '120px', alignItems: 'flex-end', marginTop: '24px' }}>
            {['new', 'contacted', 'qualified', 'proposal', 'closed'].map(status => {
              const count = funnelData[status];
              const max = Math.max(...Object.values(funnelData), 1);
              const heightPct = (count / max) * 100;
              return (
                <div key={status} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100%', backgroundColor: `var(--status-${status}-bg, rgba(245,158,11,0.2))`, height: `${heightPct}%`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.85rem', fontWeight: 600 }}>{count}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card" style={{ flex: '1', minWidth: '300px', padding: '24px' }}>
          <h3 className="dashboard-section-title">Monthly Trends (Simulated)</h3>
          <div style={{ display: 'flex', gap: '12px', height: '120px', alignItems: 'flex-end', marginTop: '24px' }}>
            {[40, 60, 45, 80, 55, 90].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'var(--gradient-solar)', height: `${h}%`, borderRadius: '4px 4px 0 0' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>M{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div className="recent-leads-card" style={{ flex: '2', minWidth: '400px' }}>
          <div className="recent-leads-header">
            <h3>Recent Leads</h3>
            <button className="view-all-btn" onClick={() => setActiveTab('leads')}>View All →</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="3" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
                : recentLeads.length === 0 ? <tr><td colSpan="3" style={{textAlign:'center', padding: '32px'}}>No leads yet.</td></tr>
                : recentLeads.map(l => (
                  <tr key={l.id}>
                    <td>{new Date(l.created_at).toLocaleDateString()}</td>
                    <td><strong>{esc(l.name)}</strong></td>
                    <td><span className={`status-badge status-${esc(l.status || 'new')}`}>{capitalise(l.status || 'New')}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="recent-leads-card" style={{ flex: '1', minWidth: '300px' }}>
          <div className="recent-leads-header">
            <h3>Upcoming Bookings</h3>
            <button className="view-all-btn" onClick={() => setActiveTab('bookings')}>View All →</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="2" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
                : recentBookings.length === 0 ? <tr><td colSpan="2" style={{textAlign:'center', padding: '32px'}}>No bookings yet.</td></tr>
                : recentBookings.map(b => (
                  <tr key={b.id}>
                    <td><div style={{ fontSize: '0.85rem' }}>{esc(b.date)}<br/><span style={{ color: 'var(--text-secondary)' }}>{esc(b.time)}</span></div></td>
                    <td><strong>{esc(b.name)}</strong></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// =============================================
// LEADS SECTION
// =============================================
function LeadsSection({ showToast }) {
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [drawerLead, setDrawerLead] = useState(null);

  const fetchLeads = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAllLeads(data || []);
    } catch (err) {
      console.error(err);
      showToast('Error loading leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = allLeads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || (l.name||'').toLowerCase().includes(q) || (l.email||'').toLowerCase().includes(q);
    const matchStatus = !statusFilter || (l.status || 'new') === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateLeadStatus = async (newStatus) => {
    if (!drawerLead) return;
    try {
      const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', drawerLead.id);
      if (error) throw error;
      setDrawerLead({ ...drawerLead, status: newStatus });
      setAllLeads(prev => prev.map(l => l.id === drawerLead.id ? { ...l, status: newStatus } : l));
      showToast(`Status updated to "${capitalise(newStatus)}"`, 'success');
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  return (
    <section className="content-section active">
      <div className="table-toolbar">
        <input type="text" className="toolbar-search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="toolbar-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal Sent</option>
          <option value="closed">Closed</option>
        </select>
        <span className="toolbar-count">{filtered.length} of {allLeads.length} leads</span>
      </div>
      
      <div className="glass-card table-container">
        <table className="admin-table leads-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>System Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan="6" style={{textAlign:'center', padding: '32px'}}>No leads found.</td></tr>
              : filtered.map(l => (
                <tr key={l.id} onClick={() => setDrawerLead(l)}>
                  <td>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td><strong>{esc(l.name)}</strong></td>
                  <td>{esc(l.email)}</td>
                  <td>{esc(l.phone)}</td>
                  <td>{esc(l.system_type || '—')}</td>
                  <td><span className={`status-badge status-${esc(l.status || 'new')}`}>{capitalise(l.status || 'New')}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <div className={`lead-drawer-overlay ${drawerLead ? 'active' : ''}`} onClick={() => setDrawerLead(null)}></div>
      <div className={`lead-drawer ${drawerLead ? 'active' : ''}`}>
        {drawerLead && (
          <>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">{drawerLead.name || '—'}</h2>
                <p className="drawer-subtitle">Submitted: {new Date(drawerLead.created_at).toLocaleString()}</p>
              </div>
              <button className="drawer-close" onClick={() => setDrawerLead(null)}><X></X></button>
            </div>
            
            <div className="drawer-field"><div className="drawer-field-label">Email</div><div className="drawer-field-value">{drawerLead.email || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Phone</div><div className="drawer-field-value">{drawerLead.phone || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">System Type</div><div className="drawer-field-value">{drawerLead.system_type || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Address</div><div className="drawer-field-value">{drawerLead.address || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Message</div><div className="drawer-field-value">{drawerLead.message || '—'}</div></div>
            
            <div className="drawer-divider"></div>
            
            <div className="drawer-field">
              <div className="drawer-field-label">Update Status</div>
              <select className="drawer-status-select" value={drawerLead.status || 'new'} onChange={e => updateLeadStatus(e.target.value)}>
                <option value="new">🟢 New</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="qualified">🟣 Qualified</option>
                <option value="proposal">🟡 Proposal Sent</option>
                <option value="closed">✅ Closed</option>
              </select>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// =============================================
// BOOKINGS SECTION
// =============================================
function BookingsSection({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerBooking, setDrawerBooking] = useState(null);

  const fetchBookings = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error(err);
      showToast('Error loading bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateBookingStatus = async (newStatus) => {
    if (!drawerBooking) return;
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', drawerBooking.id);
      if (error) throw error;
      setDrawerBooking({ ...drawerBooking, status: newStatus });
      setBookings(prev => prev.map(b => b.id === drawerBooking.id ? { ...b, status: newStatus } : b));
      showToast(`Status updated to "${capitalise(newStatus)}"`, 'success');
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  return (
    <section className="content-section active">
      <div className="glass-card table-container">
        <div className="cms-header">
          <h2>Manage Bookings</h2>
        </div>
        <table className="admin-table leads-table">
          <thead>
            <tr>
              <th>Submitted</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : bookings.length === 0 ? <tr><td colSpan="6" style={{textAlign:'center', padding: '32px'}}>No bookings found.</td></tr>
              : bookings.map(b => (
                <tr key={b.id} onClick={() => setDrawerBooking(b)}>
                  <td>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td><strong>{esc(b.name)}</strong></td>
                  <td>{esc(b.email)}</td>
                  <td>{esc(b.date)}</td>
                  <td>{esc(b.time)}</td>
                  <td><span className={`status-badge status-${esc(b.status || 'upcoming')}`}>{capitalise(b.status || 'upcoming')}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <div className={`lead-drawer-overlay ${drawerBooking ? 'active' : ''}`} onClick={() => setDrawerBooking(null)}></div>
      <div className={`lead-drawer ${drawerBooking ? 'active' : ''}`}>
        {drawerBooking && (
          <>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">{drawerBooking.name || '—'}</h2>
                <p className="drawer-subtitle">Submitted: {new Date(drawerBooking.created_at).toLocaleString()}</p>
              </div>
              <button className="drawer-close" onClick={() => setDrawerBooking(null)}><X></X></button>
            </div>
            
            <div className="drawer-field"><div className="drawer-field-label">Email</div><div className="drawer-field-value">{drawerBooking.email || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Phone</div><div className="drawer-field-value">{drawerBooking.phone || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Date</div><div className="drawer-field-value">{drawerBooking.date || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Time</div><div className="drawer-field-value">{drawerBooking.time || '—'}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Service Type</div><div className="drawer-field-value">{capitalise(drawerBooking.service_type || 'consultation')}</div></div>
            <div className="drawer-field"><div className="drawer-field-label">Notes</div><div className="drawer-field-value">{drawerBooking.notes || '—'}</div></div>
            
            <div className="drawer-divider"></div>
            
            <div className="drawer-field">
              <div className="drawer-field-label">Update Status</div>
              <select className="drawer-status-select" value={drawerBooking.status || 'upcoming'} onChange={e => updateBookingStatus(e.target.value)}>
                <option value="upcoming">🔵 Upcoming</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">🔴 Cancelled</option>
                <option value="rescheduled">🟡 Rescheduled</option>
              </select>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// =============================================
// IMAGE UPLOAD HELPER
// =============================================
async function uploadImage(file) {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
  
  const { error } = await supabase.storage.from('images').upload(fileName, file);
  if (error) throw error;
  
  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
}

// =============================================
// BLOGS SECTION
// =============================================
function BlogsSection({ showToast }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', category: '', icon: 'file-text', image_url: '' });
  const [file, setFile] = useState(null);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const fetchBlogs = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
      showToast('Error loading articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  useEffect(() => {
    if (modalOpen && !quillInstance.current && editorRef.current && window.Quill) {
      quillInstance.current = new window.Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your article content here…',
        modules: { toolbar: [ [{ header: [2, 3, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean'] ] }
      });
    }
    if (modalOpen && quillInstance.current) {
      quillInstance.current.root.innerHTML = editingBlog ? (editingBlog.excerpt || '') : '';
    }
  }, [modalOpen, editingBlog]);

  const handleOpenModal = (blog = null) => {
    setEditingBlog(blog);
    if (blog) {
      setFormData({ title: blog.title, category: blog.category, icon: blog.icon || 'file-text', image_url: blog.image_url || '' });
    } else {
      setFormData({ title: '', category: '', icon: 'file-text', image_url: '' });
    }
    setFile(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (quillInstance.current) quillInstance.current.root.innerHTML = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.image_url;
      if (file) {
        const uploaded = await uploadImage(file);
        if (uploaded) finalImageUrl = uploaded;
      }
      
      const payload = {
        title: formData.title,
        category: formData.category,
        icon: formData.icon,
        image_url: finalImageUrl,
        excerpt: quillInstance.current ? quillInstance.current.root.innerHTML : ''
      };
      
      let error;
      if (editingBlog) {
        const res = await supabase.from('blogs').update(payload).eq('id', editingBlog.id);
        error = res.error;
      } else {
        const res = await supabase.from('blogs').insert([payload]);
        error = res.error;
      }
      if (error) throw error;
      
      showToast(editingBlog ? 'Article updated!' : 'Article published!', 'success');
      handleCloseModal();
      fetchBlogs();
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      showToast('Article deleted.', 'info');
      fetchBlogs();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <section className="content-section active">
      <div className="glass-card">
        <div className="cms-header">
          <h2>Manage Articles</h2>
          <button className="btn-primary" onClick={() => handleOpenModal()}>New Article</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="4" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : blogs.length === 0 ? <tr><td colSpan="4" style={{textAlign:'center', padding: '32px'}}>No articles found.</td></tr>
              : blogs.map(b => (
                <tr key={b.id}>
                  <td>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td><strong>{esc(b.title)}</strong></td>
                  <td>{esc(b.category)}</td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(b)}><Edit2></Edit2></button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(b.id)}><Trash2></Trash2></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={`modal-overlay ${modalOpen ? 'active' : ''}`}>
        <div className="modal-content glass-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="modal-header">
            <h2>{editingBlog ? 'Edit Article' : 'Create New Article'}</h2>
            <button className="btn-text" onClick={handleCloseModal}><X></X></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" placeholder="e.g. Technology" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '50px' }}>
              <label>Content</label>
              <div ref={editorRef} style={{height: '160px'}}></div>
            </div>
            <div className="form-group">
              <label>Cover Image</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              <input type="text" placeholder="Or enter Image URL" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{marginTop:'8px'}} />
              {(formData.image_url || file) && <Image src={file ? URL.createObjectURL(file) : formData.image_url} width={240} height={160} className="image-preview visible" style={{objectFit: 'cover'}} alt="Preview" />}
            </div>
            <div className="form-group">
              <label>Icon (Lucide name)</label>
              <input type="text" required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" className="btn-primary">{editingBlog ? 'Save Changes' : 'Publish Article'}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// =============================================
// PRODUCTS SECTION
// =============================================
function ProductsSection({ showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', category: '', description: '', image_url: '', model_url: '', specs: '[{"value": "440W", "label": "Output"}]', features: '["Feature 1", "Feature 2"]', icon: 'box' });
  const [file, setFile] = useState(null);

  const fetchProducts = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      showToast('Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name, category: product.category, description: product.description,
        image_url: product.image_url || '', model_url: product.model_url || '',
        specs: JSON.stringify(product.specs || []), features: JSON.stringify(product.features || []),
        icon: product.icon || 'box'
      });
    } else {
      setFormData({ name: '', category: '', description: '', image_url: '', model_url: '', specs: '[{"value": "440W", "label": "Output"}]', features: '["Feature 1", "Feature 2"]', icon: 'box' });
    }
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsedSpecs, parsedFeatures;
      try { parsedSpecs = JSON.parse(formData.specs); } catch { throw new Error('Invalid Specs JSON'); }
      try { parsedFeatures = JSON.parse(formData.features); } catch { throw new Error('Invalid Features JSON'); }

      let finalImageUrl = formData.image_url;
      if (file) {
        const uploaded = await uploadImage(file);
        if (uploaded) finalImageUrl = uploaded;
      }

      const payload = {
        name: formData.name, category: formData.category, description: formData.description,
        image_url: finalImageUrl, model_url: formData.model_url,
        specs: parsedSpecs, features: parsedFeatures, icon: formData.icon
      };

      let error;
      if (editingProduct) {
        const res = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([payload]);
        error = res.error;
      }
      if (error) throw error;

      showToast(editingProduct ? 'Product updated!' : 'Product saved!', 'success');
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showToast('Product deleted.', 'info');
      fetchProducts();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <section className="content-section active">
      <div className="glass-card">
        <div className="cms-header">
          <h2>Manage Products</h2>
          <button className="btn-primary" onClick={() => handleOpenModal()}>New Product</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>3D Model URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : products.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding: '32px'}}>No products found.</td></tr>
              : products.map(p => (
                <tr key={p.id}>
                  <td><strong>{esc(p.name)}</strong></td>
                  <td>{esc(p.category)}</td>
                  <td>{p.image_url ? <Image src={p.image_url} width={48} height={36} style={{objectFit:'cover', borderRadius:'4px'}} alt="" /> : '—'}</td>
                  <td style={{maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{esc(p.model_url || '—')}</td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(p)}><Edit2></Edit2></button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(p.id)}><Trash2></Trash2></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={`modal-overlay ${modalOpen ? 'active' : ''}`}>
        <div className="modal-content glass-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="modal-header">
            <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
            <button className="btn-text" onClick={() => setModalOpen(false)}><X></X></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Product Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="form-group"><label>Category</label><input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
            <div className="form-group"><label>Description</label><textarea rows="2" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
            <div className="form-group">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              <input type="text" placeholder="Or enter Image URL" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{marginTop:'8px'}} />
              {(formData.image_url || file) && <Image src={file ? URL.createObjectURL(file) : formData.image_url} width={240} height={160} className="image-preview visible" style={{objectFit: 'cover'}} alt="Preview" />}
            </div>
            <div className="form-group"><label>3D Model GLTF/GLB URL (Optional)</label><input type="text" value={formData.model_url} onChange={e => setFormData({...formData, model_url: e.target.value})} /></div>
            <div className="form-group"><label>Specs (JSON Array)</label><input type="text" value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} /></div>
            <div className="form-group"><label>Features (JSON Array)</label><input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} /></div>
            <div className="form-group"><label>Icon (Lucide name)</label><input type="text" required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} /></div>
            
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingProduct ? 'Save Changes' : 'Save Product'}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// =============================================
// PROJECTS SECTION
// =============================================
function ProjectsSection({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', category: '', power: '', savings: '', description: '', image_url: '', icon: 'home', featured: false });
  const [file, setFile] = useState(null);

  const fetchProjects = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error(err);
      showToast('Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      setFormData({
        name: project.name, category: project.category, power: project.power || '', savings: project.savings || '',
        description: project.description || '', image_url: project.image_url || '', icon: project.icon || 'home', featured: project.featured || false
      });
    } else {
      setFormData({ name: '', category: '', power: '', savings: '', description: '', image_url: '', icon: 'home', featured: false });
    }
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.image_url;
      if (file) {
        const uploaded = await uploadImage(file);
        if (uploaded) finalImageUrl = uploaded;
      }

      const payload = { ...formData, image_url: finalImageUrl };

      let error;
      if (editingProject) {
        const res = await supabase.from('projects').update(payload).eq('id', editingProject.id);
        error = res.error;
      } else {
        const res = await supabase.from('projects').insert([payload]);
        error = res.error;
      }
      if (error) throw error;

      showToast(editingProject ? 'Project updated!' : 'Project saved!', 'success');
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      showToast('Project deleted.', 'info');
      fetchProjects();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <section className="content-section active">
      <div className="glass-card">
        <div className="cms-header">
          <h2>Manage Projects</h2>
          <button className="btn-primary" onClick={() => handleOpenModal()}>New Project</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Power</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : projects.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding: '32px'}}>No projects found.</td></tr>
              : projects.map(p => (
                <tr key={p.id}>
                  <td><strong>{esc(p.name)}</strong></td>
                  <td>{esc(p.category)}</td>
                  <td>{esc(p.power || '—')}</td>
                  <td>{p.featured ? '⭐ Yes' : 'No'}</td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(p)}><Edit2></Edit2></button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(p.id)}><Trash2></Trash2></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={`modal-overlay ${modalOpen ? 'active' : ''}`}>
        <div className="modal-content glass-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="modal-header">
            <h2>{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
            <button className="btn-text" onClick={() => setModalOpen(false)}><X></X></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Project Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="form-group"><label>Category</label><input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
            <div className="form-group"><label>Power (e.g. 12.4 kW)</label><input type="text" value={formData.power} onChange={e => setFormData({...formData, power: e.target.value})} /></div>
            <div className="form-group"><label>Savings (e.g. $2,400/yr saved)</label><input type="text" value={formData.savings} onChange={e => setFormData({...formData, savings: e.target.value})} /></div>
            <div className="form-group"><label>Description</label><textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
            <div className="form-group">
              <label>Project Image</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              <input type="text" placeholder="Or enter Image URL" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{marginTop:'8px'}} />
              {(formData.image_url || file) && <Image src={file ? URL.createObjectURL(file) : formData.image_url} width={240} height={160} className="image-preview visible" style={{objectFit: 'cover'}} alt="Preview" />}
            </div>
            <div className="form-group"><label>Icon (Lucide name)</label><input type="text" required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} /></div>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <input type="checkbox" id="featured-checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: 'auto' }} />
              <label htmlFor="featured-checkbox" style={{ margin: 0 }}>Featured Project</label>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingProject ? 'Save Changes' : 'Save Project'}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// =============================================
// TESTIMONIALS SECTION
// =============================================
function TestimonialsSection({ showToast }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  
  const [formData, setFormData] = useState({ text: '', name: '', location: '', initials: '', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', rating: 5, featured: false, video_url: '' });

  const fetchTestimonials = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error(err);
      showToast('Error loading testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleOpenModal = (testimonial = null) => {
    setEditingTestimonial(testimonial);
    if (testimonial) {
      setFormData({
        text: testimonial.text, name: testimonial.name, location: testimonial.location || '', initials: testimonial.initials || '',
        gradient: testimonial.gradient || 'linear-gradient(135deg, #f59e0b, #ef4444)', rating: testimonial.rating || 5,
        featured: testimonial.featured || false, video_url: testimonial.video_url || ''
      });
    } else {
      setFormData({ text: '', name: '', location: '', initials: '', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', rating: 5, featured: false, video_url: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let error;
      if (editingTestimonial) {
        const res = await supabase.from('testimonials').update(formData).eq('id', editingTestimonial.id);
        error = res.error;
      } else {
        const res = await supabase.from('testimonials').insert([formData]);
        error = res.error;
      }
      if (error) throw error;

      showToast(editingTestimonial ? 'Testimonial updated!' : 'Testimonial saved!', 'success');
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      showToast('Testimonial deleted.', 'info');
      fetchTestimonials();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <section className="content-section active">
      <div className="glass-card table-container">
        <div className="cms-header">
          <h2>Manage Testimonials</h2>
          <button className="btn-primary" onClick={() => handleOpenModal()}>New Testimonial</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Preview</th>
              <th>Rating</th>
              <th>Featured</th>
              <th>Video</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : testimonials.length === 0 ? <tr><td colSpan="6" style={{textAlign:'center', padding: '32px'}}>No testimonials found.</td></tr>
              : testimonials.map(t => (
                <tr key={t.id}>
                  <td><strong>{esc(t.name)}</strong><br/><small className="text-secondary">{esc(t.location)}</small></td>
                  <td><div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{esc(t.text)}</div></td>
                  <td>{t.rating} ⭐</td>
                  <td>{t.featured ? 'Yes' : 'No'}</td>
                  <td>{t.video_url ? '🎥' : '—'}</td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(t)}><Edit2></Edit2></button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(t.id)}><Trash2></Trash2></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={`modal-overlay ${modalOpen ? 'active' : ''}`}>
        <div className="modal-content glass-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="modal-header">
            <h2>{editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}</h2>
            <button className="btn-text" onClick={() => setModalOpen(false)}><X></X></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Customer Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="form-group"><label>Initials (e.g. JD)</label><input type="text" value={formData.initials} onChange={e => setFormData({...formData, initials: e.target.value})} /></div>
            <div className="form-group"><label>Location</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <div className="form-group"><label>Testimonial Text</label><textarea required rows="4" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}></textarea></div>
            <div className="form-group"><label>Rating (1-5)</label><input type="number" required min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} /></div>
            <div className="form-group">
              <label>Avatar Gradient</label>
              <select className="drawer-status-select" value={formData.gradient} onChange={e => setFormData({...formData, gradient: e.target.value})}>
                <option value="linear-gradient(135deg, #f59e0b, #ef4444)">Orange to Red</option>
                <option value="linear-gradient(135deg, #10b981, #3b82f6)">Green to Blue</option>
                <option value="linear-gradient(135deg, #8b5cf6, #ec4899)">Purple to Pink</option>
                <option value="linear-gradient(135deg, #6366f1, #a855f7)">Indigo to Purple</option>
                <option value="linear-gradient(135deg, #f59e0b, #10b981)">Orange to Green</option>
                <option value="linear-gradient(135deg, #ef4444, #8b5cf6)">Red to Purple</option>
              </select>
            </div>
            <div className="form-group"><label>Video URL (Optional YouTube/Vimeo link)</label><input type="text" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} /></div>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <input type="checkbox" id="test-featured-checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: 'auto' }} />
              <label htmlFor="test-featured-checkbox" style={{ margin: 0 }}>Featured (Show on Landing Page)</label>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingTestimonial ? 'Save Changes' : 'Save Testimonial'}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// =============================================
// SUBSCRIBERS SECTION
// =============================================
function SubscribersSection() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubs() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setSubscribers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSubs();
  }, []);

  return (
    <section className="content-section active">
      <div className="glass-card table-container">
        <div className="cms-header"><h2>Newsletter Subscribers</h2></div>
        <table className="admin-table">
          <thead><tr><th>Date Subscribed</th><th>Email Address</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="2" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : subscribers.length === 0 ? <tr><td colSpan="2" style={{textAlign:'center', padding: '32px'}}>No subscribers yet.</td></tr>
              : subscribers.map(sub => (
                <tr key={sub.id}>
                  <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td><strong>{esc(sub.email)}</strong></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// =============================================
// SETTINGS SECTION
// =============================================
function SettingsSection({ showToast, userRole }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (userRole !== 'super_admin' && userRole !== 'admin') return;
    try {
      const { data, error } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      showToast('Error loading admin users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [userRole]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    try {
      const { error } = await window.supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast('Password updated successfully!', 'success');
      e.target.reset();
    } catch (err) {
      showToast('Failed to update password: ' + err.message, 'error');
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    const email = e.target.inviteEmail.value;
    const role = e.target.inviteRole.value;
    
    try {
      // In a real app, you would use a serverless function to create the auth.users record securely.
      // For this demo, we'll assume the user will sign up themselves, but we'll add them to the admin_users table.
      // Or they can be invited via Supabase Dashboard.
      const { error } = await supabase.from('admin_users').insert([{ email, role }]);
      if (error) throw error;
      
      showToast('User invited! They need to sign up with this email.', 'success');
      e.target.reset();
      fetchUsers();
    } catch (err) {
      showToast('Failed to invite user: ' + err.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (userRole !== 'super_admin') {
      showToast('Only super_admins can delete users.', 'error');
      return;
    }
    if (!window.confirm('Remove this admin user?')) return;
    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', id);
      if (error) throw error;
      showToast('User removed.', 'info');
      fetchUsers();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <section className="content-section active">
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1', minWidth: '300px', alignSelf: 'flex-start' }}>
          <div className="cms-header"><h2>Update Password</h2></div>
          <form onSubmit={handlePasswordSubmit} style={{ marginTop: '24px' }}>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" placeholder="Enter new password" required minLength="6" />
            </div>
            <button type="submit" className="btn-primary w-100">Update Password</button>
          </form>
        </div>

        {userRole === 'super_admin' && (
          <div className="glass-card table-container" style={{ flex: '2', minWidth: '400px' }}>
            <div className="cms-header">
              <h2>Manage Admin Users</h2>
            </div>
            
            <form onSubmit={handleInviteUser} style={{ padding: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end', borderBottom: '1px solid var(--glass-border)' }}>
              <div className="form-group" style={{ margin: 0, flex: 1 }}>
                <label>Email Address</label>
                <input type="email" name="inviteEmail" required placeholder="newadmin@example.com" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Role</label>
                <select name="inviteRole" className="drawer-status-select" style={{ padding: '14px 36px 14px 16px' }}>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '13px 24px' }}>Invite User</button>
            </form>

            <table className="admin-table">
              <thead><tr><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="3" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
                  : users.length === 0 ? <tr><td colSpan="3" style={{textAlign:'center', padding: '32px'}}>No other users.</td></tr>
                  : users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{esc(u.email)}</strong></td>
                      <td><span className={`status-badge status-${u.role === 'super_admin' ? 'closed' : u.role === 'admin' ? 'proposal' : 'contacted'}`}>{capitalise(u.role).replace('_', ' ')}</span></td>
                      <td>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteUser(u.id)}><Trash2></Trash2></button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
