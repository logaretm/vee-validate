<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import { email as emailValidator, string, minLength, object } from 'valibot';

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string([minLength(1, 'Email is required'), emailValidator()]),
      password: string([minLength(6, 'password too short')]),
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
