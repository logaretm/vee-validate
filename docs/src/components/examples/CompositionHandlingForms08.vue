<template>
  <form @submit="">
    <input v-bind="name" />
    {{ errors.name }}

    <input type="email" v-bind="email" />
    {{ errors.email }}

    <input type="password" v-bind="password" />
    {{ errors.password }}

    <button type="button" @click="resetForm()">Reset</button>
    <button
      type="button"
      @click="resetForm({ values: { email: 'test@email.com' }, errors: { password: 'Password taken 😜' } })"
    >
      Reset to specific state
    </button>

    <pre>{{ meta }}</pre>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { resetForm, defineInputBinds, meta } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const email = defineInputBinds('email');
const name = defineInputBinds('name');
const password = defineInputBinds('password');
</script>
