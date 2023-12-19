<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, defineField, isSubmitting, errors } = useForm();

const onSubmit = handleSubmit(values => {
  // Simulates a 2 second delay
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Submitted', JSON.stringify(values, null, 2));
      resolve();
    }, 2000);
  });
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>

<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    <span>{{ errors.email }}</span>

    <input type="password" v-model="password" v-bind="passwordAttrs" />
    <span>{{ errors.password }}</span>

    <button :disabled="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>
