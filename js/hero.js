(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let animationId;
  
  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  
  class Particle {
    constructor() {
      this.reset();
    }
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
      
      const colors = [
        'rgba(245, 158, 11,',
        'rgba(251, 191, 36,',
        'rgba(249, 115, 22,',
        'rgba(255, 255, 255,'
      ];
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
  
  let mainGradient, coreGradient;
  
  function init() {
    resize();
    particles = [];
    // Reduce particle count significantly for performance
    const count = Math.min(60, Math.floor(width * height / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
    
    // Cache gradients
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
    
    // Removed O(N^2) line connection logic to eliminate lag
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    // Only continue animation if visible
    if (isVisible) {
      animationId = requestAnimationFrame(animate);
    }
  }
  
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (!animationId) {
          animate();
        }
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  });
  
  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);
  
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  window.addEventListener('resize', () => {
    resize();
    init();
  });
  
  init();
  animate();
})();
