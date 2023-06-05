<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { errors, submitForm, defineInputBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const email = defineInputBinds('email');
const password = defineInputBinds('password');
</script>

<template>
  <form action="/v4/submit-target/" method="get" target="_blank" @submit="submitForm">
    <input name="email" v-bind="email" />
    <span>{{ errors.email }}</span>

    <input name="password" v-bind="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </form>
</template>
