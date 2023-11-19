<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { values, errors, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
  }),
});

const [email, emailAttrs] = defineField('email');
</script>

<template>
  <input v-model="email" v-bind="emailAttrs" />

  <pre>values: {{ values }}</pre>
  <pre>errors: {{ errors }}</pre>
</template>
