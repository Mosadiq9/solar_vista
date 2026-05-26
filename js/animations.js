(function() {
  // Wait for page to be ready
  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // ===== HERO ANIMATIONS =====
    const heroTl = gsap.timeline({ delay: 1.8 });
    heroTl
      .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
      .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
      .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
      .from('.hero-ctas .btn', { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, '-=0.3')
      .from('.hero-stats .hero-stat-item', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.2')
      .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.2');
    
    gsap.to('.hero-content', {
      y: 100,
      opacity: 0.3,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
    
    // ===== STATS SECTION =====
    gsap.from('.stat-item', {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#stats',
        start: 'top 80%',
      }
    });
    
    // ===== PRODUCTS SECTION =====
    gsap.from('.products-tabs', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      scrollTrigger: {
        trigger: '#products',
        start: 'top 70%',
      }
    });
    gsap.from('.product-viewer', {
      opacity: 0,
      x: -50,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.products-showcase',
        start: 'top 70%',
      }
    });
    gsap.from('.product-info-panel', {
      opacity: 0,
      x: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.products-showcase',
        start: 'top 70%',
      }
    });
    
    // ===== FEATURES =====
    gsap.from('.feature-card', {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '#features',
        start: 'top 70%',
      }
    });
    
    // ===== PROCESS TIMELINE =====
    gsap.from('.process-line::after', {
      scaleX: 0,
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: '#process',
        start: 'top 60%',
        end: 'center center',
        scrub: 1,
      }
    });
    
    gsap.from('.process-step', {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '#process',
        start: 'top 65%',
      },
      onComplete: function() {
        document.querySelectorAll('.process-step').forEach((step, i) => {
          setTimeout(() => step.classList.add('active'), i * 300);
        });
      }
    });
    
    // ===== CALCULATOR =====
    gsap.from('.calculator-card', {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#calculator',
        start: 'top 70%',
      }
    });
    
    // ===== PORTFOLIO =====
    gsap.from('.portfolio-filters', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top 70%',
      }
    });
    gsap.from('.portfolio-card', {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 75%',
      }
    });
    
    // ===== BLOG =====
    gsap.from('.blog-card', {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#blog',
        start: 'top 85%',
      }
    });
    
    // ===== CONTACT =====
    gsap.from('.contact-form', {
      opacity: 0,
      x: -40,
      duration: 0.7,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
      }
    });
    gsap.from('.contact-info', {
      opacity: 0,
      x: 40,
      duration: 0.7,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
      }
    });
    
    // ===== SECTION HEADERS =====
    document.querySelectorAll('.section-header').forEach(header => {
      gsap.from(header.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
        }
      });
    });
    
    // ===== CERTIFICATIONS =====
    gsap.from('.cert-badge', {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.certifications-grid',
        start: 'top 90%',
      }
    });
    
    // ===== FOOTER =====
    gsap.from('.footer-content > div', {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '#footer',
        start: 'top 85%',
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initAnimations, 100));
  } else {
    setTimeout(initAnimations, 100);
  }
})();
