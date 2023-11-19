<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { values, errors, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
  }),
});

const [email, emailAttrs] = defineField('email', state => {
  return {
    // validate aggressively as long as there are errors on the input
    validateOnModelUpdate: state.errors.length > 0,
  };
});
</script>

<template>
  <input v-model="email" v-bind="emailAttrs" />
  <div>{{ errors.email }}</div>

  <pre>values: {{ values }}</pre>
</template>
