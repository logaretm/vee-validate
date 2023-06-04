<template>
  <form @submit="onSubmit">
    <input v-bind="email" />
    {{ errorBag.email }}

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { defineInputBinds, errorBag } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required().min(6),
  }),
});

const email = defineInputBinds('email');
</script>
