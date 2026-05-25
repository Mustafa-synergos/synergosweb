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
      }
    }
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.responsive-clother-h3': {
          fontFamily: 'clother, sans-serif',
          fontWeight: '400',
          fontStyle: 'normal',
          fontSize: '22px',
          lineHeight: '32px',
          letterSpacing: '0%',
          textTransform: 'uppercase',
          '@screen xl': {
            fontSize: '52px',
            lineHeight: '54px'
          }
        },
        '.responsive-clother-paragraph': {
          fontFamily: 'clother, sans-serif',
          fontWeight: '200',
          fontStyle: 'normal',
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0%',
          '@screen xl': {
            fontSize: '18px',
            lineHeight: '26px'
          }
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
