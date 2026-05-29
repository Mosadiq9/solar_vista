document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  

  initTheme();
  
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.add('loaded');
      }, 200); // Optimized from 1500ms to reduce perceived wait time
    }
  });
});



function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  // Check saved theme or default to dark
  const savedTheme = localStorage.getItem('solarvista-theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  } else {
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  }
  
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('solarvista-theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('solarvista-theme', 'light');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  });
}
