<script setup>
import { useForm } from 'vee-validate';
import CustomInput from './CustomInput.vue';

const { values, defineComponentBinds } = useForm();

const email = defineComponentBinds('email');
</script>

<template>
  <CustomInput v-bind="email" />

  <pre>values: {{ values }}</pre>
</template>
