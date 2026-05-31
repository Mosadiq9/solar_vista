import { Sun } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer id="footer" className="footer">


      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#" className="footer-logo"><Sun></Sun> SolarVista</a>
            <p className="footer-tagline">Powering a sustainable future, one rooftop at a time.</p>
            <div className="footer-newsletter">
              <p>Subscribe to our newsletter</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Solutions</h4>
            <ul>
              <li><a href="#">Residential Solar</a></li>
              <li><a href="#">Commercial Solar</a></li>
              <li><a href="#">Battery Storage</a></li>
              <li><a href="#">EV Charging</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Warranty</a></li>
              <li><a href="#">Maintenance</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 SolarVista. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
