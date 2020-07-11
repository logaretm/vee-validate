<template>
  <aside class="px-6 pt-16">
    <nav class="space-y-8 text-sm">
      <div v-for="category in categories" :key="category.title">
        <p class="text-xs font-bold text-gray uppercase">{{ category.title }}</p>
        <ul class="mt-1 space-y-2">
          <li v-for="page in category.children" :key="page.title">
            <nuxt-link :to="page.path">{{ page.title }}</nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'PrimarySidebar',
  async fetch() {
    const categories = [
      {
        title: 'Guide',
        content: ['/guide/overview'],
      },
      {
        title: 'Tutorials',
        content: ['/tutorial'],
      },
      {
        title: 'Configuration',
        content: ['/configuration'],
      },
    ];

    const results = await Promise.all(
      categories.map(cat => {
        return Promise.all(cat.content.map(page => this.$content(page).only(['title', 'path']).fetch()));
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
      @apply text-accent;
    }

    &.nuxt-link-active {
      @apply text-accent;
    }
  }
}
</style>
