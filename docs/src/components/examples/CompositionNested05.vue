<template>
  <form @submit="onSubmit">
    <input v-model="name" v-bind="nameAttrs" />
    <span>{{ errors['user.name'] }}</span>
    <input v-model="address" v-bind="addressAttrs" />
    <span>{{ errors['user.addresses[0]'] }}</span>

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    user: yup.object({
      name: yup.string().required(),
      addresses: yup.array().of(yup.string().required()),
    }),
  }),
});

const [name, nameAttrs] = defineField('user.name');
const [address, addressAttrs] = defineField('user.addresses[0]');

const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});
</script>
