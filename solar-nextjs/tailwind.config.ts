import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Brand Colors ─────────────────────────────────────────────────────
      colors: {
        brand: {
          bg: 'rgb(var(--rgb-bg) / <alpha-value>)',
          primary: 'rgb(var(--rgb-primary) / <alpha-value>)',
          accent: 'rgb(var(--rgb-accent) / <alpha-value>)',
          white: 'rgb(var(--rgb-white) / <alpha-value>)',
          'primary-dark': 'rgb(var(--rgb-primary-dark) / <alpha-value>)',
          'primary-light': 'rgb(var(--rgb-primary-light) / <alpha-value>)',
          'accent-dark': 'rgb(var(--rgb-accent-dark) / <alpha-value>)',
          'accent-light': 'rgb(var(--rgb-accent-light) / <alpha-value>)',
          surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
          'surface-2': 'rgb(var(--rgb-surface-2) / <alpha-value>)',
          muted: 'rgb(var(--rgb-muted) / <alpha-value>)',
          border: 'rgb(var(--rgb-border) / <alpha-value>)',
        },
      },

      // ─── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-orbitron)', 'Orbitron', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'display-sm': ['clamp(1.875rem, 4vw, 2.5rem)', { lineHeight: '1.1' }],
        'display-md': ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.05' }],
        'display-lg': ['clamp(3rem, 7vw, 5rem)', { lineHeight: '1' }],
        'display-xl': ['clamp(3.75rem, 9vw, 7rem)', { lineHeight: '0.95' }],
      },

      // ─── Spacing Scale ─────────────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '68': '17rem',
        '72': '18rem',
        '76': '19rem',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '128': '32rem',
        '136': '34rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
        '208': '52rem',
        '224': '56rem',
        '240': '60rem',
        '256': '64rem',
        '288': '72rem',
        '320': '80rem',
      },

      // ─── Border Radius ──────────────────────────────────────────────────────
      borderRadius: {
        '2xs': '0.125rem',
        xs: '0.25rem',
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        full: '9999px',
      },

      // ─── Box Shadows & Glows ───────────────────────────────────────────────
      boxShadow: {
        'glow-primary': '0 0 20px rgba(245, 166, 35, 0.4)',
        'glow-primary-lg': '0 0 40px rgba(245, 166, 35, 0.6)',
        'glow-accent': '0 0 20px rgba(0, 230, 118, 0.4)',
        'glow-accent-lg': '0 0 40px rgba(0, 230, 118, 0.6)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'inner-glow': 'inset 0 0 30px rgba(245, 166, 35, 0.1)',
      },

      // ─── Animation Durations ───────────────────────────────────────────────
      transitionDuration: {
        '0': '0ms',
        '50': '50ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },

      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ─── Animations ────────────────────────────────────────────────────────
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 166, 35, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 166, 35, 0.8)' },
        },
        'accent-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 230, 118, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 230, 118, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'accent-pulse': 'accent-pulse 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
      },

      // ─── Z-Index System ────────────────────────────────────────────────────
      zIndex: {
        behind: '-1',
        base: '0',
        raised: '10',
        overlay: '20',
        dropdown: '30',
        sticky: '40',
        fixed: '50',
        'modal-backdrop': '60',
        modal: '70',
        popover: '80',
        toast: '90',
        tooltip: '100',
        chatbot: '110',
        top: '9999',
      },

      // ─── Screens (Breakpoints) ─────────────────────────────────────────────
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
      },

      // ─── Container ──────────────────────────────────────────────────────────
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2.5rem',
          xl: '3rem',
          '2xl': '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },

      // ─── Backdrop Blur ─────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};

export default config;
