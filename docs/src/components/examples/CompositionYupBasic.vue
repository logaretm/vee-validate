<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';

const { errors, defineInputBinds } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
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
