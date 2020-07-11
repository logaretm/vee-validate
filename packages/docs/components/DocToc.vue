<template>
  <aside>
    <nav class="pt-24">
      <p class="font-bold text-xs uppercase text-gray">On this page</p>
      <ul class="mt-4 space-y-1 text-sm">
        <li v-for="heading in headings" :key="heading.id" :class="{ 'ml-4': heading.depth === 3 }">
          <a class="inline-block py-1" :href="`#${heading.id}`">{{ heading.text }}</a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { store } from '@/plugins/appstate';
import { slugify } from '@/utils/string';

export default {
  name: 'PageNavigation',
  computed: {
    headings() {
      if (!store.currentDoc) {
        return [];
      }

      return store.currentDoc.toc;
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
      @apply text-accent;
      @screen motion {
        transform: translate3d(10px, 0, 0);
      }
    }
  }
}
</style>
