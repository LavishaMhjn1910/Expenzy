/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1B18',
        surface: '#142822',
        surfaceLight: '#1B342C',
        hairline: '#274238',
        mint: '#52B788',
        mintDark: '#2F6F4E',
        gold: '#E3B23C',
        rust: '#C4593B',
        paper: '#EDEAE0',
        muted: '#9CAA9F',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(237,234,224,0.06), 0 8px 24px -8px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
