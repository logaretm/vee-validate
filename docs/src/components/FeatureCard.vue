<template>
  <div
    ref="elementRef"
    class="FeatureCard bg-gradient-to-br from-gray-200 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 p-6 rounded-3xl font-display shadow-sm"
  >
    <h3 class="text-xl font-bold z-10">{{ feature.title }}</h3>
    <p class="z-10 mt-4 font-display font-medium text-gray-600 dark:text-gray-300" v-html="feature.details" />
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { useEventListener } from '@vueuse/core';

const props = defineProps<{
  feature: {
    title: string;
    details: string;
  };
}>();

const elementRef = shallowRef<HTMLElement>();

useEventListener(
  elementRef,
  'mousemove',
  evt => {
    if (!elementRef.value) {
      return;
    }

    const { x, y } = elementRef.value.getBoundingClientRect();

    elementRef.value.style.setProperty('--x', `${evt.clientX - x}px`);
    elementRef.value.style.setProperty('--y', `${evt.clientY - y}px`);
  },
  { passive: true },
);
</script>

<style lang="postcss" scoped>
.FeatureCard {
  @apply relative;

  &:before {
    @apply pointer-events-none absolute select-none rounded-3xl opacity-0;
    z-index: -1;
    content: '';
    inset: -1px;
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.3s;
    animation-duration: 0.3s;
    background: radial-gradient(200px circle at var(--x) var(--y), #009f53 0, #06d77b 0, #009f53 25%, transparent 80%);
  }

  &:hover:before {
    @apply opacity-100;
  }
}
</style>
