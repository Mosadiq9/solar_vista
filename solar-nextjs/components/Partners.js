import { Award, ShieldCheck, Leaf, CheckCircle } from 'lucide-react';
export default function Partners() {
  const partners = ['SunPower', 'LG Solar', 'Enphase', 'SolarEdge', 'Tesla Energy', 'Canadian Solar', 'Panasonic', 'NABCEP'];

  return (
    <section id="partners" className="partners-section" aria-label="Partners and certifications">
      <div className="container">
        <div className="section-header section-header-sm" data-animate>
          <h2>Trusted By Industry <span>Leaders</span></h2>
        </div>

        <div className="partners-marquee" data-animate>
          <div className="marquee-track">
            {/* First set */}
            {partners.map((p, i) => (
              <div key={`a-${i}`} className="partner-item">{p}</div>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((p, i) => (
              <div key={`b-${i}`} className="partner-item">{p}</div>
            ))}
          </div>
        </div>

        <div className="certifications-grid" data-animate>
          <div className="cert-badge glass-card">
            <Award></Award>
            <span>NABCEP Certified</span>
          </div>
          <div className="cert-badge glass-card">
            <ShieldCheck></ShieldCheck>
            <span>BBB A+ Rated</span>
          </div>
          <div className="cert-badge glass-card">
            <Leaf></Leaf>
            <span>EPA Partner</span>
          </div>
          <div className="cert-badge glass-card">
            <CheckCircle></CheckCircle>
            <span>UL Listed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
