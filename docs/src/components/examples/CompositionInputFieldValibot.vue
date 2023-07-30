<template>
  <input type="text" v-model="value" />
  {{ errorMessage }}
</template>

<script setup>
import { useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import { string, email, minLength } from 'valibot';

const { value, errorMessage } = useField('email', toTypedSchema(string([minLength(1, 'Required'), email()])));
</script>
