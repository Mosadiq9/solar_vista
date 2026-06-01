'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Mail, Lock, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      router.push('/portal');
      router.refresh();
    }
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Real auth bypass for demo purposes
    // We set a local storage flag and a cookie so the middleware can read it
    localStorage.setItem('demo_mode', 'true');
    document.cookie = "demo_mode=true; path=/; max-age=3600"; // 1 hour demo
    setTimeout(() => {
      router.push('/portal');
    }, 1000);
  };

  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          background: var(--bg-primary);
          font-family: var(--font-primary, system-ui, sans-serif);
        }
        .login-sidebar {
          flex: 1;
          background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(9,9,11,0.9)), url('https://images.unsplash.com/photo-1508514177221-188b1c77eca2?q=80&w=2000&auto=format&fit=crop') center/cover;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px;
          color: var(--text-primary);
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        @media (max-width: 992px) {
          .login-sidebar { display: none; }
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
        }
        .login-quote h2 {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
        }
        .login-quote p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }
        
        .login-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        .login-form-container {
          width: 100%;
          max-width: 440px;
        }
        .login-form-container h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .login-form-container > p {
          color: var(--text-secondary);
          margin-bottom: 40px;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        .form-group label {
          display: block;
          color: #cbd5e1;
          font-size: 0.9rem;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .auth-input {
          width: 100%;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 14px 16px 14px 48px;
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.2s;
        }
        .auth-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
          background: var(--glass-bg);
        }
        
        .forgot-link {
          display: block;
          text-align: right;
          color: var(--accent-cyan);
          font-size: 0.85rem;
          text-decoration: none;
          margin-top: 8px;
        }
        .forgot-link:hover { text-decoration: underline; }
        
        .login-btn {
          width: 100%;
          background: var(--accent-cyan);
          color: var(--bg-secondary);
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .login-btn:hover { background: var(--accent-blue); transform: translateY(-2px); }
        .login-btn:disabled { background: #475569; color: var(--text-secondary); cursor: not-allowed; transform: none; }
        
        .demo-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 32px 0;
          color: #475569;
          font-size: 0.9rem;
        }
        .demo-divider::before, .demo-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .demo-divider span { padding: 0 16px; }
        
        .demo-btn {
          width: 100%;
          background: var(--glass-bg);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          padding: 16px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .demo-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>
      
      <div className="login-sidebar">
        <Link href="/" className="login-logo">
          <Sun className="text-sky-400" size={32} /> SolarVista
        </Link>
        <div className="login-quote">
          <h2>Your Energy, <br />In Your Control.</h2>
          <p>Access your real-time system performance, manage maintenance schedules, and view your documentation all in one secure place.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400" /> Bank-grade 256-bit encryption
        </div>
      </div>
      
      <div className="login-main">
        <div className="login-form-container">
          <h1>Welcome Back</h1>
          <p>Sign in to your SolarVista Customer Portal</p>
          
          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.9rem' }}>{errorMsg}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input 
                  type="password" 
                  className="auth-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="demo-divider"><span>OR</span></div>
          
          <button type="button" className="demo-btn" onClick={handleDemoLogin} disabled={isLoading}>
            <Zap size={18} className="text-amber-400" /> Log in as Demo User
          </button>
        </div>
      </div>
    </div>
  );
}
