<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import CustomInput from './CustomInput.vue';

const { values, errors, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
  }),
});

const [email, emailProps] = defineField('email');
</script>

<template>
  <CustomInput v-model="email" v-bind="emailProps" />

  <pre>errors: {{ errors }}</pre>
  <pre>values: {{ values }}</pre>
</template>
