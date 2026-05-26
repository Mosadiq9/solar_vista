document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm && window.supabaseClient) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Basic Validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const systemType = document.getElementById('system-type').value;
      const message = document.getElementById('message').value.trim();
      
      if (!name || !email) {
        showToast('Please fill in your name and email.', 'error');
        return;
      }
      
      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="lucide-loader animate-spin"></i> Sending...';
      
      try {
        const { data, error } = await window.supabaseClient
          .from('leads')
          .insert([
            { name, email, phone, address, system_type: systemType, message }
          ]);
          
        if (error) throw error;
        
        // Success
        showToast('Success! Your inquiry has been sent.', 'success');
        contactForm.reset();
      } catch (err) {
        console.error('Supabase Error:', err);
        showToast('Failed to send inquiry. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});

// Simple Toast Notification System
function showToast(message, type = 'success') {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 10000; display: flex; flex-direction: column; gap: 12px;';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'var(--gradient-green)' : 'linear-gradient(135deg, #ef4444, #b91c1c)';
  
  toast.style.cssText = `
    background: ${bg};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    transform: translateX(120%);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  if (window.lucide) {
    window.lucide.createIcons({ root: toast });
  }
  
  // Animate In
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });
  
  // Animate Out & Remove
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
