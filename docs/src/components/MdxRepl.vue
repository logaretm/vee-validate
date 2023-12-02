<template>
  <div class="my-8 h-[500px] relative">
    <Suspense v-if="editor">
      <Repl :editor="editor" :files="files" />

      <template #fallback>
        <div class="bg-gray-200 dark:bg-zinc-950 w-full h-full rounded-md absolute inset-0"></div>
      </template>
    </Suspense>

    <div v-else class="bg-gray-200 dark:bg-zinc-950 w-full h-full rounded-md absolute inset-0"></div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, shallowRef } from 'vue';

const Repl = defineAsyncComponent(() => import('./Repl.vue'));

const props = defineProps<{
  files: Record<string, string>;
}>();

let editor = shallowRef();
onMounted(async () => {
  editor.value = (await import('@vue/repl/codemirror-editor')).default;
});
</script>
