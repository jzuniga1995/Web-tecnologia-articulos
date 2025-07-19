const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.zinc.100'),
            h1: {
              color: theme('colors.cyan.400'),
              fontWeight: '700',
              marginBottom: theme('spacing.4'),
            },
            h2: {
              color: theme('colors.cyan.400'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
              fontWeight: '600',
            },
            p: {
              color: theme('colors.zinc.200'),
              lineHeight: theme('lineHeight.relaxed'),
              marginBottom: theme('spacing.4'),
            },
            a: {
              color: theme('colors.blue.400'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            strong: { color: theme('colors.white') },
            ul: { paddingLeft: theme('spacing.5') },
            ol: { paddingLeft: theme('spacing.5') },
            li: { marginBottom: theme('spacing.2') },
            blockquote: {
              borderLeftColor: theme('colors.blue.500'),
              color: theme('colors.zinc.300'),
              fontStyle: 'italic',
              paddingLeft: theme('spacing.4'),
            },
            code: {
              backgroundColor: theme('colors.zinc.800'),
              padding: theme('spacing.1'),
              borderRadius: theme('borderRadius.sm'),
              color: theme('colors.cyan.300'),
            },
            // 🧩 Estilos para tablas
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              borderCollapse: 'collapse',
            },
            thead: {
              borderBottom: `2px solid ${theme('colors.zinc.600')}`,
              color: theme('colors.zinc.100'),
            },
            th: {
              padding: theme('spacing.2'),
              fontWeight: '600',
            },
            td: {
              padding: theme('spacing.2'),
              borderBottom: `1px solid ${theme('colors.zinc.800')}`,
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
