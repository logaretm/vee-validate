<template>
  <input type="email" v-bind="email" />

  <input type="password" v-bind="password" />

  <button @click="updateValues">Update values</button>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { defineInputBinds, setFieldValue, setValues } = useForm();

function updateValues() {
  // set a single field value
  // setFieldValue('email', 'test@example.com');

  // set multiple fields values
  setValues({
    email: 'test@example.com',
    password: 'p@$$w0rd',
  });
}

const email = defineInputBinds('email');
const password = defineInputBinds('password');
</script>
