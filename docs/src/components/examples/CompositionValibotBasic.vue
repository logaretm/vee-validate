<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import { email, string, minLength, object } from 'valibot';

const { errors, defineInputBinds } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string([minLength(1, 'Email is required'), email()]),
      password: string([minLength(6, 'password too short')]),
    }),
  ),
});

const emailField = defineInputBinds('email');
const passwordField = defineInputBinds('password');
</script>

<template>
  <input v-bind="emailField" />
  <div>{{ errors.email }}</div>

  <input v-bind="passwordField" />
  <div>{{ errors.password }}</div>
</template>
