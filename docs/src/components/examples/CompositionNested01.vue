<template>
  <form @submit="onSubmit">
    <input v-model="twitter" type="url" placeholder="twitter" />
    <input v-model="github" type="url" placeholder="github" />

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, defineField } = useForm();
const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});

const [twitter] = defineField('links.twitter');
const [github] = defineField('links.github');
</script>
