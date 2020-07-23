/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  purge: {
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
      'content/**/*.md',
    ],
    options: {
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^nuxt-link(|-exact)-active$/,
      ],
    },
  },
  theme: {
    fontFamily: {
      display: ['Montserrat', 'sans-serif'],
      body: ['Noto Sans', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
    },

    extend: {
      fontSize: {
        xl: 'calc(1em + 0.40vw)',
        '2xl': 'calc(1em + 0.75vw)',
        '3xl': 'calc(1em + 1.75vw)',
        '6xl': 'calc(1em + 2.8vw)',
      },
      colors: {
        'dark-light': '#151518',
        dark: 'hsl(240 6% 9%)',
        carbon: '#333',
        'accent-900': '#009f53',
        'accent-800': 'var(--accent, #06d77b)',
        'accent-100': '#7bffc5',

        warning: 'hsl(33deg 100% 77%)',
        error: '#cf6679',

        'gray-900': 'hsl(0 0% 29%)',
        'gray-800': '#a2a2a2',
        'gray-700': '#e8e8e8',
        'gray-200': 'hsl(0 0% 74%)',
        'gray-100': '#f6f6f6',
      },
      screens: {
        motion: { raw: '(prefers-reduced-motion: no-preference)' },
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'dark-mode'],
    textColor: ['responsive', 'hover', 'focus', 'dark-mode'],
    borderColor: ['responsive', 'hover', 'focus', 'dark-mode'],
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('dark-mode', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.is-dark .${e(`dark-mode${separator}${className}`)}`;
        });
      });
    }),
  ],
};
