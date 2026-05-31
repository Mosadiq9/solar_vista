'use client';
import { Home, Zap, Leaf, Award } from 'lucide-react';
import { useEffect } from 'react';

export default function Stats() {
  useEffect(() => {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateValue(element, start, end, duration) {
      const startTime = performance.now();
      const suffix = element.dataset.suffix || '';

      function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
      }

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (end - start) * easedProgress);
        element.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach((num, index) => {
            const target = parseInt(num.dataset.target);
            setTimeout(() => {
              animateValue(num, 0, target, 2000);
            }, index * 200);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('stats');
    if (statsSection) observer.observe(statsSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className="stats-section" aria-label="Company statistics">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-item" data-animate>
            <div className="stat-icon"><Home></Home></div>
            <div className="stat-number" data-target="15000" data-suffix="+">0</div>
            <div className="stat-label">Installations Completed</div>
          </div>
          <div className="stat-item" data-animate>
            <div className="stat-icon"><Zap></Zap></div>
            <div className="stat-number" data-target="250" data-suffix="MW+">0</div>
            <div className="stat-label">Energy Generated</div>
          </div>
          <div className="stat-item" data-animate>
            <div className="stat-icon"><Leaf></Leaf></div>
            <div className="stat-number" data-target="120000" data-suffix="T">0</div>
            <div className="stat-label">CO₂ Offset (Tons)</div>
          </div>
          <div className="stat-item" data-animate>
            <div className="stat-icon"><Award></Award></div>
            <div className="stat-number" data-target="98" data-suffix="%">0</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
