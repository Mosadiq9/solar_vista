(function() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  
  const cards = track.querySelectorAll('.testimonial-card');
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
  
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
  
  let startX, scrollLeft, isDragging = false;
  
  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX;
    scrollLeft = track.parentElement.scrollLeft;
    track.style.animationPlayState = 'paused';
  });
  
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const walk = (startX - x) * 2;
    track.parentElement.scrollLeft = scrollLeft + walk;
  });
  
  track.addEventListener('touchend', () => {
    isDragging = false;
    track.style.animationPlayState = 'running';
  });
})();
