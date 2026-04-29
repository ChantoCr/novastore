/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#111827',
        primary: '#8b5cf6',
        accent: '#22c55e',
      },
      boxShadow: {
        glow: '0 10px 30px rgba(139, 92, 246, 0.25)',
      },
    },
  },
  plugins: [],
};
