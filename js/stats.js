(function() {
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
})();
