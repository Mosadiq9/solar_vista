import { Star, ShieldCheck, Smartphone, DollarSign, Users, Palette, Clock } from 'lucide-react';
export default function Features() {
  return (
    <section id="features" className="features-section" aria-label="Why choose SolarVista">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><Star></Star> Our Advantages</span>
          <h2>Why Choose <span>SolarVista</span></h2>
          <p className="section-subtitle">We combine cutting-edge technology with exceptional service to deliver a solar experience that exceeds every expectation.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card" data-animate>
            <div className="feature-icon-wrap"><ShieldCheck></ShieldCheck></div>
            <h3 className="feature-title">25-Year Warranty</h3>
            <p className="feature-desc">Industry-leading coverage that guarantees peak performance and complete peace of mind for a quarter century. Our panels are built to endure.</p>
          </div>

          <div className="feature-card" data-animate>
            <div className="feature-icon-wrap"><Smartphone></Smartphone></div>
            <h3 className="feature-title">Smart Monitoring</h3>
            <p className="feature-desc">Real-time energy tracking from your phone. Monitor production, consumption, and savings with our intuitive SolarVista dashboard app.</p>
          </div>

          <div className="feature-card" data-animate>
            <div className="feature-icon-wrap"><DollarSign></DollarSign></div>
            <h3 className="feature-title">Zero Down Payment</h3>
            <p className="feature-desc">Start saving immediately with flexible financing options. No upfront cost — your monthly payment is typically less than your current electric bill.</p>
          </div>

          <div className="feature-card" data-animate>
            <div className="feature-icon-wrap"><Users></Users></div>
            <h3 className="feature-title">Licensed Experts</h3>
            <p className="feature-desc">NABCEP certified professionals handle every installation. Our experienced team ensures flawless execution from permits to power-on.</p>
          </div>

          <div className="feature-card" data-animate>
            <div className="feature-icon-wrap"><Palette></Palette></div>
            <h3 className="feature-title">Custom Design</h3>
            <p className="feature-desc">Tailored solar solutions designed specifically for your property using advanced 3D modeling and satellite imagery analysis.</p>
          </div>

          <div className="feature-card" data-animate>
            <div className="feature-icon-wrap"><Clock></Clock></div>
            <h3 className="feature-title">Fast Installation</h3>
            <p className="feature-desc">Professional installation in just 1–3 days. Our streamlined process minimizes disruption so you can start generating clean energy fast.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
