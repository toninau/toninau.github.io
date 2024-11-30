import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: ['selector'],
  theme: {
    extend: {
      boxShadow: {
        'button-pressed':
          'inset 3px 3px 6px var(--button-pressed-shadow-dark), inset -3px -3px 6px var(--button-pressed-shadow-light)'
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
            visibility: 'hidden',
            transform: 'scaleY(1.2)'
          },
          to: {
            opacity: '1',
            visibility: 'visible',
            transform: 'scaleY(1)'
          }
        },
        'fade-out': {
          from: {
            opacity: '1',
            visibility: 'visible',
            transform: 'scaleY(1)'
          },
          to: {
            opacity: '0',
            visibility: 'hidden',
            transform: 'scaleY(0.8)'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'fade-out': 'fade-out 150ms ease-out forwards'
      },
      colors: {
        background: 'var(--background)',
        secondary: 'var(--secondary)',
        button: 'var(--button)',
        'button-hover': 'var(--button-hover)',
        'button-active': 'var(--button-active)',
        'link-icon': 'var(--link-icon)',
        'link-icon-active': 'var(--link-icon-active)'
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-noto-serif)']
      }
    }
  },
  plugins: [typography]
};
export default config;
