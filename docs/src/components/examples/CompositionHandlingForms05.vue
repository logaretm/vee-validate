<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, defineField, submitCount, errors } = useForm();

const onSubmit = handleSubmit(values => {
  console.log('Submitted', JSON.stringify(values, null, 2));
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>

<template>
  <form @submit="onSubmit">
    <pre>Submit count: {{ submitCount }}</pre>

    <input type="email" v-model="email" v-bind="emailAttrs" />
    <span>{{ errors.email }}</span>

    <input type="password" v-model="password" v-bind="passwordAttrs" />
    <span>{{ errors.password }}</span>

    <button :disabled="submitCount > 5">
      {{ submitCount > 5 ? 'You submitted too many times' : 'Submit' }}
    </button>
  </form>
</template>
