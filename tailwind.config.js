/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#151621',
        border: {
          DEFAULT: 'rgba(21, 22, 33, 0.08)',
          strong: 'rgba(21, 22, 33, 0.14)',
        },
        'surface-elevated': '#f6f7fb',
        // Brand - Primary
        primary: {
          50: '#EFF2FF',
          100: '#DFE5FF',
          200: '#BFCBFF',
          300: '#9FB1FF',
          400: '#5F7FFF',
          500: '#2F52F5',
          600: '#1E3EDB',
          700: '#162FB8',
          800: '#0F2095',
          900: '#081172',
        },
        // Semantic - Status Colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
        // Semantic - UI Colors
        surface: {
          DEFAULT: '#f9f8f6',
          light: '#fafafa',
          dark: '#f5f5f4',
        },
        muted: {
          DEFAULT: '#64748b',
          light: '#94a3b8',
          dark: '#475569',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        marquee: 'marquee 40s linear infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(47, 82, 245, 0.35)',
        elevated: '0 30px 80px -30px rgba(21, 22, 33, 0.25), 0 0 0 1px rgba(21, 22, 33, 0.04)',
        soft: '0 1px 2px rgba(21, 22, 33, 0.04), 0 8px 24px -12px rgba(21, 22, 33, 0.08)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
