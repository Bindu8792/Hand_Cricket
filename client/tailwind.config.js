/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: { 50: '#f0fdf4', 400: '#4ade80', 600: '#16a34a', 800: '#166534', 900: '#14532d', 950: '#052e16' },
        leather: '#b91c1c',
        gold: '#facc15',
      },
      fontFamily: { display: ['"Trebuchet MS"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
