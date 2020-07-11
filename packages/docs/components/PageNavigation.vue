<template>
  <aside>
    <nav>
      <p class="font-bold text-xs uppercase text-gray">On this page</p>
      <ul class="mt-4 space-y-1 text-sm">
        <li v-for="heading in headings" :key="heading.id" :class="{ 'ml-4': heading.level === 3 }">
          <a class="inline-block py-1" :href="`#${heading.id}`">{{ heading.text }}</a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { store } from '@/plugins/store';
import { slugify } from '@/utils/string';

const levels = ['h2', 'h3'];

export default {
  name: 'PageNavigation',
  computed: {
    headings() {
      if (!store.currentDoc) {
        return [];
      }

      return store.currentDoc.body.children
        .filter(node => levels.includes(node.tag))
        .map(heading => {
          const text = (heading.children.find(node => node.type === 'text') || { value: heading }).value;
          return {
            text,
            id: slugify(text),
            level: Number(heading.tag.replace('h', '')),
          };
        });
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
