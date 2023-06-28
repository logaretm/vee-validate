<template>
  <form @submit="onSubmit">
    <pre>Submit count: {{ submitCount }}</pre>

    <input type="email" v-bind="email" />
    <span>{{ errors.email }}</span>

    <input type="password" v-bind="password" />
    <span>{{ errors.password }}</span>

    <button :disabled="submitCount > 5">
      {{ submitCount > 5 ? 'You submitted too many times' : 'Submit' }}
    </button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, defineInputBinds, submitCount, errors } = useForm();

const onSubmit = handleSubmit(values => {
  console.log('Submitted', JSON.stringify(values, null, 2));
});

const email = defineInputBinds('email');
const password = defineInputBinds('password');
</script>
