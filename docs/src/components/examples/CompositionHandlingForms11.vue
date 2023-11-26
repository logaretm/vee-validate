<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    {{ errors.email }}

    <input type="password" v-model="password" v-bind="passwordAttrs" />
    {{ errors.password }}

    <button>Login</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { defineField, handleSubmit, errors, setFieldError } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values, { setFieldError }) => {
  console.log(values); // send data to API

  // Set errors on Fields
  setFieldError('email', 'Incorrect credentials');
  setFieldError('password', 'Incorrect credentials');
});
</script>
