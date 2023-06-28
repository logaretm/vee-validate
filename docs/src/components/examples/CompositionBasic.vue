<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const { defineInputBinds, errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const email = defineInputBinds('email');
const password = defineInputBinds('password');

const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <form @submit="onSubmit">
    <input v-bind="email" name="email" type="email" />
    <span>{{ errors.email }}</span>

    <input v-bind="password" name="password" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </form>
</template>
