'use client';
import { Sun, Moon } from 'lucide-react';
import DynamicIcon from '@/shared/components/DynamicIcon';
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
          background: radial-gradient(circle at top, rgba(245, 158, 11, 0.1) 0%, transparent 60%);
        }
        .storefront-header h1 {
          font-size: 3.5rem;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
          padding: 40px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .product-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 150px;
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%);
          z-index: 0;
          pointer-events: none;
        }
        .product-card > * {
          position: relative;
          z-index: 1;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3);
          border-color: rgba(245, 158, 11, 0.4);
          background: var(--c-surface-hover);
        }
        .product-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          color: var(--c-primary);
          box-shadow: 0 8px 16px -4px rgba(245, 158, 11, 0.1);
        }
        .product-icon-wrap svg {
          width: 32px;
          height: 32px;
        }
        .product-name {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--c-text1);
        }
        .product-category {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
          color: var(--c-primary);
          width: max-content;
        }
        .product-desc {
          color: var(--c-text2);
          line-height: 1.7;
          margin-bottom: 32px;
          flex: 1;
        }
        .product-specs-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
          padding-top: 24px;
          border-top: 1px solid var(--c-border);
        }
        .spec-mini-val { font-size: 1.5rem; font-weight: 700; font-family: var(--font-head); color: var(--c-text1); margin-bottom: 4px; }
        .spec-mini-lbl { font-size: 0.85rem; color: var(--c-text2); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
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
                    <span className="product-category">{p.category}</span>
                    <div className="product-icon-wrap">
                      <DynamicIcon name={p.icon || 'box'}></DynamicIcon>
                    </div>
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
                    <Link href="/#contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
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
