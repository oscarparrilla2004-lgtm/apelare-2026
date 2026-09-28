/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        'gold-light': '#f3e5ab',
        crimson: '#b22222',
        akelarre: {
          dark: '#070509',
          card: '#120b18',
          red: '#8b0000',
          blood: '#660000',
          crimson: '#b22222',
          gold: '#d4af37',
          goldLight: '#f3e5ab',
          midnight: '#0b1021',
        },
      },
      fontFamily: {
        gothic: ['var(--font-cinzel)', 'serif'],
        handwriting: ['var(--font-medieval)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.5s infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(212, 175, 55, 0.9))' },
        },
      },
    },
  },
  plugins: [],
}
