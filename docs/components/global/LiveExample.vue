<template>
  <div ref="el"></div>
</template>

<script>
import sdk from '@stackblitz/sdk';

export default {
  name: 'CodeSandbox',
  props: {
    id: {
      type: String,
      required: true,
    },
    previewOnly: {
      type: Boolean,
      default: false,
    },
    clickToLoad: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    sdk.embedProjectId(this.$refs.el, this.id, {
      forceEmbedLayout: true,
      openFile: 'src/App.vue',
      hideNavigation: true,
      view: this.previewOnly ? 'preview' : undefined,
      clickToLoad: this.clickToLoad,
    });
  },
};
</script>
