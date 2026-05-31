'use client';
import { Sun, Moon } from 'lucide-react';
import DynamicIcon from '../../components/DynamicIcon';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!window.supabaseClient) {
          // Wait briefly in case it's loading
          await new Promise(r => setTimeout(r, 500));
          if (!window.supabaseClient) throw new Error('Supabase not connected');
        }
        
        const { data, error } = await window.supabaseClient
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load catalog.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  useEffect(() => {
    
  }, [products, loading]);

  useEffect(() => {
    // Theme toggle logic just for this page's button if needed, 
    // but the global ThemeInit handles the body class.
    const themeToggle = document.getElementById('products-theme-toggle');
    if (themeToggle) {
      const sunIcon = themeToggle.querySelector('.sun-icon');
      const moonIcon = themeToggle.querySelector('.moon-icon');
      
      const updateIcons = () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
          if (sunIcon) sunIcon.style.display = 'block';
          if (moonIcon) moonIcon.style.display = 'none';
        } else {
          if (sunIcon) sunIcon.style.display = 'none';
          if (moonIcon) moonIcon.style.display = 'block';
        }
      };
      
      updateIcons();
      
      const clickHandler = () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('solarvista-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('solarvista-theme', 'light');
        }
        updateIcons();
      };
      
      themeToggle.addEventListener('click', clickHandler);
      return () => themeToggle.removeEventListener('click', clickHandler);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .storefront-header {
          padding: 180px 0 80px 0;
          text-align: center;
          background: radial-gradient(circle at top, rgba(245, 158, 11, 0.1) 0%, var(--c-bg) 60%);
        }
        .storefront-header h1 {
          font-size: 3.5rem;
          margin-bottom: 24px;
        }
        .storefront-header p {
          font-size: 1.25rem;
          color: var(--c-text2);
          max-width: 600px;
          margin: 0 auto;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
          gap: 32px;
          padding: 60px 0 120px 0;
        }
        .product-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 24px;
          padding: 32px;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-card);
          border-color: rgba(245, 158, 11, 0.3);
        }
        .product-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: rgba(245, 158, 11, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--c-primary);
        }
        .product-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .product-category {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          color: var(--c-text2);
        }
        .product-desc {
          color: var(--c-text2);
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }
        .product-specs-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--c-border);
        }
        .spec-mini-val { font-size: 1.25rem; font-weight: 700; font-family: var(--font-head); }
        .spec-mini-lbl { font-size: 0.85rem; color: var(--c-text2); }
      `}} />

      {/* Minimal Nav */}
      <nav className="navbar" id="navbar">
        <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sun className="nav-logo-icon" style={{ color: 'var(--c-primary)' }}></Sun>
            <span>SolarVista</span>
          </Link>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button id="products-theme-toggle" className="theme-toggle" aria-label="Toggle light/dark mode" style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
              <Sun className="sun-icon" style={{ display: 'none' }}></Sun>
              <Moon className="moon-icon"></Moon>
            </button>
            <Link href="/" className="nav-link">Back to Home</Link>
            <Link href="/#contact" className="btn btn-primary">Get Free Quote</Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="storefront-header">
          <div className="container">
            <h1>Complete Energy Catalog</h1>
            <p>Explore our premium lineup of hardware, from high-efficiency solar panels to next-generation battery storage.</p>
          </div>
        </section>

        <section className="container">
          <div id="storefront-grid" className="products-grid">
            {loading ? (
              <div style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1' }}>
                <i className="lucide-loader animate-spin" style={{ width: '48px', height: '48px', color: 'var(--c-primary)' }}></i>
                <p style={{ marginTop: '16px' }}>Loading catalog...</p>
              </div>
            ) : error ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#ef4444' }}>{error}</p>
            ) : products.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No products found in the catalog.</p>
            ) : (
              products.map(p => {
                let specs = [];
                try {
                  const pSpecs = typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs;
                  if (Array.isArray(pSpecs)) specs = pSpecs.slice(0, 2);
                } catch(e) {}
                
                return (
                  <div key={p.id} className="product-card">
                    <div className="product-icon-wrap">
                      <DynamicIcon name={p.icon || 'box'}></DynamicIcon>
                    </div>
                    <span className="product-category">{p.category}</span>
                    <h3 className="product-name">{p.name}</h3>
                    <p className="product-desc">{p.description}</p>
                    <div className="product-specs-mini">
                      {specs.map((s, idx) => (
                        <div key={idx}>
                          <div className="spec-mini-val">{s.value}</div>
                          <div className="spec-mini-lbl">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <Link href="/#contact" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                      Request Quote
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </>
  );
}
