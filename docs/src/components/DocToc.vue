<template>
  <nav class="pt-24" v-show="headings.length">
    <p class="font-bold text-xs uppercase text-gray-400">On this page</p>
    <ul class="mt-4 space-y-1 text-sm">
      <li v-for="heading in headings" :key="heading.slug" :class="{ 'ml-4': heading.depth === 3 }">
        <a class="inline-block py-1" :href="`#${heading.slug}`">{{ heading.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  headings: { depth: number; slug: string; text: string }[];
}>();

const headings = computed(() => {
  return props.headings.filter(h => h.depth <= 3);
});
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
