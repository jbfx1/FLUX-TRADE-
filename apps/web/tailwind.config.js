/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          light: '#22d3ee',
          dark: '#0f172a'
        }
      }
    }
  },
  plugins: []
};
