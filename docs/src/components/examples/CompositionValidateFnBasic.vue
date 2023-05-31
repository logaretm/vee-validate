<script setup>
import { useForm } from 'vee-validate';

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const { errors, defineInputBinds } = useForm({
  validationSchema: {
    email: val => (isEmail(val) ? true : 'Invalid email'),
  },
});

const email = defineInputBinds('email');
</script>

<template>
  <input v-bind="email" />
  <span>{{ errors.email }}</span>
</template>
