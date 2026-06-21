/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base:    '#07090c',
        surface: '#0d1520',
        card:    '#111e2b',
        'card-hover': '#162438',
        border:  '#1a2e40',
        gold:    '#c9a96e',
        'gold-dim': '#8a6d3f',
        'text-pri': '#dce6f0',
        'text-sec': '#8aa0b8',
        'text-muted': '#445a70',
      },
    },
  },
  plugins: [],
}
