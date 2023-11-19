<script setup>
import { useForm } from 'vee-validate';
import CustomInput from './CustomInput.vue';

const { values, defineField } = useForm();

const [email, emailProps] = defineField('email');
</script>

<template>
  <CustomInput v-model="email" v-bind="emailProps" />

  <pre>values: {{ values }}</pre>
</template>
