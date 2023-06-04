<template>
  <InputText name="email" type="email" v-model="email" />
</template>

<script setup>
import { useField } from 'vee-validate';
import { ref } from 'vue';
import InputText from './InputText.vue';

const email = ref('');
</script>
