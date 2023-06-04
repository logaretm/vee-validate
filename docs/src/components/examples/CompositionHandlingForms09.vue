<template>
  <form @submit="onSubmit">
    <input v-bind="name" />
    {{ errors.name }}

    <input type="email" v-bind="email" />
    {{ errors.email }}

    <input type="password" v-bind="password" />
    {{ errors.password }}

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { defineInputBinds, errors, handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const email = defineInputBinds('email');
const name = defineInputBinds('name');
const password = defineInputBinds('password');

const onSubmit = handleSubmit((values, { resetForm }) => {
  console.log(values); // send data to API
  // reset the form and the field values to their initial values
  resetForm();
});
</script>
