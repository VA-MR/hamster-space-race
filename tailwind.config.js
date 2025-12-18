/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      colors: {
        cosmic: {
          dark: '#0a0a1a',
          900: '#0a0a1a',
          800: '#12122e',
          700: '#1a1a42',
          600: '#252556',
          500: '#3d3d8a',
          400: '#5858b8',
          300: '#7878d4',
          200: '#a0a0e8',
          100: '#c8c8f4',
          accent: '#a855f7',
          glow: '#c084fc',
          success: '#4ade80',
          danger: '#f87171',
        },
        nebula: {
          pink: '#ff6b9d',
          purple: '#c06bc7',
          blue: '#6b8bff',
        },
        star: {
          gold: '#ffd93d',
          white: '#fffef0',
          orange: '#ffab4a',
        },
        correct: '#4ade80',
        wrong: '#f87171',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 217, 61, 0.4), 0 0 40px rgba(255, 217, 61, 0.2)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 217, 61, 0.6), 0 0 60px rgba(255, 217, 61, 0.4)',
            transform: 'scale(1.02)'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'bounce-in': {
          '0%': { opacity: 0, transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(ellipse at bottom, #1a1a42 0%, #0a0a1a 100%)',
        'nebula-gradient': 'linear-gradient(135deg, rgba(192, 107, 199, 0.3) 0%, rgba(107, 139, 255, 0.3) 100%)',
      },
    },
  },
  plugins: [],
}
