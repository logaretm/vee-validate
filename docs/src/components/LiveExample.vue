<template>
  <div ref="elRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import sdk from '@stackblitz/sdk';

const props = defineProps<{
  id: string;
  previewOnly?: boolean;
  clickToLoad?: boolean;
}>();

const elRef = ref<HTMLElement>();

onMounted(() => {
  if (!elRef.value) {
    return;
  }

  sdk.embedProjectId(elRef.value, props.id, {
    forceEmbedLayout: true,
    openFile: 'src/App.vue',
    hideNavigation: true,
    height: 500,
    view: props.previewOnly ? 'preview' : undefined,
    clickToLoad: props.clickToLoad,
  });
});
</script>
