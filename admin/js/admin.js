document.addEventListener('DOMContentLoaded', () => {
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const navBtns = document.querySelectorAll('.nav-btn[data-target]');
  const sections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('page-title');
  
  // Supabase Auth State
  async function checkAuth() {
    if (!window.supabaseClient) return;
    
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
      showDashboard();
    } else {
      showLogin();
    }
  }
  
  function showDashboard() {
    loginView.classList.remove('active');
    dashboardView.classList.add('active');
    loadLeads();
  }
  
  function showLogin() {
    dashboardView.classList.remove('active');
    loginView.classList.add('active');
  }
  
  // Login Handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = loginForm.querySelector('button');
    
    btn.innerHTML = '<i class="lucide-loader animate-spin"></i> Signing In...';
    btn.disabled = true;
    
    try {
      const { error } = await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      showDashboard();
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      btn.innerHTML = 'Sign In';
      btn.disabled = false;
    }
  });
  
  // Logout Handler
  logoutBtn.addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
    showLogin();
  });
  
  // Navigation
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetId = btn.getAttribute('data-target') + '-section';
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
      
      pageTitle.textContent = btn.textContent.trim();
      
      if (targetId === 'leads-section') loadLeads();
      if (targetId === 'blogs-section') loadBlogs();
    });
  });
  
  // Fetch Data
  async function loadLeads() {
    const tbody = document.getElementById('leads-table-body');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>';
    
    try {
      const { data, error } = await window.supabaseClient
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No leads found.</td></tr>';
        return;
      }
      
      tbody.innerHTML = data.map(lead => `
        <tr>
          <td>${new Date(lead.created_at).toLocaleDateString()}</td>
          <td><strong>${lead.name}</strong></td>
          <td>${lead.email}</td>
          <td>${lead.phone}</td>
          <td>${lead.system_type}</td>
          <td><span class="status-badge status-${lead.status || 'new'}">${lead.status || 'New'}</span></td>
        </tr>
      `).join('');
      
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ef4444;">Error loading leads. Check configuration.</td></tr>`;
    }
  }
  
  async function loadBlogs() {
    const tbody = document.getElementById('blogs-table-body');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading...</td></tr>';
    
    try {
      const { data, error } = await window.supabaseClient
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No articles published yet.</td></tr>';
        return;
      }
      
      tbody.innerHTML = data.map(blog => `
        <tr>
          <td>${new Date(blog.created_at).toLocaleDateString()}</td>
          <td><strong>${blog.title}</strong></td>
          <td>${blog.category}</td>
          <td>
            <div style="display: flex; gap: 8px;">
              <button class="action-btn edit-btn" data-id="${blog.id}" title="Edit Article">
                <i data-lucide="edit-2"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${blog.id}" title="Delete Article">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
      
      if (window.lucide) window.lucide.createIcons();
      
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#ef4444;">Error loading articles.</td></tr>`;
    }
  }

  // --- PRODUCTS Logic ---
  async function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    try {
      const { data, error } = await window.supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">No products found.</td></tr>`;
        return;
      }
      
      tbody.innerHTML = data.map(product => `
        <tr>
          <td><strong>${product.name}</strong></td>
          <td>${product.category}</td>
          <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.model_url || 'N/A'}</td>
          <td>
            <div style="display: flex; gap: 8px;">
              <button class="action-btn edit-product-btn" data-id="${product.id}" title="Edit Product">
                <i data-lucide="edit-2"></i>
              </button>
              <button class="action-btn delete-product-btn" data-id="${product.id}" title="Delete Product">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
      
      if (window.lucide) window.lucide.createIcons();
      
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#ef4444;">Error loading products.</td></tr>`;
    }
  }

  // Blog Modal Logic
  const newPostBtn = document.getElementById('new-post-btn');
  const articleModal = document.getElementById('article-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const newArticleForm = document.getElementById('new-article-form');
  let editingBlogId = null; // Track if we are editing or creating

  function openModal(isEdit = false) {
    if (!isEdit) {
      newArticleForm.reset();
      document.querySelector('#article-modal h2').textContent = 'Create New Article';
      document.querySelector('#article-modal button[type="submit"]').textContent = 'Publish Article';
      editingBlogId = null;
    } else {
      document.querySelector('#article-modal h2').textContent = 'Edit Article';
      document.querySelector('#article-modal button[type="submit"]').textContent = 'Save Changes';
    }
    articleModal.classList.add('active');
  }

  function closeModal() {
    articleModal.classList.remove('active');
    newArticleForm.reset();
    editingBlogId = null;
  }

  newPostBtn.addEventListener('click', () => openModal(false));
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  newArticleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('article-title').value;
    const category = document.getElementById('article-category').value;
    const excerpt = document.getElementById('article-excerpt').value;
    const icon = document.getElementById('article-icon').value;
    
    const submitBtn = newArticleForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="lucide-loader animate-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    try {
      let error;
      if (editingBlogId) {
        // Update existing
        const res = await window.supabaseClient
          .from('blogs')
          .update({ title, category, excerpt, icon })
          .eq('id', editingBlogId);
        error = res.error;
      } else {
        // Insert new
        const res = await window.supabaseClient
          .from('blogs')
          .insert([{ title, category, excerpt, icon }]);
        error = res.error;
      }
        
      if (error) throw error;
      
      closeModal();
      loadBlogs(); // Refresh the table
    } catch (err) {
      alert('Failed to save article: ' + err.message);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  // Handle Edit and Delete clicks
  document.getElementById('blogs-table-body').addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    
    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      // Fetch the specific blog data
      const { data, error } = await window.supabaseClient.from('blogs').select('*').eq('id', id).single();
      if (error) {
        alert('Failed to load article details.');
        return;
      }
      
      document.getElementById('article-title').value = data.title;
      document.getElementById('article-category').value = data.category;
      document.getElementById('article-excerpt').value = data.excerpt;
      document.getElementById('article-icon').value = data.icon;
      
      editingBlogId = id;
      openModal(true);
    }
    
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this article? This cannot be undone.')) {
        const { error } = await window.supabaseClient.from('blogs').delete().eq('id', id);
        if (error) alert('Failed to delete article.');
        else loadBlogs();
      }
    }
  });

  // --- Product Modal Logic ---
  const newProductBtn = document.getElementById('new-product-btn');
  const productModal = document.getElementById('product-modal');
  const closeProductModalBtn = document.getElementById('close-product-modal-btn');
  const cancelProductModalBtn = document.getElementById('cancel-product-modal-btn');
  const newProductForm = document.getElementById('new-product-form');
  let editingProductId = null;

  function openProductModal(isEdit = false) {
    if (!isEdit) {
      newProductForm.reset();
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
    editingProductId = null;
  }

  if (newProductBtn) newProductBtn.addEventListener('click', () => openProductModal(false));
  if (closeProductModalBtn) closeProductModalBtn.addEventListener('click', closeProductModal);
  if (cancelProductModalBtn) cancelProductModalBtn.addEventListener('click', closeProductModal);

  if (newProductForm) {
    newProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('product-name').value;
      const category = document.getElementById('product-category').value;
      const description = document.getElementById('product-description').value;
      const model_url = document.getElementById('product-model-url').value;
      let specs = document.getElementById('product-specs').value;
      let features = document.getElementById('product-features').value;
      const icon = document.getElementById('product-icon').value;
      
      try { specs = JSON.parse(specs); } catch(err) { alert('Invalid Specs JSON'); return; }
      try { features = JSON.parse(features); } catch(err) { alert('Invalid Features JSON'); return; }

      const submitBtn = newProductForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="lucide-loader animate-spin"></i> Saving...';
      submitBtn.disabled = true;
      
      try {
        let error;
        if (editingProductId) {
          const res = await window.supabaseClient.from('products').update({ name, category, description, model_url, specs, features, icon }).eq('id', editingProductId);
          error = res.error;
        } else {
          const res = await window.supabaseClient.from('products').insert([{ name, category, description, model_url, specs, features, icon }]);
          error = res.error;
        }
          
        if (error) throw error;
        closeProductModal();
        loadProducts();
      } catch (err) {
        alert('Failed to save product: ' + err.message);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  const productsTableBody = document.getElementById('products-table-body');
  if (productsTableBody) {
    productsTableBody.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.edit-product-btn');
      const deleteBtn = e.target.closest('.delete-product-btn');
      
      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const { data, error } = await window.supabaseClient.from('products').select('*').eq('id', id).single();
        if (error) { alert('Failed to load product details.'); return; }
        
        document.getElementById('product-name').value = data.name;
        document.getElementById('product-category').value = data.category;
        document.getElementById('product-description').value = data.description;
        document.getElementById('product-model-url').value = data.model_url || '';
        document.getElementById('product-specs').value = typeof data.specs === 'string' ? data.specs : JSON.stringify(data.specs);
        document.getElementById('product-features').value = typeof data.features === 'string' ? data.features : JSON.stringify(data.features);
        document.getElementById('product-icon').value = data.icon || '';
        
        editingProductId = id;
        openProductModal(true);
      }
      
      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this product?')) {
          const { error } = await window.supabaseClient.from('products').delete().eq('id', id);
          if (error) alert('Failed to delete product.');
          else loadProducts();
        }
      }
    });
  }

  // Add nav listener specific for products
  const productNavBtn = document.querySelector('.nav-btn[data-target="products"]');
  if (productNavBtn) {
    productNavBtn.addEventListener('click', loadProducts);
  }

  // Init
  checkAuth();
});
