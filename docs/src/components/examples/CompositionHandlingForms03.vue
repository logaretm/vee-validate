<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { errors, handleSubmit, defineField } = useForm({
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
    el?.scrollIntoView({
      behavior: 'smooth',
    });
    el.focus();
  },
);

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="email" v-bind="emailAttrs" name="email" type="email" />
    <span>{{ errors.email }}</span>

    <input v-model="password" v-bind="passwordAttrs" name="password" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </form>
</template>

<style>
input,
button {
  margin-top: 300px;
  display: block;
}
</style>
