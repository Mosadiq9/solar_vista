'use client';
import { useEffect } from 'react';

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      const handleLoad = () => {
        setTimeout(() => {
          preloader.classList.add('loaded');
          document.body.classList.add('loaded');
        }, 200);
      };
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  return (
    <div id="preloader" className="preloader">
      <div className="preloader-content">
        <div className="preloader-sun"></div>
        <p className="preloader-text">SolarVista</p>
      </div>
    </div>
  );
}
