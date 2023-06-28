<template>
  <InputText name="email" type="email" v-model="email" />

  <pre>Model: {{ email }}</pre>
</template>

<script setup>
import { ref } from 'vue';
import InputText from './InputText.vue';

const email = ref('');
</script>
