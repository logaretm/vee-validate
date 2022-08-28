<template>
  <span class="px-2 py-1 bg-accent-800 text-white text-sm rounded-lg">{{ title }}</span>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
