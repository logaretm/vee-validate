const sidebars = {
  components: [
    'components',
    'components/validation-provider',
    'components/validation-observer'
  ],
  guide: [
    '',
    'getting-started',
    'syntax',
    'rules',
    'custom-rules',
    'inferred-rules',
    'messages',
    'localization',
    'flags',
    'events',
    'conditional-and-looping-inputs',
    'ui-integrations'
  ],
  api: [
    'directive',
    'mixin',
    'data-attrs',
    'errorbag',
    'field',
    'validator'
  ],
  concepts: [
    '',
    'components',
    'injections',
    'backend',
    'bundle-size'
  ],
  examples: [
    '',
    'debounce',
    'using-v-model',
    'initial-value',
    'vuex',
    'radio',
    'checkboxes',
    'async-backend-validation',
    'scopes',
    'selecting-errors',
    'custom-component',
    'locale',
    'validation-providers'
  ]
};

function genSidebarConfig(...names) {
  return names.map(t => {
    return {
      title: t,
      collapsable: false,
      children: sidebars[t.toLowerCase()]
    }
  });
}

module.exports = {
  title: 'VeeValidate',
  description: 'Input validation for Vue.js',
  ga: 'UA-100131478-1',
  serviceWorker: true,
  base: '/vee-validate/',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: "msapplication-TileColor", content: "#ffffff" }],
    ['meta', { name: "msapplication-TileImage", content: "/img/ms-icon-144x144.png" }],
    ['meta', { name: "theme-color", content: "#41b883" }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:image', content: 'https://s3.eu-central-1.amazonaws.com/logaretm/vee-validate.svg' }],
    ['link', { rel: "apple-touch-icon", sizes: "57x57", href: "/img/apple-icon-57x57.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "60x60", href: "/img/apple-icon-60x60.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "72x72", href: "/img/apple-icon-72x72.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "76x76", href: "/img/apple-icon-76x76.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "114x114", href: "/img/apple-icon-114x114.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "120x120", href: "/img/apple-icon-120x120.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "144x144", href: "/img/apple-icon-144x144.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "152x152", href: "/img/apple-icon-152x152.png" }],
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/img/apple-icon-180x180.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "192x192", href: "/img/android-icon-192x192.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/img/favicon-32x32.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "96x96", href: "/img/favicon-96x96.png" }],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/img/favicon-16x16.png" }]
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'VeeValidate',
      description: 'Input validation for Vue.js'
    }
  },
  themeConfig: {
    repo: 'baianat/vee-validate',
    docsRepo: 'baianat/vee-validate',
    docsDir: 'docs',
    editLinks: true,
    serviceWorker: {
      updatePopup: { message: "New content is available.", buttonText: "Refresh" }
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Help us improve this page!',
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'Config', link: '/configuration' },
          { text: 'Concepts', link: '/concepts/' },
          { text: 'Examples', link: '/examples/' },
          { text: 'API', link: '/api/' }
        ],
        sidebarDepth: 3,
        sidebar: {
          '/guide/': genSidebarConfig('Guide', 'Components'),
          '/concepts/': genSidebarConfig('Concepts'),
          '/examples/': genSidebarConfig('Examples'),
          '/api/': genSidebarConfig('API'),
        }
      }
    }
  }
};
