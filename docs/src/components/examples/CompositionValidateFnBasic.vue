<script setup>
import { useForm } from 'vee-validate';

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const { errors, defineField } = useForm({
  validationSchema: {
    email: val => (isEmail(val) ? true : 'Invalid email'),
  },
});

const [email, emailProps] = defineField('email');
</script>

<template>
  <input v-model="email" v-bind="emailProps" />
  <span>{{ errors.email }}</span>
</template>
