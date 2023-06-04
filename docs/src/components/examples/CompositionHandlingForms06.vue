<template>
  <form @submit="onSubmit">
    <input type="email" v-bind="email" />

    <input type="password" v-bind="password" />

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, defineInputBinds } = useForm({
  initialValues: {
    email: 'test@example.com',
    password: 'p@$$w0rd',
  },
});

const onSubmit = handleSubmit(values => {
  console.log(JSON.stringify(values, null, 2));
});

const email = defineInputBinds('email');
const password = defineInputBinds('password');
</script>
