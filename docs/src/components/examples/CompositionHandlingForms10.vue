<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { defineField, errorBag } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required().min(6),
  }),
});

const [email, emailAttrs] = defineField('email');
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="email" v-bind="emailAttrs" />
    {{ errorBag.email }}

    <button>Submit</button>
  </form>
</template>
