<template>
  <form @submit="onSubmit">
    <InputText name="firstName" />
    <InputText name="lastName" />
    <InputText name="email" type="email" />
    <InputText name="password" type="password" />
    <InputText name="passwordConfirm" type="password" />

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import InputText from './InputText.vue';

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    passwordConfirm: yup
      .string()
      .required()
      .min(6)
      .oneOf([yup.ref('password')]),
  }),
});

const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});
</script>
