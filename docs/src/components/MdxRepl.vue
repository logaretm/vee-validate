<template>
  <div class="my-8">
    <Suspense>
      <Repl :files="files" client:only v-if="mounted" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { useMounted } from '@vueuse/core';
import { defineAsyncComponent } from 'vue';

const Repl = defineAsyncComponent(() => import('./Repl.vue'));

const props = defineProps<{
  files: Record<string, string>;
}>();

const mounted = useMounted();
</script>
