<template>
  <svg class="icon flex-shrink-0">
    <use :xlink:href="`${basePath}#icon-${name}`"></use>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();

const basePath = import.meta.env.DEV ? '' : '/v4/sprite.svg';
</script>
