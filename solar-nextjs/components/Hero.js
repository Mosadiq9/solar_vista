'use client';
import { Sparkles, Calculator, Box, ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let animationId;
    let isVisible = true;
    let mainGradient, coreGradient;

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        const sunX = width * 0.75;
        const sunY = height * 0.4;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.max(width, height) * 0.8;
        this.x = sunX + Math.cos(angle) * distance;
        this.y = sunY + Math.sin(angle) * distance;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        const colors = ['rgba(245, 158, 11,', 'rgba(251, 191, 36,', 'rgba(249, 115, 22,', 'rgba(255, 255, 255,'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.speedX -= dx * 0.00005;
          this.speedY -= dy * 0.00005;
        }
        if (this.life <= 0) this.reset();
      }
      draw() {
        const fadeRatio = this.life / this.maxLife;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * fadeRatio) + ')';
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];
      const count = Math.min(60, Math.floor(width * height / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
      const sunX = width * 0.75;
      const sunY = height * 0.4;
      mainGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 350);
      mainGradient.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
      mainGradient.addColorStop(0.3, 'rgba(245, 158, 11, 0.08)');
      mainGradient.addColorStop(0.6, 'rgba(245, 158, 11, 0.03)');
      mainGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      coreGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 80);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      coreGradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.06)');
      coreGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
    }

    function drawSunGlow() {
      ctx.fillStyle = mainGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, width, height);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      drawSunGlow();
      particles.forEach(p => { p.update(); p.draw(); });
      if (isVisible) {
        animationId = requestAnimationFrame(animate);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) { if (!animationId) animate(); }
        else { cancelAnimationFrame(animationId); animationId = null; }
      });
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) observer.observe(heroSection);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => { resize(); init(); };
    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="hero" className="hero-section" aria-label="Hero">
      <canvas id="hero-canvas" ref={canvasRef} aria-hidden="true"></canvas>

      <div className="hero-content container">
        <div className="hero-badge" data-animate>
          <Sparkles></Sparkles>
          <span>#1 Rated Solar Provider 2025</span>
        </div>

        <h1 className="hero-title" data-animate>
          Harness the <span className="gradient-text">Power of the Sun</span>
        </h1>

        <p className="hero-subtitle" data-animate>
          Transform your energy future with cutting-edge solar technology. Save up to 80% on electricity bills while powering a sustainable tomorrow.
        </p>

        <div className="hero-ctas" data-animate>
          <a href="#calculator" className="btn btn-primary">
            <Calculator></Calculator> Calculate Savings
          </a>
          <a href="/products" className="btn btn-secondary">
            <Box></Box> Explore Products
          </a>
        </div>

        <div className="hero-stats" data-animate>
          <div className="hero-stat-item">
            <span className="hero-stat-number">15K+</span>
            <span className="hero-stat-label">Installations</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">98%</span>
            <span className="hero-stat-label">Satisfaction</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">$50M+</span>
            <span className="hero-stat-label">Saved</span>
          </div>
        </div>
      </div>

      <div className="scroll-indicator" data-animate>
        <ChevronDown></ChevronDown>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
