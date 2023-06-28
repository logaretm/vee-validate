<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const { errors, defineInputBinds } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
      password: z.string().min(6),
    })
  ),
});

const email = defineInputBinds('email');
const password = defineInputBinds('password');
</script>

<template>
  <input v-bind="email" />
  <div>{{ errors.email }}</div>

  <input v-bind="password" />
  <div>{{ errors.password }}</div>
</template>
