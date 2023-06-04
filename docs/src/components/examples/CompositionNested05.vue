<template>
  <form @submit="onSubmit">
    <input v-bind="name" />
    <span>{{ errors['user.name'] }}</span>
    <input v-bind="address" />
    <span>{{ errors['user.addresses[0]'] }}</span>

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

const { handleSubmit, errors, defineInputBinds } = useForm({
  validationSchema: yup.object({
    user: yup.object({
      name: yup.string().required(),
      addresses: yup.array().of(yup.string().required()),
    }),
  }),
});

const name = defineInputBinds('user.name');
const address = defineInputBinds('user.addresses[0]');

const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});
</script>
