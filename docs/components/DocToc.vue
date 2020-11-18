<template>
  <aside>
    <nav class="pt-24" v-show="headings.length">
      <p class="font-bold text-xs uppercase text-gray-400">On this page</p>
      <ul class="mt-4 space-y-1 text-sm">
        <li v-for="heading in headings" :key="heading.id" :class="{ 'ml-4': heading.depth === 3 }">
          <nuxt-link class="inline-block py-1" :to="`${$route.path}#${heading.id}`">{{ heading.text }}</nuxt-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { slugify } from '@/utils/string';

export default {
  name: 'DocToc',
  computed: {
    headings() {
      if (!this.$store.state.doc) {
        return [];
      }

      return this.$store.state.doc.toc;
    },
  },
};
</script>

<style lang="postcss" scoped>
nav {
  a {
    @screen motion {
      transition: transform 0.3s ease-in-out, color 0.2s ease-in-out;
    }

    &:hover {
      @apply text-accent-800;
      @screen motion {
        transform: translate3d(10px, 0, 0);
      }
    }
  }
}
</style>
