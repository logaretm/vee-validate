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
    fontSize: {
      tiny: '13px',
      xs: 'calc(11px + 0.25vw)',
      sm: 'calc(12px + 0.25vw)',
      base: 'calc(14px + 0.25vw)',
      lg: '1.15em',
      xl: 'calc(1em + 0.40vw)',
      '2xl': 'calc(1em + 0.75vw)',
      '3xl': 'calc(1em + 1.75vw)',
      '6xl': 'calc(1em + 2.8vw)',
    },
    extend: {
      colors: {
        error: '#cf6679',
        'dark-light': '#151518',
        dark: '#0f0f11',
        gray: '#a2a2a2',
        'gray-lighter': '#e8e8e8',
        accent: '#09a884',
      },
      screens: {
        motion: { raw: '(prefers-reduced-motion: no-preference)' },
      },
    },
  },
  variants: {},
  plugins: [],
};
