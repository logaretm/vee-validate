<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const [email, emailAttrs] = defineField('email');
const [name, nameAttrs] = defineField('name');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values, { resetForm }) => {
  console.log(values); // send data to API
  // reset the form and the field values to their initial values
  resetForm();
});
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="name" v-bind="nameAttrs" />
    {{ errors.name }}

    <input type="email" v-model="email" v-bind="emailAttrs" />
    {{ errors.email }}

    <input type="password" v-model="password" v-bind="passwordAttrs" />
    {{ errors.password }}

    <button>Submit</button>
  </form>
</template>
