<script setup>
import { useForm } from 'vee-validate';

const { values, defineField } = useForm();

const [email, emailAttrs] = defineField('email');
</script>

<template>
  <input v-model="email" v-bind="emailAttrs" type="text" />

  <pre>values: {{ values }}</pre>
</template>
