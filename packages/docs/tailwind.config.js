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
    content: ['components/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue', 'plugins/**/*.js', 'nuxt.config.js'],
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
        gray: '#a2a2a2',
        'gray-lighter': '#e8e8e8',
        accent: '#06d77b',
        'accent-lighter': '#7bffc5',
        'accent-darker': '#009f53',

        warning: 'hsl(33deg 100% 77%)',
        error: '#cf6679',
      },
      screens: {
        motion: { raw: '(prefers-reduced-motion: no-preference)' },
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'light-mode'],
    textColor: ['responsive', 'hover', 'focus', 'light-mode'],
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('light-mode', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.is-light .${e(`light-mode${separator}${className}`)}`;
        });
      });
    }),
  ],
};
