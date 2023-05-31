<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import CustomInput from './CustomInput.vue';

const { values, errors, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
  }),
});

const email = defineComponentBinds('email', {
  validateOnValueUpdate: false,
});
</script>

<template>
  <CustomInput v-bind="email" />
  <div>{{ errors.email }}</div>

  <pre>values: {{ values }}</pre>
</template>
