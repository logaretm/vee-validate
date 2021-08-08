<template>
  <span class="px-2 py-1 bg-accent-900 text-white text-sm rounded-lg">{{ title }}</span>
</template>

<script>
export default {
  name: 'DocBadge',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
