<template>
  <input v-model="value" :type="type || 'text'" />
  <ul v-if="errors.length">
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  name: String,
  type: String,
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { value, errors } = useField(() => props.name, undefined);
</script>
