<template>
  <component :is="tag">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    level: [Number, String],
  },
  computed: {
    tag() {
      return `h${this.level}`;
    },
  },
};
</script>

<style lang="postcss" scoped>
h4 >>> code:not([class]) {
  @apply text-lg;
}

h5 >>> code:not([class]) {
  @apply text-base;
}
</style>
