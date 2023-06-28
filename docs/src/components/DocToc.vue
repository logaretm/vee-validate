<template>
  <nav class="py-4 overflow-y-auto overscroll-y-contain" v-show="headings.length">
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
  return props.headings.filter(h => h.depth <= 3 && h.depth !== 1);
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

nav {
  max-height: calc(80vh - 225px);
  a {
    @screen motion {
      transition: color 0.2s ease-in-out;
    }

    &:hover {
      @apply text-accent-800;
    }

    &[aria-current='page'] {
      @apply text-accent-800;
    }
  }

  /* Global Scrollbar styling */
  &::-webkit-scrollbar {
    width: 7px;
    cursor: pointer;
    /*background-color: rgba(229, 231, 235, var(--bg-opacity));*/
  }
  &::-webkit-scrollbar-track {
    background-color: none;
    cursor: pointer;
    /*background: red;*/
  }
  &::-webkit-scrollbar-thumb {
    cursor: pointer;
    background-color: #e8e8e8; /* #E7E5E4; */
    border-radius: 50px;
    /*outline: 1px solid grey;*/
  }
}

.dark {
  nav {
    /* Global Scrollbar styling */
    &::-webkit-scrollbar {
      width: 7px;
      cursor: pointer;
      /*background-color: rgba(229, 231, 235, var(--bg-opacity));*/
    }
    &::-webkit-scrollbar-track {
      background-color: none;
      cursor: pointer;
      /*background: red;*/
    }
    &::-webkit-scrollbar-thumb {
      cursor: pointer;
      background-color: #333; /* #E7E5E4; */
      border-radius: 50px;
      /*outline: 1px solid grey;*/
    }
  }
}
</style>
