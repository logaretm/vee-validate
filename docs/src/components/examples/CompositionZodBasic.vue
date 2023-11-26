<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
      password: z.string().min(6),
    }),
  ),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>

<template>
  <input v-model="email" v-bind="emailAttrs" />
  <div>{{ errors.email }}</div>

  <input v-model="password" v-bind="passwordAttrs" />
  <div>{{ errors.password }}</div>
</template>
