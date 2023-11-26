<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { errors, submitForm, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>

<template>
  <form action="/v4/submit-target/" method="get" target="_blank" @submit="submitForm">
    <input name="email" v-model="email" v-bind="emailAttrs" />
    <span>{{ errors.email }}</span>

    <input name="password" v-model="password" v-bind="passwordAttrs" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </form>
</template>
