<template>
  <div class="mt-14 flex flex-col items-center">
    <div
      class="bg-gray-200 dark:bg-black max-w-xs p-1 rounded-md flex items-center gap-2 font-display font-semibold text-sm mb-8"
    >
      <button
        type="button"
        class="flavor-btn"
        :aria-pressed="currentFlavor === 'components'"
        @click="setFlavor('components')"
      >
        Components
      </button>
      <button
        type="button"
        class="flavor-btn"
        :aria-pressed="currentFlavor === 'composition'"
        @click="setFlavor('composition')"
      >
        Composition API
      </button>
    </div>

    <div v-if="currentFlavor === 'components'" class="w-full">
      <MdxRepl :files="{ 'App.vue': 'ComponentsBasic' }" />
    </div>

    <div v-else class="w-full">
      <MdxRepl :files="{ 'App.vue': 'CompositionBasic' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MdxRepl from './MdxRepl.vue';

const currentFlavor = ref<'components' | 'composition'>('components');

function setFlavor(flavor: (typeof currentFlavor)['value']) {
  currentFlavor.value = flavor;
}
</script>

<style lang="postcss" scoped>
.flavor-btn {
  @apply px-3 py-1.5 rounded-md hover:text-emerald-500 select-none;

  &[aria-pressed='true'] {
    @apply bg-emerald-500 dark:bg-emerald-600 text-white hover:text-white;
  }
}

iframe {
  @apply w-full min-h-[800px] rounded-md border-4 border-emerald-500 border-opacity-60;
}
</style>
