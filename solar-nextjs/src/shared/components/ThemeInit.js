'use client';
import { useEffect } from 'react';

export default function ThemeInit() {
  useEffect(() => {
    function initTheme() {
      const themeToggle = document.getElementById('theme-toggle');
      if (!themeToggle) return;

      const sunIcon = themeToggle.querySelector('.sun-icon');
      const moonIcon = themeToggle.querySelector('.moon-icon');

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

    initTheme();
  }, []);

  return null;
}
