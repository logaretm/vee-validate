<template>
  <aside>
    <nav>
      <div v-for="category in categories" :key="category.title">
        <ul>
          <li v-for="link in category.links" :key="link.title">
            <nuxt-link :to="link.path">{{ link.title }}</nuxt-link>
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
        title: 'Tutorial',
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
        links: results[idx],
      };
    });
  },
  data: () => ({
    categories: [],
  }),
};
</script>
