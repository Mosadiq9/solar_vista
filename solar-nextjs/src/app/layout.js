import Script from 'next/script';
import Chatbot from '@/features/chatbot/components/Chatbot';
import './globals.css';

export const metadata = {
  title: 'SolarVista — Premium Solar Energy Solutions | Power Your Future',
  description: 'SolarVista delivers cutting-edge solar energy solutions for homes and businesses. Save up to 80% on electricity bills with our premium solar panels, battery storage, and smart inverters. Get a free quote today.',
  keywords: 'solar energy, solar panels, renewable energy, solar installation, battery storage, solar savings, green energy, sustainable power',
  authors: [{ name: 'SolarVista' }],
  openGraph: {
    type: 'website',
    title: 'SolarVista — Premium Solar Energy Solutions | Power Your Future',
    description: 'Transform your energy future with cutting-edge solar technology. Save up to 80% on electricity bills while powering a sustainable tomorrow.',
    siteName: 'SolarVista',
    locale: 'en_US',
    url: 'https://solarvista.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolarVista — Premium Solar Energy Solutions',
    description: 'Transform your energy future with cutting-edge solar technology. Save up to 80% on electricity bills.',
  },
  other: {
    'theme-color': '#0a0e17',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Chatbot />

        {/* GSAP + ScrollTrigger */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" strategy="beforeInteractive" />

        {/* Three.js */}
        <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/renderers/CSS2DRenderer.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/environments/RoomEnvironment.js" strategy="beforeInteractive" />


      </body>
    </html>
  );
}
