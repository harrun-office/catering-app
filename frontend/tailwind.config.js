// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Food Industry Colors - OKLCH-based CSS variables
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'accent-dark': 'var(--color-accent-dark)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        bg: 'var(--color-bg)',
        'text-strong': 'var(--color-text-strong)',
        'text-medium': 'var(--color-text-medium)',
        'text-light': 'var(--color-text-light)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
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
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      boxShadow: { soft: '0 6px 18px rgba(16,24,40,0.06)' }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
