import { Sun } from 'lucide-react';
import NewsletterForm from '@/features/landing/components/NewsletterForm';

export default function Footer() {
  return (
    <footer id="footer" className="footer">


      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="/" className="footer-logo"><Sun></Sun> SolarVista</a>
            <p className="footer-tagline">Powering a sustainable future, one rooftop at a time.</p>
            <p className="footer-phone" style={{ marginBottom: '16px', fontWeight: '500' }}>
              <a href="tel:+18001234567" style={{ color: 'inherit', textDecoration: 'none' }}>+1 (800) 123-4567</a>
            </p>
            <div className="footer-newsletter">
              <p>Subscribe to our newsletter</p>
              <NewsletterForm />
            </div>
            <div className="footer-social" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <a href="https://facebook.com/solarvista" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://twitter.com/solarvista" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://instagram.com/solarvista" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://linkedin.com/company/solarvista" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Solutions</h4>
            <ul>
              <li><a href="/products#residential">Residential Solar</a></li>
              <li><a href="/products#commercial">Commercial Solar</a></li>
              <li><a href="/products#battery">Battery Storage</a></li>
              <li><a href="/products#ev">EV Charging</a></li>
              <li><a href="/financing">Financing Options</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Company</h4>
            <ul>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/#partners">Partners</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Support</h4>
            <ul>
              <li><a href="/support">Help Center</a></li>
              <li><a href="/warranty">Warranty</a></li>
              <li><a href="/maintenance">Maintenance</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 SolarVista. All rights reserved.</p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
