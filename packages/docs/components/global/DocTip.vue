<template>
  <div
    class="p-6 rounded my-8 border-l-4 dark-mode:bg-black bg-gray-lighter"
    :class="{
      'border-accent-darker': type === 'tip',
      'border-warning': type === 'warn',
      'border-error': type === 'error',
    }"
  >
    <h4 v-if="title" class="font-bold text-lg mb-4">{{ title }}</h4>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'DocTip',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'tip',
    },
  },
};
</script>

<style lang="postcss" scoped></style>
