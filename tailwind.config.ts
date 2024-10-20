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
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
            visibility: 'hidden'
          },
          to: {
            opacity: '1',
            visibility: 'visible'
          }
        },
        'fade-out': {
          from: {
            opacity: '1',
            visibility: 'visible'
          },
          to: {
            opacity: '0',
            visibility: 'hidden'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 250ms ease-in',
        'fade-out': 'fade-out 250ms ease-out forwards'
      },
      colors: {
        background: 'var(--background)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'button-base': 'var(--button-base)',
        'link-icon': 'var(--link-icon)',
        'link-icon-active': 'var(--link-icon-active)'
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-merriweather)']
      }
    }
  },
  plugins: [typography]
};
export default config;
