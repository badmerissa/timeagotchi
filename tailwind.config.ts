import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        tama: {
          bg: '#1a1a2e',
          screen: '#0d1117',
          green: '#39ff14',
          yellow: '#ffd700',
          red: '#ff4444',
          blue: '#00d4ff',
          purple: '#c084fc',
          panel: '#16213e',
          border: '#0f3460',
        },
      },
      keyframes: {
        bounce_pet: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blink: {
          '0%, 90%, 100%': { opacity: '1' },
          '95%': { opacity: '0' },
        },
        droop: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(4px) rotate(-2deg)' },
        },
        fed: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.3)' },
          '60%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        bounce_pet: 'bounce_pet 0.7s ease-in-out infinite',
        blink: 'blink 4s ease-in-out infinite',
        droop: 'droop 2s ease-in-out infinite',
        fed: 'fed 0.5s ease-in-out',
        sparkle: 'sparkle 1s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
