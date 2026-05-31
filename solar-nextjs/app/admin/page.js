'use client';
import { Sun, X, LayoutDashboard, Users, FileText, Box, Mail, Settings, LogOut, Menu, Bell, Edit2, Trash2 } from 'lucide-react';
import DynamicIcon from '../../components/DynamicIcon';
import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '../../utils/supabase/client';
import Image from 'next/image';

const supabase = createBrowserClient();

// Helpers
function esc(str) { return str ?? ''; }
function capitalise(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
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
          <button className={`nav-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => { setActiveTab('blogs'); setIsMobileSidebarOpen(false); }}>
            <FileText></FileText> Blog CMS
          </button>
          <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}>
            <Box></Box> Product CMS
          </button>
          <button className={`nav-btn ${activeTab === 'subscribers' ? 'active' : ''}`} onClick={() => { setActiveTab('subscribers'); setIsMobileSidebarOpen(false); }}>
            <Mail></Mail> Subscribers
          </button>
          <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}>
            <Settings></Settings> Settings
          </button>
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
        {activeTab === 'blogs' && <BlogsSection showToast={showToast} />}
        {activeTab === 'products' && <ProductsSection showToast={showToast} />}
        {activeTab === 'subscribers' && <SubscribersSection />}
        {activeTab === 'settings' && <SettingsSection showToast={showToast} />}
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
  const [stats, setStats] = useState({ leads: 0, newLeads: 0, products: 0, blogs: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      try {
        const [leadsRes, blogsRes, productsRes] = await Promise.all([
          supabase.from('leads').select('id, status', { count: 'exact' }),
          supabase.from('blogs').select('id', { count: 'exact' }),
          supabase.from('products').select('id', { count: 'exact' })
        ]);
        const leadsData = leadsRes.data || [];
        const newLeads = leadsData.filter(l => !l.status || l.status === 'new').length;
        setStats({
          leads: leadsRes.count ?? leadsData.length,
          newLeads,
          products: productsRes.count ?? 0,
          blogs: blogsRes.count ?? 0
        });

        const { data: recent } = await supabase
          .from('leads').select('*').order('created_at', { ascending: false }).limit(5);
        setRecentLeads(recent || []);
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
      <div className="stats-grid" id="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users></Users></div>
          <div className="stat-value">{loading ? '—' : stats.leads}</div>
          <div className="stat-label">Total Leads</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Bell></Bell></div>
          <div className="stat-value">{loading ? '—' : stats.newLeads}</div>
          <div className="stat-label">New Leads</div>
          <div className="stat-change">Awaiting contact</div>
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

      <div className="recent-leads-card">
        <div className="recent-leads-header">
          <h3>Recent Leads</h3>
          <button className="view-all-btn" onClick={() => setActiveTab('leads')}>View All →</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>System Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{textAlign:'center', padding: '32px'}}>Loading...</td></tr>
              : recentLeads.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding: '32px'}}>No leads yet.</td></tr>
              : recentLeads.map(l => (
                <tr key={l.id}>
                  <td>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td><strong>{esc(l.name)}</strong></td>
                  <td>{esc(l.email)}</td>
                  <td>{esc(l.system_type || '—')}</td>
                  <td><span className={`status-badge status-${esc(l.status || 'new')}`}>{capitalise(l.status || 'New')}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
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
function SettingsSection({ showToast }) {
  const handleSubmit = async (e) => {
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

  return (
    <section className="content-section active">
      <div className="glass-card" style={{ maxWidth: '500px' }}>
        <div className="cms-header"><h2>Admin Settings</h2></div>
        <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" placeholder="Enter new password" required minLength="6" />
          </div>
          <button type="submit" className="btn-primary w-100">Update Password</button>
        </form>
      </div>
    </section>
  );
}
