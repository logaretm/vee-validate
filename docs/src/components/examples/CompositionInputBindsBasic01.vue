<script setup>
import { useForm } from 'vee-validate';

const { values, defineInputBinds } = useForm();

const email = defineInputBinds('email');
</script>

<template>
  <input v-bind="email" type="text" />

  <pre>values: {{ values }}</pre>
</template>
