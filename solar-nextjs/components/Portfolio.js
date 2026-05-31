'use client';
import { Briefcase, Zap, DollarSign, ArrowRight } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { useEffect } from 'react';

export default function Portfolio() {
  useEffect(() => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portfolioCards.forEach((card, index) => {
          if (filter === 'all' || card.dataset.category === filter) {
            if (typeof gsap !== 'undefined') {
              gsap.to(card, {
                opacity: 1, scale: 1, duration: 0.4, delay: index * 0.05, ease: 'power2.out',
                onStart: () => { card.style.display = 'block'; }
              });
            } else {
              card.style.display = 'block';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }
          } else {
            if (typeof gsap !== 'undefined') {
              gsap.to(card, {
                opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in',
                onComplete: () => { card.style.display = 'none'; }
              });
            } else {
              card.style.display = 'none';
              card.style.opacity = '0';
              card.style.transform = 'scale(0.9)';
            }
          }
        });
      });
    });
  }, []);

  const projects = [
    { name: 'Johnson Residence', category: 'residential', gradient: 'portfolio-gradient-1', icon: 'home', power: '12.4 kW', savings: '$2,400/yr saved' },
    { name: 'Metro Business Park', category: 'commercial', gradient: 'portfolio-gradient-2', icon: 'building', power: '85 kW', savings: '$18,200/yr saved' },
    { name: 'Williams Family Home', category: 'residential', gradient: 'portfolio-gradient-3', icon: 'home', power: '8.8 kW', savings: '$1,800/yr saved' },
    { name: 'SunTech Manufacturing', category: 'industrial', gradient: 'portfolio-gradient-4', icon: 'factory', power: '250 kW', savings: '$52,000/yr saved' },
    { name: 'Greenfield Office Complex', category: 'commercial', gradient: 'portfolio-gradient-5', icon: 'building', power: '120 kW', savings: '$24,500/yr saved' },
    { name: 'Martinez Solar Villa', category: 'residential', gradient: 'portfolio-gradient-6', icon: 'home', power: '15.2 kW', savings: '$3,100/yr saved' },
  ];

  return (
    <section id="portfolio" className="portfolio-section" aria-label="Recent projects">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><Briefcase></Briefcase> Our Work</span>
          <h2>Our Recent <span>Projects</span></h2>
          <p className="section-subtitle">Browse our portfolio of completed solar installations across residential, commercial, and industrial properties nationwide.</p>
        </div>

        <div className="portfolio-filters" data-animate>
          <button className="filter-btn active" data-filter="all">All Projects</button>
          <button className="filter-btn" data-filter="residential">Residential</button>
          <button className="filter-btn" data-filter="commercial">Commercial</button>
          <button className="filter-btn" data-filter="industrial">Industrial</button>
        </div>

        <div className="portfolio-grid">
          {projects.map((p, i) => (
            <div key={i} className="portfolio-card" data-category={p.category} data-animate>
              <div className={`portfolio-image ${p.gradient}`}>
                <DynamicIcon name={p.icon} className="portfolio-placeholder-icon"></DynamicIcon>
              </div>
              <div className="portfolio-overlay">
                <h3 className="portfolio-title">{p.name}</h3>
                <div className="portfolio-meta">
                  <span className="portfolio-meta-item"><Zap></Zap> {p.power}</span>
                  <span className="portfolio-meta-item"><DollarSign></DollarSign> {p.savings}</span>
                </div>
                <a href="#" className="portfolio-link">View Details <ArrowRight></ArrowRight></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
