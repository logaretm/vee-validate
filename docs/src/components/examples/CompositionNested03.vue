<template>
  <form @submit="onSubmit">
    <input v-bind="twitter" type="url" placeholder="twitter" />
    <input v-bind="github" type="url" placeholder="github" />

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';

const { handleSubmit, defineInputBinds } = useForm();
const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});

const twitter = defineInputBinds('[links.twitter]');
const github = defineInputBinds('[links.github]');
</script>
