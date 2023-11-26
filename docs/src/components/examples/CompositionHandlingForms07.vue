<template>
  <input type="email" v-model="email" v-bind="emailAttrs" />

  <input type="password" v-model="password" v-bind="passwordAttrs" />

  <button @click="updateValues">Update values</button>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { defineField, setFieldValue, setValues } = useForm();

function updateValues() {
  // set a single field value
  // setFieldValue('email', 'test@example.com');

  // set multiple fields values
  setValues({
    email: 'test@example.com',
    password: 'p@$$w0rd',
  });
}

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>
