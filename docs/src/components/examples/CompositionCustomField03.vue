<template>
  <InputText name="email" type="email" />
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import InputText from './InputText.vue';

useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
  }),
});
</script>
