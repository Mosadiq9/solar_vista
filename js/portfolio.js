(function() {
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
              opacity: 1,
              scale: 1,
              duration: 0.4,
              delay: index * 0.05,
              ease: 'power2.out',
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
              opacity: 0,
              scale: 0.9,
              duration: 0.3,
              ease: 'power2.in',
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
})();
