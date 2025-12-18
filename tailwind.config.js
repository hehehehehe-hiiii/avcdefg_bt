/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        glass: 'rgba(255, 255, 255, 0.03)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        gold: '#D4C5A5',
        goldDim: 'rgba(212, 197, 165, 0.1)'
      },
      fontFamily: {
        sans: ['var(--font-kanit)', 'Kanit', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 197, 165, 0.1)',
        'island': '0 8px 32px rgba(0, 0, 0, 0.5)',
      }
    }
  },
  plugins: [],
}

