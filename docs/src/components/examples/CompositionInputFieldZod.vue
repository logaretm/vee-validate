<template>
  <input type="text" v-model="value" />
  {{ errorMessage }}
</template>

<script setup>
import { useField } from 'vee-validate';
import { z } from 'zod';

const { value, errorMessage } = useField('email', z.string().email().min(1, 'Required'));
</script>
