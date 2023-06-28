<template>
  <form @submit="onSubmit" novalidate>
    <div v-for="(field, idx) in fields" :key="field.key">
      <input v-model="field.value" type="url" />

      <button type="button" @click="remove(idx)">Remove</button>
    </div>

    <button type="button" @click="push('')">Add</button>

    <button>Submit</button>
  </form>
</template>

<script setup>
import { useForm, useFieldArray } from 'vee-validate';

const { handleSubmit } = useForm({
  initialValues: {
    links: ['https://github.com/logaretm'],
  },
});

const { remove, push, fields } = useFieldArray('links');

const onSubmit = handleSubmit(values => {
  console.log(JSON.stringify(values, null, 2));
});
</script>
