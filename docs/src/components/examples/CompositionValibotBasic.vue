<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import * as v from 'valibot';

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    v.object({
      email: v.pipe(v.string(), v.email('Invalid Email'), v.nonEmpty('Email is required')),
      password: v.pipe(v.string(), v.minLength(6, 'password too short')),
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
