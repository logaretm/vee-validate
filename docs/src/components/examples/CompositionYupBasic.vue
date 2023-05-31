<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';

const { errors, defineInputBinds } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      email: yup.string().min(1).email(),
      password: yup.string().min(6),
    })
  ),
});

const email = defineInputBinds('email');
const password = defineInputBinds('email');
</script>

<template>
  <input v-bind="email" />
  <div>{{ errors.email }}</div>

  <input v-bind="password" />
  <div>{{ errors.password }}</div>
</template>
