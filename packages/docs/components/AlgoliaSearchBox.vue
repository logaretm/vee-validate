<template>
  <form id="search-form" role="search" class="w-full px-6">
    <input id="algolia-search-input" class="w-full h-8 rounded bg-gray" :placeholder="placeholder" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      placeholder: undefined,
    };
  },
  mounted() {
    this.initialize(this.$config.algolia, this.$lang);
  },
  methods: {
    initialize(userOptions, lang) {
      Promise.all([
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.js'),
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.css'),
      ]).then(([docsearch]) => {
        docsearch = docsearch.default;
        const { algoliaOptions = {} } = userOptions;
        docsearch(
          Object.assign({}, userOptions, {
            inputSelector: '#algolia-search-input',
            // #697 Make docsearch work well at i18n mode.
            algoliaOptions: Object.assign(
              {
                facetFilters: [`lang:${lang}`].concat(algoliaOptions.facetFilters || []),
              },
              algoliaOptions
            ),
            handleSelected: (input, event, suggestion) => {
              const { pathname, hash } = new URL(suggestion.url);
              const routepath = pathname.replace(this.$site.base, '/');
              this.$router.push(`${routepath}${hash}`);
            },
          })
        );
      });
    },
    update(options, lang) {
      this.$el.innerHTML = '<input id="algolia-search-input" class="search-query">';
      this.initialize(options, lang);
    },
  },
  watch: {
    $lang(newValue) {
      this.update(this.options, newValue);
    },
    options(newValue) {
      this.update(newValue, this.$lang);
    },
  },
};
</script>

<style lang="postcss" scoped>
#algolia-search-input {
  @apply px-4 text-black;
  @screen motion {
    transition: background-color 0.2s ease-in-out;
  }

  &:hover {
    @apply outline-none;
  }

  &:focus {
    @apply bg-white;
  }
}
</style>
