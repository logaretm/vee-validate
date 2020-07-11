export default {
  mode: 'universal',

  components: true,

  publicRuntimeConfig: {
    algolia: {
      apiKey: '498c5d264196aacd7606fed9857deb44',
      indexName: 'vee-validate',
    },
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'VeeValidate',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'VeeValidate Docs',
      },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: '/img/ms-icon-144x144.png' },
      { name: 'theme-color', content: '#41b883' },
      { property: 'og:image', content: '/logo.png' },
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/img/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/img/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/img/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/img/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/img/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/img/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', href: '/img/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/img/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/android-icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/img/favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/favicon-16x16.png' },
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
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxt/content', '@nuxtjs/pwa'],

  plugins: ['@/plugins/store.client.js'],

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
