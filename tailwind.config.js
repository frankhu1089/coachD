/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F2EDE4',
        card: '#FAF7F2',
        accent: '#D4956A',
        accentSoft: '#F0D9C8',
        textPrimary: '#2C1A0E',
        textSecondary: '#9B8680',
        green: '#6B9F72',
        yellow: '#D4A440',
        red: '#C4614A',
        catBrown: '#C4956A',
        catEar: '#E8B09A',
        border: '#E0D8CE',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        card: '20px',
        chip: '12px',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.25s ease both',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
