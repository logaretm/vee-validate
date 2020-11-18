/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  darkMode: 'class',
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
        'accent-900': '#009f53',
        'accent-800': 'var(--accent, #06d77b)',
        'accent-100': '#7bffc5',

        warning: '#ffa629',
        error: '#cf6679',

        black: '#000',
        white: '#fff',

        'gray-800': '#151518',
        'gray-700': 'hsl(240 6% 9%)',
        'gray-600': '#333',
        'gray-500': 'hsl(0 0% 29%)',
        'gray-400': '#a2a2a2',
        'gray-300': 'hsl(0 0% 74%)',
        'gray-200': '#e8e8e8',
        'gray-100': '#f6f6f6',

        background: '#22212C',

        patreon: 'rgb(255, 66, 77)',
      },

      screens: {
        motion: { raw: '(prefers-reduced-motion: no-preference)' },
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'dark'],
    textColor: ['responsive', 'hover', 'focus', 'dark'],
    borderColor: ['responsive', 'hover', 'focus', 'dark'],
  },
};
