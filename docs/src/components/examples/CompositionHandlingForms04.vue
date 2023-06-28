<template>
  <form @submit="onSubmit">
    <input type="email" v-bind="email" />
    <span>{{ errors.email }}</span>

    <input type="password" v-bind="password" />
    <span>{{ errors.password }}</span>

    <button :disabled="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, defineInputBinds, isSubmitting, errors } = useForm();

const onSubmit = handleSubmit(values => {
  // Simulates a 2 second delay
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Submitted', JSON.stringify(values, null, 2));
      resolve();
    }, 2000);
  });
});

const email = defineInputBinds('email');
const password = defineInputBinds('password');
</script>
