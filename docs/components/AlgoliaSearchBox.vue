<template>
  <form
    id="search-form"
    role="search"
    class="px-4 mx-8 relative flex items-center w-full h-10 rounded bg-gray-700 dark-mode:bg-gray-800"
  >
    <svg
      class="fill-current text-dark pointer-events-none text-gray-600 w-4 h-4 absolute z-10"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path
        d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
      ></path>
    </svg>
    <input id="algolia-search-input" class="h-full w-full" placeholder="Search the docs" />
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
    this.initialize(this.$config.algolia, 'en');
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
            debug: true,
            inputSelector: '#algolia-search-input',
            handleSelected: (input, event, suggestion) => {
              const { pathname, hash } = new URL(suggestion.url);
              const routepath = pathname.replace(process.env.NODE_ENV === 'production' ? '/v4/' : '/', '/');
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
  @apply px-8 text-dark outline-none bg-transparent;

  &:hover {
    @apply outline-none;
  }

  &::placeholder {
    @apply text-dark opacity-50;
  }
}
#search-form {
  @apply border-2 border-transparent;
  @screen motion {
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  }

  &:focus-within {
    @apply bg-white border-accent-800;
  }
}

>>> .algolia-autocomplete {
  display: block !important;
  @apply w-full;
}

/* Highlighted text */
>>> .algolia-autocomplete .algolia-docsearch-suggestion--highlight {
  @apply text-accent-800;
}
</style>
