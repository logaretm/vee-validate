<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { values, errors, defineInputBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
  }),
});

const email = defineInputBinds('email');
</script>

<template>
  <input v-bind="email" />

  <pre>values: {{ values }}</pre>
  <pre>errors: {{ errors }}</pre>
</template>
