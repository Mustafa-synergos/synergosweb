import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      maxWidth: {
        xs: '30rem',
        sm: '40rem'
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 35%), radial-gradient(circle at right, rgba(168, 85, 247, 0.12), transparent 25%)'
      },
      fontFamily: {
        'clother': ['clother', 'sans-serif']
      },
      fontSize: {
        h1: 'var(--type-h1)',
        'h1-hero': 'var(--type-h1-hero)',
        h2: 'var(--type-h2)',
        h3: 'var(--type-h3)',
        h4: 'var(--type-h4)',
        h5: 'var(--type-h5)',
        h6: 'var(--type-h6)',
        p: 'var(--type-p)',
      }
    }
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.responsive-clother-h3': {
          fontFamily: 'clother, sans-serif',
          fontSize: 'var(--type-h3)',
          lineHeight: 'var(--lh-h3)',
          fontWeight: '400',
          fontStyle: 'normal',
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
        },
        '.responsive-clother-paragraph': {
          fontFamily: 'clother, sans-serif',
          fontWeight: '200',
          fontStyle: 'normal',
          fontSize: 'var(--type-p)',
          lineHeight: 'var(--lh-p)',
          letterSpacing: '0%',
        },
        '.responsive-clother-red-span': {
          fontFamily: 'clother, sans-serif',
          fontWeight: '400',
          fontStyle: 'italic',
          fontSize: '20px',
          lineHeight: '24px',
          letterSpacing: '0%'
        }
      });
    }),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      });
    })
  ]
};

export default config;
