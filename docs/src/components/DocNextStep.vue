<template>
  <div class="pt-4">
    <h2 class="text-xl">Next Step</h2>

    <p v-if="intro">{{ intro }}</p>

    <a :href="href" class="mt-8 bg-accent-800 w-full flex items-start p-4 rounded text-white">
      <svg
        class="w-5 h-5 mr-2 mt-1 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
      </svg>
      <div class="NextTitle flex flex-col">
        <span class="text-lg font-semibold flex">{{ title }}</span>
        <span class="mt-2 text-sm">{{ description }}</span>
      </div>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { trim, trimEnd } from 'lodash-es';

const props = defineProps<{
  title: string;
  description: string;
  path: string;
  intro: string;
}>();

const href = computed(() => {
  return `${trimEnd(import.meta.env.BASE_URL, '/')}/${trim(props.path, '/')}/`;
});
</script>

<style lang="postcss" scoped>
h2 {
  @apply font-semibold mb-8 relative;
  transform: translateX(2ch);
  &::before {
    @apply absolute text-accent-800;
    margin-left: -2ch;
    content: '#';
  }

  @screen lg {
    transform: none;
  }
}

a {
  .NextTitle {
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    .NextTitle {
      transform: translate3d(10px, 0, 0);
    }
  }
}
</style>
