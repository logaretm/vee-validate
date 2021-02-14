<template>
  <aside class="px-6 pt-24">
    <nav class="space-y-8 md:text-sm overflow-y-auto overscroll-y-contain">
      <div v-for="category in categories" :key="category.title">
        <p class="md:text-xs font-bold text-gray-400 uppercase">{{ category.title }}</p>
        <ul class="mt-3 space-y-2 w-full">
          <li v-for="page in category.pages" :key="page.title" class="group">
            <nuxt-link v-if="!page.pages" :to="page.path">{{ page.menuTitle || page.title }}</nuxt-link>

            <div v-else class="flex flex-col bg-gray-200 dark:bg-gray-600 w-full rounded-lg py-3 px-2">
              <button
                type="button"
                @click="page.expanded = !page.expanded"
                class="w-full flex items-center focus:outline-none transition-colors duration-300"
              >
                <span v-html="page.icon"></span>
                <span class="ml-2 group-hover:text-accent-800">{{ page.title }}</span>

                <svg
                  class="ml-auto w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    v-if="!page.expanded"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>

                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>

              <ExpandTransition>
                <ul v-show="page.expanded" class="mt-3 space-y-2">
                  <li v-for="childPage in page.pages" :key="childPage.title" class="pl-7">
                    <nuxt-link :to="childPage.path">{{ childPage.menuTitle || childPage.title }}</nuxt-link>
                  </li>
                </ul>
              </ExpandTransition>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script>
const GROUPS = [
  {
    name: 'guide',
    contentPath: 'guide',
    children: [
      {
        name: 'Components',
        contentPath: 'guide/components',
        icon: `<svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          ></path>
        </svg>
        `,
      },
      {
        name: 'Composition API',
        contentPath: 'guide/composition-api',
        icon: `
          <svg
            class="w-5 h5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
            ></path>
          </svg>
        `,
      },
    ],
  },
  {
    name: 'tutorials',
    contentPath: 'tutorials',
  },
  {
    name: 'examples',
    contentPath: 'examples',
  },
  {
    name: 'integrations',
    contentPath: 'integrations',
  },
  {
    name: 'resources',
    contentPath: 'resources',
  },
  {
    name: 'api reference',
    contentPath: 'api',
  },
];

export default {
  name: 'DocMenu',
  async fetch() {
    const categories = [];
    for (const group of GROUPS) {
      const pages = await this.$content(group.contentPath).only(['title', 'path', 'order', 'menuTitle']).fetch();
      let children = [];

      if (group.children) {
        for (const child of group.children) {
          const childPages = await this.$content(child.contentPath)
            .only(['title', 'path', 'order', 'menuTitle'])
            .fetch();

          children.push({
            title: child.name,
            icon: child.icon,
            expanded: this.$route.path.indexOf(child.contentPath) >= 0,
            pages: Array.isArray(childPages) ? childPages.sort((a, b) => a.order - b.order) : [childPages],
            order: childPages[0].order,
          });
        }

        pages.push(...children);
      }

      categories.push({
        title: group.name,
        pages: Array.isArray(pages) ? pages.sort((a, b) => a.order - b.order) : [pages],
      });
    }

    this.categories = categories;
  },
  data: () => ({
    categories: [],
  }),
};
</script>

<style lang="postcss" scoped>
nav {
  max-height: calc(80vh - 96px);
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
