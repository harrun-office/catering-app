// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Orange
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          light: 'var(--color-primary-light)',
          lighter: 'var(--color-primary-lighter)',
          dark: 'var(--color-primary-dark)',
          darker: 'var(--color-primary-darker)',
        },
        // Secondary Colors - Emerald Teal
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          light: 'var(--color-secondary-light)',
          lighter: 'var(--color-secondary-lighter)',
          dark: 'var(--color-secondary-dark)',
          darker: 'var(--color-secondary-darker)',
        },
        // Legacy support
        accent: 'var(--color-accent)',
        'accent-600': 'var(--color-accent-600)',
        // Surfaces
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        // Backgrounds
        bg: 'var(--color-bg)',
        'bg-warm': 'var(--color-bg-warm)',
        'bg-cream': 'var(--color-bg-cream)',
        'bg-peach': 'var(--color-bg-peach)',
        // Text
        'text-strong': 'var(--color-text-strong)',
        'text-medium': 'var(--color-text-medium)',
        'text-light': 'var(--color-text-light)',
        'text-muted': 'var(--color-text-muted)',
        // Status
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '4rem'
        }
      },
      screens: {
        'xs': '480px',
        // keep rest default (sm, md, lg, xl)
      },
      fontFamily: { 
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.02em' }],
        'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      },
      boxShadow: { soft: '0 6px 18px rgba(16,24,40,0.06)' }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
