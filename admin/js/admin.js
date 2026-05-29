document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // FEATURE 1: TOAST NOTIFICATIONS
  // =============================================
  const toastContainer = document.getElementById('toast-container');
  const TOAST_ICONS = { success: 'check-circle', error: 'x-circle', info: 'info' };

  function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i data-lucide="${TOAST_ICONS[type]}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons({ nodes: [toast] });

    const dismiss = () => {
      toast.classList.add('hiding');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };
    toast.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  }

  // =============================================
  // AUTH
  // =============================================
  const loginView    = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm    = document.getElementById('admin-login-form');
  const logoutBtn    = document.getElementById('logout-btn');

  async function checkAuth() {
    if (!window.supabaseClient) { showLogin(); return; }
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    session ? showDashboard() : showLogin();
  }

  function showDashboard() {
    loginView.classList.remove('active');
    dashboardView.classList.add('active');
    loadDashboard();
  }

  function showLogin() {
    dashboardView.classList.remove('active');
    loginView.classList.add('active');
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn      = loginForm.querySelector('button');
    btn.innerHTML = 'Signing In…'; btn.disabled = true;
    try {
      const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showDashboard();
    } catch (err) {
      showToast('Login failed: ' + err.message, 'error');
    } finally {
      btn.innerHTML = 'Sign In'; btn.disabled = false;
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
    showLogin();
  });

  // =============================================
  // NAVIGATION
  // =============================================
  const navBtns  = document.querySelectorAll('.nav-btn[data-target]');
  const sections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('page-title');
  const SECTION_TITLES = {
    dashboard: 'Dashboard', leads: 'Lead Management',
    blogs: 'Blog CMS', products: 'Product CMS',
    subscribers: 'Newsletter Subscribers', settings: 'Admin Settings'
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(`${target}-section`).classList.add('active');
      pageTitle.textContent = SECTION_TITLES[target] || target;
      if (target === 'dashboard') loadDashboard();
      if (target === 'leads')     loadLeads();
      if (target === 'blogs')     loadBlogs();
      if (target === 'products')  loadProducts();
      if (target === 'subscribers') loadSubscribers();
      
      // Close mobile sidebar if open
      closeMobileSidebar();
    });
  });

  // Mobile Sidebar Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const adminSidebar = document.getElementById('admin-sidebar');

  function openMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
  }

  function closeMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // "View All" on dashboard goes to leads
  document.getElementById('view-all-leads-btn').addEventListener('click', () => {
    document.querySelector('.nav-btn[data-target="leads"]').click();
  });

  // =============================================
  // FEATURE 5: DASHBOARD OVERVIEW
  // =============================================
  async function loadDashboard() {
    if (!window.supabaseClient) return;
    try {
      const [leadsRes, blogsRes, productsRes] = await Promise.all([
        window.supabaseClient.from('leads').select('id, status', { count: 'exact' }),
        window.supabaseClient.from('blogs').select('id', { count: 'exact' }),
        window.supabaseClient.from('products').select('id', { count: 'exact' })
      ]);

      const leads     = leadsRes.data || [];
      const newLeads  = leads.filter(l => !l.status || l.status === 'new').length;

      document.getElementById('stat-total-leads').textContent = leadsRes.count ?? leads.length;
      document.getElementById('stat-new-leads').textContent   = newLeads;
      document.getElementById('stat-products').textContent    = productsRes.count ?? 0;
      document.getElementById('stat-articles').textContent    = blogsRes.count   ?? 0;

      // Recent leads (last 5)
      const { data: recent } = await window.supabaseClient
        .from('leads').select('*').order('created_at', { ascending: false }).limit(5);

      const tbody = document.getElementById('recent-leads-body');
      if (!recent || recent.length === 0) {
        tbody.innerHTML = emptyRow(5, 'No leads yet. Form submissions will appear here.');
        return;
      }
      tbody.innerHTML = recent.map(l => `
        <tr>
          <td>${new Date(l.created_at).toLocaleDateString()}</td>
          <td><strong>${esc(l.name)}</strong></td>
          <td>${esc(l.email)}</td>
          <td>${esc(l.system_type || '—')}</td>
          <td><span class="status-badge status-${esc(l.status || 'new')}">${capitalise(l.status || 'New')}</span></td>
        </tr>`).join('');
    } catch (err) {
      console.error('Dashboard load error', err);
    }
    if (window.lucide) lucide.createIcons();
  }

  // =============================================
  // HELPERS
  // =============================================
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
  }
  function capitalise(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function emptyRow(cols, msg) {
    return `<tr><td colspan="${cols}" style="text-align:center; padding:40px; color:var(--text-secondary);">${msg}</td></tr>`;
  }

  // =============================================
  // FEATURE 4: LEADS WITH SEARCH + FILTER
  // =============================================
  let allLeadsData = [];

  async function loadLeads() {
    const tbody = document.getElementById('leads-table-body');
    tbody.innerHTML = emptyRow(6, 'Loading…');
    try {
      const { data, error } = await window.supabaseClient
        .from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      allLeadsData = data || [];
      renderLeads();
    } catch {
      tbody.innerHTML = emptyRow(6, '⚠ Error loading leads. Check your Supabase configuration.');
    }
  }

  function renderLeads() {
    const query  = (document.getElementById('lead-search').value || '').toLowerCase();
    const status = document.getElementById('lead-status-filter').value;

    let filtered = allLeadsData.filter(l => {
      const matchQuery  = !query  || (l.name||'').toLowerCase().includes(query) || (l.email||'').toLowerCase().includes(query);
      const matchStatus = !status || (l.status || 'new') === status;
      return matchQuery && matchStatus;
    });

    document.getElementById('lead-count').textContent =
      filtered.length === allLeadsData.length
        ? `${allLeadsData.length} leads`
        : `${filtered.length} of ${allLeadsData.length}`;

    const tbody = document.getElementById('leads-table-body');
    if (filtered.length === 0) {
      tbody.innerHTML = emptyRow(6, 'No leads match your search.');
      return;
    }

    tbody.innerHTML = filtered.map(l => `
      <tr data-lead-id="${l.id}" style="cursor:pointer;">
        <td>${new Date(l.created_at).toLocaleDateString()}</td>
        <td><strong>${esc(l.name)}</strong></td>
        <td>${esc(l.email)}</td>
        <td>${esc(l.phone)}</td>
        <td>${esc(l.system_type || '—')}</td>
        <td><span class="status-badge status-${esc(l.status || 'new')}">${capitalise(l.status || 'New')}</span></td>
      </tr>`).join('');

    if (window.lucide) lucide.createIcons();
  }

  document.getElementById('lead-search').addEventListener('input', renderLeads);
  document.getElementById('lead-status-filter').addEventListener('change', renderLeads);

  // Click a row → open drawer
  document.getElementById('leads-table-body').addEventListener('click', e => {
    const row = e.target.closest('tr[data-lead-id]');
    if (!row) return;
    const id = row.getAttribute('data-lead-id');
    const lead = allLeadsData.find(l => String(l.id) === String(id));
    if (lead) openLeadDrawer(lead);
  });

  // =============================================
  // FEATURE 2: LEAD DETAIL DRAWER
  // FEATURE 3: STATUS MANAGEMENT
  // =============================================
  let currentLeadId = null;

  function openLeadDrawer(lead) {
    currentLeadId = lead.id;
    document.getElementById('drawer-lead-name').textContent   = lead.name || '—';
    document.getElementById('drawer-lead-date').textContent   = 'Submitted: ' + new Date(lead.created_at).toLocaleString();
    document.getElementById('drawer-email').textContent       = lead.email || '—';
    document.getElementById('drawer-phone').textContent       = lead.phone || '—';
    document.getElementById('drawer-system-type').textContent = lead.system_type || '—';
    document.getElementById('drawer-address').textContent     = lead.address || '—';
    document.getElementById('drawer-message').textContent     = lead.message || '—';
    document.getElementById('drawer-status-select').value     = lead.status || 'new';

    document.getElementById('lead-drawer').classList.add('active');
    document.getElementById('lead-drawer-overlay').classList.add('active');
  }

  function closeLeadDrawer() {
    document.getElementById('lead-drawer').classList.remove('active');
    document.getElementById('lead-drawer-overlay').classList.remove('active');
    currentLeadId = null;
  }

  document.getElementById('drawer-close-btn').addEventListener('click', closeLeadDrawer);
  document.getElementById('lead-drawer-overlay').addEventListener('click', closeLeadDrawer);

  document.getElementById('drawer-status-select').addEventListener('change', async (e) => {
    const newStatus = e.target.value;
    if (!currentLeadId) return;
    try {
      const { error } = await window.supabaseClient
        .from('leads').update({ status: newStatus }).eq('id', currentLeadId);
      if (error) throw error;

      // Update local data so table refreshes correctly
      const lead = allLeadsData.find(l => String(l.id) === String(currentLeadId));
      if (lead) lead.status = newStatus;
      renderLeads();
      showToast(`Status updated to "${capitalise(newStatus)}"`, 'success');
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  });

  // =============================================
  // BLOGS
  // =============================================
  let quillEditor = null;
  let editingBlogId = null;

  // FEATURE 7: Init Quill
  if (typeof Quill !== 'undefined') {
    quillEditor = new Quill('#article-editor', {
      theme: 'snow',
      placeholder: 'Write your article content here…',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean']
        ]
      }
    });
  }

  // FEATURE 6: Image Preview — article
  document.getElementById('article-image-url').addEventListener('input', e => {
    const img = document.getElementById('article-image-preview');
    const url = e.target.value.trim();
    if (url) { img.src = url; img.classList.add('visible'); }
    else      { img.src = ''; img.classList.remove('visible'); }
  });

  // =============================================
  // IMAGE UPLOAD HELPER
  // =============================================
  async function uploadImage(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput.files || fileInput.files.length === 0) return null;
    const file = fileInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await window.supabaseClient.storage.from('images').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = window.supabaseClient.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  }

  // =============================================
  // SUBSCRIBERS
  // =============================================
  async function loadSubscribers() {
    const tbody = document.getElementById('subscribers-table-body');
    tbody.innerHTML = emptyRow(2, 'Loading…');
    try {
      const { data, error } = await window.supabaseClient
        .from('subscribers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        tbody.innerHTML = emptyRow(2, 'No subscribers yet.');
        return;
      }
      tbody.innerHTML = data.map(sub => `
        <tr>
          <td>${new Date(sub.created_at).toLocaleDateString()}</td>
          <td><strong>${esc(sub.email)}</strong></td>
        </tr>`).join('');
    } catch {
      tbody.innerHTML = emptyRow(2, '⚠ Error loading subscribers.');
    }
  }

  // =============================================
  // SETTINGS
  // =============================================
  const settingsForm = document.getElementById('admin-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById('settings-new-password').value;
      const btn = settingsForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Updating…'; btn.disabled = true;

      try {
        const { error } = await window.supabaseClient.auth.updateUser({ password: newPassword });
        if (error) throw error;
        showToast('Password updated successfully!', 'success');
        settingsForm.reset();
      } catch (err) {
        showToast('Failed to update password: ' + err.message, 'error');
      } finally {
        btn.innerHTML = orig; btn.disabled = false;
      }
    });
  }

  // =============================================
  // BLOGS
  // =============================================
  async function loadBlogs() {
    const tbody = document.getElementById('blogs-table-body');
    tbody.innerHTML = emptyRow(4, 'Loading…');
    try {
      const { data, error } = await window.supabaseClient
        .from('blogs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        tbody.innerHTML = emptyRow(4, '📝 No articles published yet. Click "New Article" to get started.');
        return;
      }
      tbody.innerHTML = data.map(blog => `
        <tr>
          <td>${new Date(blog.created_at).toLocaleDateString()}</td>
          <td><strong>${esc(blog.title)}</strong></td>
          <td>${esc(blog.category)}</td>
          <td>
            <div style="display:flex;gap:8px;">
              <button class="action-btn edit-btn" data-id="${blog.id}" title="Edit"><i data-lucide="edit-2"></i></button>
              <button class="action-btn delete-btn" data-id="${blog.id}" title="Delete"><i data-lucide="trash-2"></i></button>
            </div>
          </td>
        </tr>`).join('');
      if (window.lucide) lucide.createIcons();
    } catch {
      tbody.innerHTML = emptyRow(4, '⚠ Error loading articles.');
    }
  }

  const articleModal    = document.getElementById('article-modal');
  const newArticleForm  = document.getElementById('new-article-form');

  function openArticleModal(isEdit = false) {
    if (!isEdit) {
      newArticleForm.reset();
      if (quillEditor) quillEditor.root.innerHTML = '';
      document.getElementById('article-image-preview').classList.remove('visible');
      document.querySelector('#article-modal h2').textContent = 'Create New Article';
      document.querySelector('#article-modal button[type="submit"]').textContent = 'Publish Article';
      editingBlogId = null;
    } else {
      document.querySelector('#article-modal h2').textContent = 'Edit Article';
      document.querySelector('#article-modal button[type="submit"]').textContent = 'Save Changes';
    }
    articleModal.classList.add('active');
  }

  function closeArticleModal() {
    articleModal.classList.remove('active');
    newArticleForm.reset();
    if (quillEditor) quillEditor.root.innerHTML = '';
    document.getElementById('article-image-preview').classList.remove('visible');
    editingBlogId = null;
  }

  document.getElementById('new-post-btn').addEventListener('click', () => openArticleModal(false));
  document.getElementById('close-modal-btn').addEventListener('click', closeArticleModal);
  document.getElementById('cancel-modal-btn').addEventListener('click', closeArticleModal);

  newArticleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title     = document.getElementById('article-title').value;
    const category  = document.getElementById('article-category').value;
    const icon      = document.getElementById('article-icon').value;
    let image_url = document.getElementById('article-image-url').value.trim();
    const excerpt   = quillEditor ? quillEditor.root.innerHTML : '';

    const btn = newArticleForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Saving…'; btn.disabled = true;
    try {
      // Upload image if a new file is selected
      const uploadedUrl = await uploadImage('article-image-file');
      if (uploadedUrl) image_url = uploadedUrl;

      let error;
      if (editingBlogId) {
        const res = await window.supabaseClient.from('blogs')
          .update({ title, category, excerpt, icon, image_url }).eq('id', editingBlogId);
        error = res.error;
      } else {
        const res = await window.supabaseClient.from('blogs')
          .insert([{ title, category, excerpt, icon, image_url }]);
        error = res.error;
      }
      if (error) throw error;
      showToast(editingBlogId ? 'Article updated!' : 'Article published!', 'success');
      closeArticleModal();
      loadBlogs();
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    } finally {
      btn.innerHTML = orig; btn.disabled = false;
    }
  });

  document.getElementById('blogs-table-body').addEventListener('click', async e => {
    const editBtn   = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      const { data, error } = await window.supabaseClient.from('blogs').select('*').eq('id', id).single();
      if (error) { showToast('Could not load article.', 'error'); return; }
      document.getElementById('article-title').value    = data.title;
      document.getElementById('article-category').value = data.category;
      document.getElementById('article-icon').value     = data.icon || 'file-text';
      document.getElementById('article-image-url').value = data.image_url || '';
      const preview = document.getElementById('article-image-preview');
      if (data.image_url) { preview.src = data.image_url; preview.classList.add('visible'); }
      if (quillEditor) quillEditor.root.innerHTML = data.excerpt || '';
      editingBlogId = id;
      openArticleModal(true);
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      showConfirm('Delete this article? This cannot be undone.', async () => {
        const { error } = await window.supabaseClient.from('blogs').delete().eq('id', id);
        if (error) { showToast('Delete failed.', 'error'); return; }
        showToast('Article deleted.', 'info');
        loadBlogs();
      });
    }
  });

  // =============================================
  // PRODUCTS
  // =============================================
  let editingProductId = null;

  // FEATURE 6: Image Preview — product
  document.getElementById('product-image-url').addEventListener('input', e => {
    const img = document.getElementById('product-image-preview');
    const url = e.target.value.trim();
    if (url) { img.src = url; img.classList.add('visible'); }
    else      { img.src = ''; img.classList.remove('visible'); }
  });

  async function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = emptyRow(5, 'Loading…');
    try {
      const { data, error } = await window.supabaseClient
        .from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        tbody.innerHTML = emptyRow(5, '📦 No products added yet. Click "New Product" to get started.');
        return;
      }
      tbody.innerHTML = data.map(p => `
        <tr>
          <td><strong>${esc(p.name)}</strong></td>
          <td>${esc(p.category)}</td>
          <td>${p.image_url ? `<img src="${esc(p.image_url)}" style="width:48px;height:36px;object-fit:cover;border-radius:4px;">` : '—'}</td>
          <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(p.model_url || '—')}</td>
          <td>
            <div style="display:flex;gap:8px;">
              <button class="action-btn edit-product-btn" data-id="${p.id}" title="Edit"><i data-lucide="edit-2"></i></button>
              <button class="action-btn delete-product-btn" data-id="${p.id}" title="Delete"><i data-lucide="trash-2"></i></button>
            </div>
          </td>
        </tr>`).join('');
      if (window.lucide) lucide.createIcons();
    } catch {
      tbody.innerHTML = emptyRow(5, '⚠ Error loading products.');
    }
  }

  const productModal   = document.getElementById('product-modal');
  const newProductForm = document.getElementById('new-product-form');

  function openProductModal(isEdit = false) {
    if (!isEdit) {
      newProductForm.reset();
      document.getElementById('product-image-preview').classList.remove('visible');
      document.querySelector('#product-modal h2').textContent = 'Create New Product';
      document.querySelector('#product-modal button[type="submit"]').textContent = 'Save Product';
      editingProductId = null;
    } else {
      document.querySelector('#product-modal h2').textContent = 'Edit Product';
      document.querySelector('#product-modal button[type="submit"]').textContent = 'Save Changes';
    }
    productModal.classList.add('active');
  }

  function closeProductModal() {
    productModal.classList.remove('active');
    newProductForm.reset();
    document.getElementById('product-image-preview').classList.remove('visible');
    editingProductId = null;
  }

  document.getElementById('new-product-btn').addEventListener('click', () => openProductModal(false));
  document.getElementById('close-product-modal-btn').addEventListener('click', closeProductModal);
  document.getElementById('cancel-product-modal-btn').addEventListener('click', closeProductModal);

  newProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name        = document.getElementById('product-name').value;
    const category    = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    let image_url   = document.getElementById('product-image-url').value.trim();
    const model_url   = document.getElementById('product-model-url').value;
    const icon        = document.getElementById('product-icon').value;
    let specs    = document.getElementById('product-specs').value;
    let features = document.getElementById('product-features').value;

    try { specs    = JSON.parse(specs); }    catch { showToast('Invalid Specs JSON.', 'error'); return; }
    try { features = JSON.parse(features); } catch { showToast('Invalid Features JSON.', 'error'); return; }

    const btn = newProductForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Saving…'; btn.disabled = true;

    try {
      // Upload image if a new file is selected
      const uploadedUrl = await uploadImage('product-image-file');
      if (uploadedUrl) image_url = uploadedUrl;

      let error;
      const payload = { name, category, description, image_url, model_url, specs, features, icon };
      if (editingProductId) {
        const res = await window.supabaseClient.from('products').update(payload).eq('id', editingProductId);
        error = res.error;
      } else {
        const res = await window.supabaseClient.from('products').insert([payload]);
        error = res.error;
      }
      if (error) throw error;
      showToast(editingProductId ? 'Product updated!' : 'Product saved!', 'success');
      closeProductModal();
      loadProducts();
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    } finally {
      btn.innerHTML = orig; btn.disabled = false;
    }
  });

  document.getElementById('products-table-body').addEventListener('click', async e => {
    const editBtn   = e.target.closest('.edit-product-btn');
    const deleteBtn = e.target.closest('.delete-product-btn');

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      const { data, error } = await window.supabaseClient.from('products').select('*').eq('id', id).single();
      if (error) { showToast('Could not load product.', 'error'); return; }
      document.getElementById('product-name').value      = data.name;
      document.getElementById('product-category').value  = data.category;
      document.getElementById('product-description').value = data.description;
      document.getElementById('product-image-url').value = data.image_url || '';
      document.getElementById('product-model-url').value = data.model_url || '';
      document.getElementById('product-specs').value     = JSON.stringify(data.specs || []);
      document.getElementById('product-features').value  = JSON.stringify(data.features || []);
      document.getElementById('product-icon').value      = data.icon || 'box';
      const preview = document.getElementById('product-image-preview');
      if (data.image_url) { preview.src = data.image_url; preview.classList.add('visible'); }
      editingProductId = id;
      openProductModal(true);
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      showConfirm('Delete this product? This cannot be undone.', async () => {
        const { error } = await window.supabaseClient.from('products').delete().eq('id', id);
        if (error) { showToast('Delete failed.', 'error'); return; }
        showToast('Product deleted.', 'info');
        loadProducts();
      });
    }
  });

  // =============================================
  // CONFIRMATION HELPER (styled — no browser confirm())
  // =============================================
  function showConfirm(message, onConfirm) {
    // Reuse toast container but render a special confirm toast
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.style.flexDirection = 'column';
    toast.style.alignItems    = 'flex-start';
    toast.style.gap           = '12px';
    toast.style.minWidth      = '320px';
    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <i data-lucide="alert-triangle" style="width:18px;height:18px;"></i>
        <span>${message}</span>
      </div>
      <div style="display:flex;gap:8px;width:100%;justify-content:flex-end;">
        <button class="confirm-cancel" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:0.85rem;">Cancel</button>
        <button class="confirm-ok" style="background:#ef4444;border:none;color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.85rem;">Delete</button>
      </div>`;
    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons({ nodes: [toast] });

    const remove = () => {
      toast.classList.add('hiding');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };
    toast.querySelector('.confirm-cancel').addEventListener('click', remove);
    toast.querySelector('.confirm-ok').addEventListener('click', () => { remove(); onConfirm(); });
  }

  // =============================================
  // INIT
  // =============================================
  checkAuth();
});
