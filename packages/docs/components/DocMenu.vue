<template>
  <aside class="px-6 pt-24">
    <nav class="space-y-8 text-sm">
      <div v-for="category in categories" :key="category.title">
        <p class="text-xs font-bold text-gray-800 uppercase">{{ category.title }}</p>
        <ul class="mt-3 space-y-2">
          <li v-for="page in category.children" :key="page.title">
            <nuxt-link :to="page.path">{{ page.menuTitle || page.title }}</nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'DocMenu',
  async fetch() {
    const categories = [
      {
        title: 'Guides',
        content: [
          '/guide/overview',
          '/guide/validation',
          '/guide/handling-forms',
          '/guide/global-validators',
          '/guide/i18n',
        ],
      },
      {
        title: 'Tutorials and Resources',
        content: ['/tutorials/basics', '/tutorials/dynamic-form-generator', '/tutorials/best-practices', '/resources'],
      },
      {
        title: 'Examples',
        content: ['/examples/checkboxes-and-radio'],
      },
      {
        title: 'API Reference',
        content: ['/api/field', '/api/form', '/api/error-message', '/api/use-field', '/api/use-form'],
      },
    ];

    const results = await Promise.all(
      categories.map(cat => {
        return Promise.all(cat.content.map(page => this.$content(page).only(['title', 'path', 'menuTitle']).fetch()));
      })
    );

    this.categories = categories.map((c, idx) => {
      return {
        title: c.title,
        children: results[idx],
      };
    });
  },
  data: () => ({
    categories: [],
  }),
};
</script>

<style lang="postcss" scoped>
nav {
  a {
    @screen motion {
      transition: color 0.2s ease-in-out;
    }

    &:hover {
      @apply text-accent-800;
    }

    &.nuxt-link-active {
      @apply text-accent-800;
    }
  }
}
</style>
