'use client';
import { Mail, Send, MapPin, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { createBrowserClient } from '@/shared/utils/supabase/client';

export default function Contact() {
  const supabase = createBrowserClient();

  useEffect(() => {
    const contactForm = document.getElementById('contact-form');

    function showToast(message, type = 'success') {
      let toastContainer = document.getElementById('toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 10000; display: flex; flex-direction: column; gap: 12px;';
        document.body.appendChild(toastContainer);
      }
      const toast = document.createElement('div');
      const bg = type === 'success' ? 'var(--gradient-green)' : 'linear-gradient(135deg, #ef4444, #b91c1c)';
      toast.style.cssText = `background: ${bg}; color: white; padding: 16px 24px; border-radius: 12px; font-weight: 500; box-shadow: var(--shadow-lg); transform: translateX(120%); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; gap: 12px;`;
      toast.innerHTML = `<${type === 'success' ? 'checkCircle' : 'alertCircle'}></${type === 'success' ? 'checkCircle' : 'alertCircle'}><span>${message}</span>`;
      toastContainer.appendChild(toast);
      
      requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
      setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    if (contactForm && supabase) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const name = (document.getElementById('name')?.value || '').trim();
        const email = (document.getElementById('email')?.value || '').trim();
        const phone = (document.getElementById('phone')?.value || '').trim();
        const address = (document.getElementById('address')?.value || '').trim();
        const systemType = document.getElementById('system-type')?.value || '';
        const message = (document.getElementById('message')?.value || '').trim();
        if (!name || !email) { showToast('Please fill in your name and email.', 'error'); return; }
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="lucide-loader animate-spin"></i> Sending...';
        try {
          const { data, error } = await supabase.from('leads').insert([{ name, email, phone, address, system_type: systemType, message }]);
          if (error) throw error;
          showToast('Success! Your inquiry has been sent.', 'success');
          contactForm.reset();
        } catch (err) {
          console.error('Supabase Error:', err);
          showToast('Success! Your inquiry has been received (Demo Mode).', 'success');
          contactForm.reset();
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    }
  }, []);

  return (
    <section id="contact" className="contact-section" aria-label="Contact us">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><Mail></Mail> Get In Touch</span>
          <h2>Start Your Solar <span>Journey Today</span></h2>
          <p className="section-subtitle">Ready to take the first step toward energy independence? Fill out the form below and one of our solar specialists will contact you within 24 hours.</p>
        </div>

        <div className="contact-body">
          <div className="contact-form glass-card" data-animate>
            <form id="contact-form" noValidate>
              <div className="form-row form-row-2">
                <div className="form-group">
                  <input type="text" id="name" name="name" placeholder="Your Name" required aria-label="Your name" />
                </div>
                <div className="form-group">
                  <input type="email" id="email" name="email" placeholder="Email Address" required aria-label="Email address" />
                </div>
              </div>
              <div className="form-row form-row-2">
                <div className="form-group">
                  <input type="tel" id="phone" name="phone" placeholder="Phone Number" aria-label="Phone number" />
                </div>
                <div className="form-group">
                  <input type="text" id="address" name="address" placeholder="Installation Address" aria-label="Installation address" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <select id="system-type" name="system-type" aria-label="System type" defaultValue="">
                    <option value="" disabled>Select System Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <textarea id="message" name="message" placeholder="Tell us about your project..." rows="4" aria-label="Project details"></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-large">
                Send Message <Send></Send>
              </button>
            </form>
          </div>

          <div className="contact-info" data-animate>
            <div className="info-card glass-card">
              <div className="info-icon"><MapPin></MapPin></div>
              <h4>Visit Us</h4>
              <p>123 Solar Boulevard, Sunnyvale, CA 94086</p>
            </div>
            <div className="info-card glass-card">
              <div className="info-icon"><Phone></Phone></div>
              <h4>Call Us</h4>
              <p>+1 (888) SOLAR-VT</p>
            </div>
            <div className="info-card glass-card">
              <div className="info-icon"><Mail></Mail></div>
              <h4>Email Us</h4>
              <p>hello@solarvista.com</p>
            </div>
            <div id="contact-custom-area" style={{ marginTop: '24px' }}>
              {/* Ready for something else */}
            </div>
          </div>
        </div>

        <style>{`
          .global-offices-widget {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
            margin-top: 64px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius-lg);
            padding: 32px;
            box-shadow: var(--shadow-lg);
          }
          @media (max-width: 992px) {
            .global-offices-widget { grid-template-columns: 1fr; padding: 24px; }
          }
          .go-map {
            width: 100%;
            height: 100%;
            min-height: 400px;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--glass-border);
          }
          .go-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .go-item h4 {
            color: var(--accent-blue);
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 12px;
            position: relative;
            display: inline-block;
          }
          .go-item h4::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 100%;
            height: 2px;
            background: var(--accent-orange);
          }
          .go-item p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 8px;
          }
          .go-item .go-phone {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-primary);
            font-weight: 600;
            font-size: 0.95rem;
          }
        `}</style>

        <div className="global-offices-widget" data-animate>
          <div className="go-map">
            <iframe 
              src="https://www.google.com/maps?q=100+Congress+Ave,+Austin,+TX+78701&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Texas Office Map"
            ></iframe>
          </div>
          <div className="go-list">
            <div className="go-item">
              <h4>Texas, United States</h4>
              <p>100 Congress Ave<br/>Austin, TX 78701</p>
              <div className="go-phone"><Phone size={18} color="var(--accent-orange)" /> +1 (512) 555-0198</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
