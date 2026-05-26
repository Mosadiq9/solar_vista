/* ═══════════════════════════════════════════════════════════════
   SOLARNOVA — MAIN JAVASCRIPT
   Hero Canvas · GSAP ScrollTrigger · Calculator · Testimonials · FAQ
═══════════════════════════════════════════════════════════════ */

/* ── GSAP PLUGIN REGISTRATION ───────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   HERO PARTICLE CANVAS
══════════════════════════════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, connections;
  const MAX_PARTICLES = 130;
  const CONNECT_DIST  = 140;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = -(Math.random() * 0.5 + 0.15);
      this.life = 0;
      this.maxLife = 200 + Math.random() * 400;
      this.r    = Math.random() * 2 + 0.5;
      this.hue  = 30 + Math.random() * 30;   /* orange-gold range */
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -20) this.reset(false);
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: MAX_PARTICLES }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const a = (1 - d / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,150,40,${a})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  /* Animated sun glow in top-center */
  function drawSunGlow(t) {
    const cx = W * 0.5, cy = H * 0.18;
    const pulse = 1 + 0.06 * Math.sin(t * 0.001);

    /* outer diffuse */
    const g3 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380 * pulse);
    g3.addColorStop(0,   'rgba(255,140,0,0.08)');
    g3.addColorStop(0.4, 'rgba(255,100,0,0.04)');
    g3.addColorStop(1,   'rgba(255,100,0,0)');
    ctx.fillStyle = g3;
    ctx.beginPath();
    ctx.arc(cx, cy, 380 * pulse, 0, Math.PI * 2);
    ctx.fill();

    /* core */
    const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90 * pulse);
    g1.addColorStop(0,   'rgba(255,220,80,0.55)');
    g1.addColorStop(0.4, 'rgba(255,150,0,0.25)');
    g1.addColorStop(1,   'rgba(255,100,0,0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(cx, cy, 90 * pulse, 0, Math.PI * 2);
    ctx.fill();

    /* rays */
    for (let i = 0; i < 12; i++) {
      const ang  = (i / 12) * Math.PI * 2 + t * 0.0003;
      const len  = 120 + 40 * Math.sin(t * 0.0008 + i);
      const x1   = cx + Math.cos(ang) * 55;
      const y1   = cy + Math.sin(ang) * 55;
      const x2   = cx + Math.cos(ang) * (55 + len);
      const y2   = cy + Math.sin(ang) * (55 + len);
      const rg   = ctx.createLinearGradient(x1, y1, x2, y2);
      rg.addColorStop(0, 'rgba(255,200,60,0.3)');
      rg.addColorStop(1, 'rgba(255,150,0,0)');
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = rg;
      ctx.lineWidth   = 2 + Math.sin(t * 0.0015 + i) * 1;
      ctx.stroke();
    }
  }

  let raf;
  function loop(t) {
    ctx.clearRect(0, 0, W, H);

    /* dark sky gradient */
    const bg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, H / 2, Math.max(W, H));
    bg.addColorStop(0,   '#0d1830');
    bg.addColorStop(0.5, '#060b18');
    bg.addColorStop(1,   '#030710');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    drawSunGlow(t);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });

    raf = requestAnimationFrame(loop);
  }

  init();
  raf = requestAnimationFrame(loop);
  window.addEventListener('resize', () => { resize(); });
})();


/* ══════════════════════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
══════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { ham.classList.remove('open'); menu.classList.remove('open'); });
  });
})();


/* ══════════════════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
══════════════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  /* Generic reveal helpers */
  const fadeUp = (selector, opts = {}) => {
    document.querySelectorAll(selector).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: opts.y ?? 50 },
        {
          opacity: 1, y: 0,
          duration: opts.dur ?? 0.85,
          ease: 'power3.out',
          delay: opts.delay ?? 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
            ...opts.st,
          }
        }
      );
    });
  };
  const fadeLeft = (selector, opts = {}) => {
    document.querySelectorAll(selector).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse', ...opts.st } }
      );
    });
  };
  const fadeRight = (selector, opts = {}) => {
    document.querySelectorAll(selector).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse', ...opts.st } }
      );
    });
  };

  /* Section tags */
  fadeUp('.section-tag',   { y: 20, dur: 0.6 });
  fadeUp('.section-title', { y: 40, dur: 0.9 });
  fadeUp('.section-desc',  { y: 30, dur: 0.7, delay: 0.1 });

  /* About */
  fadeLeft('.about-text');
  fadeRight('.about-visual');

  /* About float cards stagger */
  gsap.utils.toArray('.about-float-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, scale: 0.7, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)',
        delay: 0.2 + i * 0.15,
        scrollTrigger: { trigger: '.about-visual', start: 'top 80%' }
      }
    );
  });

  /* Services stagger */
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        delay: (i % 3) * 0.12,
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' }
      }
    );
  });

  /* Process steps stagger */
  gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.15,
        scrollTrigger: {
          trigger: '.process-steps',
          start: 'top 82%',
          onEnter: () => {
            step.classList.add('in-view');
            const prog = document.getElementById('processProgress');
            if (prog) gsap.to(prog, { width: `${((i + 1) / 4) * 100}%`, duration: 0.8, delay: i * 0.15 });
          }
        }
      }
    );
  });

  /* Why us */
  fadeLeft('.why-text');
  fadeRight('.why-visual');

  gsap.utils.toArray('.wf-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.1,
        scrollTrigger: { trigger: item, start: 'top 90%' }
      }
    );
  });

  /* Products */
  fadeUp('.product-switcher', { y: 30, dur: 0.7 });
  gsap.fromTo('.product-stage',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.product-stage', start: 'top 85%' }
    }
  );

  /* Stats */
  gsap.utils.toArray('.stat-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)', delay: i * 0.08,
        scrollTrigger: { trigger: '.stats-grid', start: 'top 85%' }
      }
    );
  });

  /* Projects */
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, scale: 0.92, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.08,
        scrollTrigger: { trigger: '.projects-grid', start: 'top 85%' }
      }
    );
  });

  /* Testimonials */
  fadeUp('.testi-card', { y: 40 });

  /* Calculator */
  fadeLeft('.calc-left');
  fadeRight('.calc-right');

  /* FAQ */
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.07,
        scrollTrigger: { trigger: item, start: 'top 90%' }
      }
    );
  });

  /* CTA banner */
  gsap.fromTo('.cta-content',
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-banner', start: 'top 80%' }
    }
  );

  /* Contact */
  fadeLeft('.contact-info');
  fadeRight('.contact-form-wrap');
})();


/* ══════════════════════════════════════════════════════════════
   ANIMATED STAT COUNTERS
══════════════════════════════════════════════════════════════ */
(function initCounters() {
  const cards = document.querySelectorAll('.stat-card[data-count]');
  if (!cards.length) return;

  const fmt = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 !== 0 ? 1 : 0) + 'K';
    return n.toString();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card   = entry.target;
      const target = parseInt(card.dataset.count);
      const suffix = card.dataset.suffix || '';
      const label  = card.dataset.label  || '';

      card.innerHTML = `
        <span class="stat-number">0${suffix}</span>
        <span class="stat-label">${label}</span>
      `;

      const numEl = card.querySelector('.stat-number');
      const startTime = performance.now();
      const dur = 2200;

      const tick = (now) => {
        const p = Math.min((now - startTime) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = Math.round(ease * target);
        numEl.textContent = fmt(val) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(card);
    });
  }, { threshold: 0.4 });

  cards.forEach(c => observer.observe(c));
})();


/* ══════════════════════════════════════════════════════════════
   PROJECT FILTER
══════════════════════════════════════════════════════════════ */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.cat;
        if (f === 'all' || cat === f) {
          card.style.display = '';
          gsap.fromTo(card, { opacity: 0, scale: 0.93 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
        } else {
          gsap.to(card, { opacity: 0, scale: 0.93, duration: 0.3, ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
    });
  });
})();


/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
══════════════════════════════════════════════════════════════ */
(function initTestimonials() {
  const track  = document.getElementById('testiTrack');
  const prev   = document.getElementById('testiPrev');
  const next   = document.getElementById('testiNext');
  const dotsEl = document.getElementById('testiDots');
  if (!track) return;

  const cards    = track.querySelectorAll('.testi-card');
  let perView    = 3, current = 0, total, autoTimer;

  const getPerView = () => window.innerWidth < 700 ? 1 : window.innerWidth < 1000 ? 2 : 3;

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    total = Math.max(1, cards.length - perView + 1);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'testi-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const cardW = cards[0].offsetWidth + 24;
    gsap.to(track, { x: -current * cardW, duration: 0.6, ease: 'power3.inOut' });
    dotsEl?.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo((current + 1) % total), 4800);
  }

  function setup() {
    perView = getPerView();
    gsap.set(track, { x: 0 });
    current = 0;
    buildDots();
    startAuto();
  }

  prev?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  next?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(setup, 200); });
  setup();
})();


/* ══════════════════════════════════════════════════════════════
   SOLAR SAVINGS CALCULATOR
══════════════════════════════════════════════════════════════ */
(function initCalculator() {
  const billSlider  = document.getElementById('billSlider');
  const roofSlider  = document.getElementById('roofSlider');
  const stateSelect = document.getElementById('stateSelect');
  const billVal     = document.getElementById('billValue');
  const roofVal     = document.getElementById('roofValue');
  if (!billSlider) return;

  /* live gradient fill on sliders */
  function updateSliderFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background =
      `linear-gradient(to right, #FF6B00 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  }

  function animateValue(el, newVal) {
    gsap.to({}, {
      duration: 0.6,
      ease: 'power2.out',
      onUpdate() {
        /* just trigger a re-render flash */
        el.style.filter = 'brightness(1.2)';
      },
      onComplete() { el.textContent = newVal; el.style.filter = ''; }
    });
    el.textContent = newVal;
  }

  function calc() {
    const bill      = parseFloat(billSlider.value);
    const roof      = parseFloat(roofSlider.value);
    const sunHours  = parseFloat(stateSelect.value);
    const ratePerKWh = 0.14;

    billVal.textContent = `$${bill}`;
    roofVal.textContent = `${roof} sq ft`;

    /* Calculations */
    const annualKWh   = (bill / ratePerKWh) * 12;
    const neededKW    = annualKWh / (sunHours * 365 * 0.78);
    const maxKW       = roof / 100 * 0.95;           /* ~1 panel per 100 sqft */
    const systemKW    = Math.min(neededKW, maxKW);
    const annualGen   = systemKW * sunHours * 365 * 0.78;
    const annualSave  = Math.min(annualGen, annualKWh) * ratePerKWh;
    const costPerKW   = 2800;
    const systemCost  = systemKW * costPerKW;
    const fedCredit   = systemCost * 0.30;
    const netCost     = systemCost - fedCredit;
    const payback     = netCost / annualSave;
    const co2         = annualGen * 0.00042 * 1000;    /* kg → metric tons */
    const lifetime    = annualSave * 25;

    /* update DOM */
    document.getElementById('crSystemSize').textContent  = systemKW.toFixed(1) + ' kW';
    document.getElementById('crAnnualSavings').textContent = '$' + Math.round(annualSave).toLocaleString();
    document.getElementById('crPayback').textContent     = payback.toFixed(1) + ' yrs';
    document.getElementById('crCO2').textContent         = co2.toFixed(1) + ' tons';
    document.getElementById('crLifetime').textContent    = '$' + Math.round(lifetime).toLocaleString();

    updateSliderFill(billSlider);
    updateSliderFill(roofSlider);
  }

  [billSlider, roofSlider, stateSelect].forEach(el => el.addEventListener('input', calc));
  updateSliderFill(billSlider);
  updateSliderFill(roofSlider);
  calc();
})();


/* ══════════════════════════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════════════════════════ */
(function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();


/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('loading');
    setTimeout(() => {
      form.classList.remove('loading');
      form.classList.add('sent');
      gsap.fromTo(form.querySelector('.btn-sent'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
    }, 1800);
  });
})();


/* ══════════════════════════════════════════════════════════════
   FOOTER NEWSLETTER
══════════════════════════════════════════════════════════════ */
(function initNewsletter() {
  document.querySelector('.footer-newsletter')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = '✓';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = '→';
      btn.style.background = '';
      e.target.querySelector('input').value = '';
    }, 3000);
  });
})();


/* ══════════════════════════════════════════════════════════════
   SMOOTH ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ══════════════════════════════════════════════════════════════
   CTA SECTION PARTICLES
══════════════════════════════════════════════════════════════ */
(function initCtaParticles() {
  const wrap = document.getElementById('ctaParticles');
  if (!wrap) return;
  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      width: ${Math.random() * 5 + 2}px;
      height: ${Math.random() * 5 + 2}px;
      border-radius: 50%;
      background: rgba(255,255,255,${Math.random() * 0.3 + 0.05});
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      pointer-events: none;
    `;
    wrap.appendChild(dot);
    gsap.to(dot, {
      y: -(Math.random() * 80 + 40),
      x: (Math.random() - 0.5) * 60,
      opacity: 0,
      duration: Math.random() * 4 + 3,
      ease: 'power1.out',
      repeat: -1,
      delay: Math.random() * 5,
    });
  }
  wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;';
})();


/* ══════════════════════════════════════════════════════════════
   HERO TITLE REVEAL (split lines)
══════════════════════════════════════════════════════════════ */
(function initHeroTitle() {
  const lines = document.querySelectorAll('.hero-title .reveal-line');
  lines.forEach((line, i) => {
    gsap.fromTo(line,
      { opacity: 0, y: 60, skewY: 4 },
      { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out', delay: 0.5 + i * 0.18 }
    );
  });
})();
