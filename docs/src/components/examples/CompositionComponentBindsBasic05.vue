<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import CustomInput from './CustomInput.vue';

const { values, errors, defineInputBinds, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    emailComponent: yup.string().email().required(),
  }),
});

const email = defineInputBinds('email', state => {
  return {
    // validate aggressively as long as there are errors on the input
    validateOnInput: state.errors.length > 0,
  };
});

const emailComponent = defineComponentBinds('emailComponent', state => {
  return {
    // validate aggressively as long as there are errors on the input
    validateOnValueUpdate: state.errors.length > 0,
    validateOnBlur: true,
    props: {
      error: state.errors[0],
    },
  };
});
</script>

<template>
  <input v-bind="email" />
  <div>{{ errors.email }}</div>

  <CustomInput v-bind="emailComponent" />

  <pre>values: {{ values }}</pre>
</template>
