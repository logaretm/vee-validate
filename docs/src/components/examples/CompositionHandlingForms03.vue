<template>
  <form @submit="onSubmit">
    <input v-bind="email" type="email" />
    <span>{{ errors.email }}</span>

    <input v-bind="password" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { errors, handleSubmit, defineInputBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const onSubmit = handleSubmit(
  values => {
    alert(JSON.stringify(values, null, 2));
  },
  ({ errors }) => {
    const firstError = Object.keys(errors)[0];
    const el = document.querySelector(`[name="${firstError}"]`);
    el.scrollIntoView({
      behavior: 'smooth',
    });
    el.focus();
  }
);

const email = defineInputBinds('email');
const password = defineInputBinds('password');
</script>

<style>
input,
button {
  margin-top: 300px;
  display: block;
}
</style>
