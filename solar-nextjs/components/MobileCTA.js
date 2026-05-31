import { Phone, ClipboardList } from 'lucide-react';
export default function MobileCTA() {
  return (
    <div className="mobile-cta-bar d-md-none" id="mobile-cta-bar">
      <a href="tel:+18001234567" className="btn btn-secondary mobile-cta-btn">
        <Phone size={18}></Phone> Call Now
      </a>
      <a href="#contact" className="btn btn-primary mobile-cta-btn">
        <ClipboardList size={18}></ClipboardList> Free Quote
      </a>
    </div>
  );
}
