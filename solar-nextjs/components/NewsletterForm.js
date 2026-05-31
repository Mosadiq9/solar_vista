'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { createBrowserClient } from '../utils/supabase/client';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const supabase = createBrowserClient();
      
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) {
        // If the table doesn't exist yet, we can catch the specific error, but let's just log it for now
        throw error;
      }

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error.message);
      setStatus('error');
      setMessage('Subscription failed. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="newsletter-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginTop: '8px' }}>
        <CheckCircle2 size={20} />
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    );
  }

  return (
    <>
      <form className="newsletter-form" aria-label="Newsletter signup" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Your email address" 
          aria-label="Email for newsletter" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
        <button 
          type="submit" 
          className="btn btn-primary" 
          aria-label="Subscribe"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send />}
        </button>
      </form>
      {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '8px' }}>{message}</p>}
    </>
  );
}
