<template>
  <input type="text" v-model="value" />
  {{ errorMessage }}
</template>

<script setup>
import { useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const { value, errorMessage } = useField('email', toTypedSchema(z.string().email().min(1, 'Required')));
</script>
