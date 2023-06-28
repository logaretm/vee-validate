<template>
  <input type="text" v-model="value" />
  {{ errorMessage }}
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup';

const { value, errorMessage } = useField('email', yup.string().email().required());
</script>
