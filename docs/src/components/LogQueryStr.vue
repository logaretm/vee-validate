<template>
  <div>
    Submitted data:

    <pre>{{ queryObj }}</pre>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const queryObj = ref();

onMounted(() => {
  try {
    const query = new URLSearchParams(window.location.search);

    queryObj.value = Object.fromEntries(query.entries());
  } catch {
    queryObj.value = { Error: 'Invalid query string in URL' };
  }
});
</script>

<style scoped></style>
