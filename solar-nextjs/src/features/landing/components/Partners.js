import { Award, ShieldCheck, Leaf, CheckCircle } from 'lucide-react';
export default function Partners() {
  const partners = [
    { name: 'SunPower', url: 'https://us.sunpower.com/' },
    { name: 'LG Solar', url: 'https://www.lg.com/us/solar' },
    { name: 'Enphase', url: 'https://enphase.com/' },
    { name: 'SolarEdge', url: 'https://www.solaredge.com/us/' },
    { name: 'Tesla Energy', url: 'https://www.tesla.com/energy' },
    { name: 'Canadian Solar', url: 'https://www.canadiansolar.com/' },
    { name: 'Panasonic', url: 'https://na.panasonic.com/us/energy-solutions/solar' },
    { name: 'NABCEP', url: 'https://www.nabcep.org/' }
  ];

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
              <a href={p.url} target="_blank" rel="noopener noreferrer" key={`a-${i}`} className="partner-item" style={{color: 'inherit', textDecoration: 'none'}}>{p.name}</a>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((p, i) => (
              <a href={p.url} target="_blank" rel="noopener noreferrer" key={`b-${i}`} className="partner-item" style={{color: 'inherit', textDecoration: 'none'}}>{p.name}</a>
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
