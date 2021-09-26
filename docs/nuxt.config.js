const basePath = process.env.NODE_ENV === 'production' ? '/v4/' : '/';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { highlighter } = require('./highlighter');

export default {
  router: {
    base: '/v4/',
  },

  components: true,

  target: 'static',

  publicRuntimeConfig: {
    appURL: process.env.NODE_ENV === 'production' ? 'https://vee-validate.logaretm.com/v4' : 'http://localhost:3000',
    algolia: {
      apiKey: '36539f933d7a7cd4801b6f07dea75ed8',
      indexName: 'vee-validate-v4',
    },
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'VeeValidate',
    titleTemplate: '%s | vee-validate',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'VeeValidate Docs',
      },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: `${basePath}img/ms-icon-144x144.png` },
      { name: 'theme-color', content: '#41b883' },
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${basePath}favicon.ico` },
      { rel: 'apple-touch-icon', sizes: '57x57', href: `${basePath}img/apple-icon-57x57.png` },
      { rel: 'apple-touch-icon', sizes: '60x60', href: `${basePath}img/apple-icon-60x60.png` },
      { rel: 'apple-touch-icon', sizes: '72x72', href: `${basePath}img/apple-icon-72x72.png` },
      { rel: 'apple-touch-icon', sizes: '76x76', href: `${basePath}img/apple-icon-76x76.png` },
      { rel: 'apple-touch-icon', sizes: '114x114', href: `${basePath}img/apple-icon-114x114.png` },
      { rel: 'apple-touch-icon', sizes: '120x120', href: `${basePath}img/apple-icon-120x120.png` },
      { rel: 'apple-touch-icon', sizes: '144x144', href: `${basePath}img/apple-icon-144x144.png` },
      { rel: 'apple-touch-icon', sizes: '152x152', href: `${basePath}img/apple-icon-152x152.png` },
      { rel: 'apple-touch-icon', sizes: '180x180', href: `${basePath}img/apple-icon-180x180.png` },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${basePath}img/android-icon-192x192.png` },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${basePath}img/favicon-32x32.png` },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: `${basePath}img/favicon-96x96.png` },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${basePath}img/favicon-16x16.png` },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#2678C5' },

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/tailwindcss'],

  hooks: {
    'vue-renderer:ssr:templateParams': function (params) {
      params.HEAD = params.HEAD.replace('<base href="/v4/">', '');
    },
  },

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxt/content', '@nuxtjs/pwa'],

  plugins: ['@/plugins/store.client.js'],

  content: {
    liveEdit: false,
    markdown: {
      highlighter,
    },
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        'postcss-nested': {},
        autoprefixer: {},
      },
    },
  },
};
