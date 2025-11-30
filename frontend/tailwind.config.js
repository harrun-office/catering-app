// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Colors use CSS variables defined in overrides.css (OKLCH-based)
        primary: 'var(--color-primary)',
        'primary-600': 'var(--color-primary-600)',
        accent: 'var(--color-accent)',
        'accent-600': 'var(--color-accent-600)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        bg: 'var(--color-bg)',
        'text-strong': 'var(--color-text-strong)',
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
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      boxShadow: { soft: '0 6px 18px rgba(16,24,40,0.06)' }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
