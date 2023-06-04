<template>
  <form @submit="onSubmit">
    <input name="name" v-bind="name" />

    <textarea name="address" v-bind="address"></textarea>

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const initialUserData = {
  id: 1,
  name: '',
  address: '',
  createdAt: Date.now(),
};

const { defineInputBinds, handleSubmit } = useForm({
  initialValues: initialUserData,
});

const name = defineInputBinds('name');
const address = defineInputBinds('address');

const onSubmit = handleSubmit.withControlled(values => {
  alert(JSON.stringify(values, null, 2));
});
</script>
