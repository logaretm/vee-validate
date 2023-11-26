<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />

    <input type="password" v-model="password" v-bind="passwordAttrs" />

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, defineField } = useForm({
  initialValues: {
    email: 'test@example.com',
    password: 'p@$$w0rd',
  },
});

const onSubmit = handleSubmit(values => {
  console.log(JSON.stringify(values, null, 2));
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>
