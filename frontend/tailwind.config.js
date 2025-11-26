// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9',
          50: '#F6F3FF',
          100: '#EEE9FF',
          200: '#D9CFFF',
          300: '#C0A8FF',
          400: '#9B6BFF',
          500: '#6D28D9',
          600: '#5B21B6',
          700: '#4A1A93',
        },
        accent: {
          DEFAULT: '#06B6D4',
          600: '#0891B2'
        },
        neutral900: '#0F172A',
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
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      boxShadow: { soft: '0 6px 18px rgba(16,24,40,0.06)' }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
